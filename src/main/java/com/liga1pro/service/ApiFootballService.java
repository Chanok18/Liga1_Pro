package com.liga1pro.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.MissingNode;
import com.liga1pro.dto.EstadisticaJugadorDTO;
import com.liga1pro.dto.TablaPosicionesDTO;
import com.liga1pro.model.Equipo;
import com.liga1pro.model.EstadoPartido;
import com.liga1pro.model.EstadisticaJugador;
import com.liga1pro.model.Jugador;
import com.liga1pro.model.Partido;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ApiFootballService implements InitializingBean {

    private static final ZoneId APP_ZONE = ZoneId.of("America/Lima");
    private static final Pattern ROUND_NUMBER = Pattern.compile("(\\d+)$");
    private static final Duration DEFAULT_STALE_GRACE = Duration.ofDays(7);

    private final RestClient.Builder restClientBuilder;
    private final ObjectMapper objectMapper;

    @Value("${api.football.base-url:https://v3.football.api-sports.io}")
    private String baseUrl;

    @Value("${api.football.key:}")
    private String apiKey;

    @Value("${api.football.league-id:281}")
    private Long leagueId;

    @Value("${api.football.season:2024}")
    private Integer season;

    @Value("${api.football.cache-minutes:10}")
    private long cacheMinutes;

    @Value("${api.football.cache-file:data/api-football-cache.json}")
    private String cacheFilePath;

    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();
    private final Map<String, Object> cacheLocks = new ConcurrentHashMap<>();

    @Override
    public void afterPropertiesSet() {
        loadPersistentCache();
    }

    public List<Equipo> listarEquipos() {
        JsonNode response = getCached("/teams", Map.of(
                "league", String.valueOf(leagueId),
                "season", String.valueOf(season)
        ));

        List<Equipo> equipos = new ArrayList<>();
        for (JsonNode item : response.path("response")) {
            equipos.add(mapEquipo(item.path("team"), item.path("venue")));
        }
        equipos.sort(Comparator.comparing(Equipo::getNombre, String.CASE_INSENSITIVE_ORDER));
        return equipos;
    }

    public Equipo buscarEquipoPorId(Long id) {
        JsonNode response = getCached("/teams", Map.of("id", String.valueOf(id)));
        JsonNode item = response.path("response").isArray() && response.path("response").size() > 0
                ? response.path("response").get(0)
                : null;
        if (item == null) {
            throw new ResponseStatusException(NOT_FOUND, "Equipo no encontrado");
        }
        return mapEquipo(item.path("team"), item.path("venue"));
    }

    public Equipo buscarEquipoPorNombre(String nombre) {
        JsonNode response = getCached("/teams", Map.of("search", nombre));

        for (JsonNode item : response.path("response")) {
            Equipo equipo = mapEquipo(item.path("team"), item.path("venue"));
            if (normalizeTeamName(equipo.getNombre()).equals(normalizeTeamName(nombre))) {
                return equipo;
            }
        }

        JsonNode firstItem = response.path("response").isArray() && response.path("response").size() > 0
                ? response.path("response").get(0)
                : null;
        if (firstItem == null) {
            throw new ResponseStatusException(NOT_FOUND, "Equipo no encontrado");
        }
        return mapEquipo(firstItem.path("team"), firstItem.path("venue"));
    }

    public List<Partido> listarPartidos() {
        JsonNode response = getCached("/fixtures", Map.of(
                "league", String.valueOf(leagueId),
                "season", String.valueOf(season)
        ));

        List<Partido> partidos = new ArrayList<>();
        for (JsonNode item : response.path("response")) {
            partidos.add(mapPartido(item));
        }
        partidos.sort(Comparator.comparing(Partido::getFecha).thenComparing(Partido::getHora, Comparator.nullsLast(Comparator.naturalOrder())));
        return partidos;
    }

    public Partido buscarPartidoPorId(Long id) {
        JsonNode response = getCached("/fixtures", Map.of("id", String.valueOf(id)));
        JsonNode item = response.path("response").isArray() && response.path("response").size() > 0
                ? response.path("response").get(0)
                : null;
        if (item == null) {
            throw new ResponseStatusException(NOT_FOUND, "Partido no encontrado");
        }
        return mapPartido(item);
    }

    public List<Partido> listarPartidosPorJornada(Integer jornada) {
        return listarPartidos().stream()
                .filter(partido -> jornada.equals(partido.getJornada()))
                .toList();
    }

    public List<Partido> listarPartidosPorEstado(EstadoPartido estado) {
        return listarPartidos().stream()
                .filter(partido -> estado == partido.getEstado())
                .toList();
    }

    public List<TablaPosicionesDTO> obtenerTabla() {
        JsonNode response = getCached("/standings", Map.of(
                "league", String.valueOf(leagueId),
                "season", String.valueOf(season)
        ));

        JsonNode standingsGroups = response.path("response").path(0).path("league").path("standings");
        JsonNode chosenGroup = standingsGroups.isArray() && standingsGroups.size() > 0 ? standingsGroups.get(0) : null;
        if (chosenGroup == null || !chosenGroup.isArray()) {
            return List.of();
        }

        List<TablaPosicionesDTO> tabla = new ArrayList<>();
        for (JsonNode row : chosenGroup) {
            tabla.add(TablaPosicionesDTO.builder()
                    .posicion(row.path("rank").asInt())
                    .equipo(row.path("team").path("name").asText(""))
                    .pj(row.path("all").path("played").asInt())
                    .pg(row.path("all").path("win").asInt())
                    .pe(row.path("all").path("draw").asInt())
                    .pp(row.path("all").path("lose").asInt())
                    .gf(row.path("all").path("goals").path("for").asInt())
                    .gc(row.path("all").path("goals").path("against").asInt())
                    .dg(row.path("goalsDiff").asInt())
                    .pts(row.path("points").asInt())
                    .build());
        }
        return tabla;
    }

    public EstadisticaJugadorDTO obtenerResumenJugador(Long jugadorId) {
        JsonNode stats = buscarNodoJugador(jugadorId);
        JsonNode player = stats.path("player");
        JsonNode leagueStats = findLeagueStat(stats.path("statistics"));

        Equipo equipo = mapEquipoBasico(
                leagueStats.path("team").path("id").asLong(),
                leagueStats.path("team").path("name").asText(""),
                leagueStats.path("team").path("logo").asText(null)
        );

        return EstadisticaJugadorDTO.builder()
                .jugadorId(player.path("id").asLong())
                .nombreCompleto(joinName(player.path("firstname").asText(""), player.path("lastname").asText("")))
                .equipo(equipo.getNombre())
                .posicion(leagueStats.path("games").path("position").asText(""))
                .goles(leagueStats.path("goals").path("total").asInt(0))
                .asistencias(leagueStats.path("goals").path("assists").asInt(0))
                .amarillas(leagueStats.path("cards").path("yellow").asInt(0))
                .rojas(leagueStats.path("cards").path("red").asInt(0))
                .minutosJugados(leagueStats.path("games").path("minutes").asInt(0))
                .partidosJugados(leagueStats.path("games").path("appearences").asInt(0))
                .build();
    }

    public List<EstadisticaJugador> obtenerEstadisticasPartido(Long partidoId) {
        JsonNode response = getCached("/fixtures/players", Map.of("fixture", String.valueOf(partidoId)));
        Partido partido = buscarPartidoPorId(partidoId);
        List<EstadisticaJugador> estadisticas = new ArrayList<>();

        for (JsonNode teamNode : response.path("response")) {
            Equipo equipo = mapEquipoBasico(
                    teamNode.path("team").path("id").asLong(),
                    teamNode.path("team").path("name").asText(""),
                    teamNode.path("team").path("logo").asText(null)
            );

            for (JsonNode playerNode : teamNode.path("players")) {
                JsonNode player = playerNode.path("player");
                JsonNode stat = playerNode.path("statistics").isArray() && playerNode.path("statistics").size() > 0
                        ? playerNode.path("statistics").get(0)
                        : null;

                Jugador jugador = mapJugador(player, equipo, stat);
                estadisticas.add(EstadisticaJugador.builder()
                        .id(player.path("id").asLong())
                        .jugador(jugador)
                        .partido(partido)
                        .goles(stat != null ? stat.path("goals").path("total").asInt(0) : 0)
                        .asistencias(stat != null ? stat.path("goals").path("assists").asInt(0) : 0)
                        .amarillas(stat != null ? stat.path("cards").path("yellow").asInt(0) : 0)
                        .rojas(stat != null ? stat.path("cards").path("red").asInt(0) : 0)
                        .minutosJugados(stat != null ? stat.path("games").path("minutes").asInt(0) : 0)
                        .titular(stat != null && !stat.path("games").path("substitute").asBoolean(false))
                        .build());
            }
        }

        return estadisticas;
    }

    public List<Object[]> obtenerTopGoleadores() {
        JsonNode response = getCached("/players/topscorers", Map.of(
                "league", String.valueOf(leagueId),
                "season", String.valueOf(season)
        ));

        List<Object[]> goleadores = new ArrayList<>();
        for (JsonNode item : response.path("response")) {
            JsonNode player = item.path("player");
            JsonNode stat = findLeagueStat(item.path("statistics"));
            Equipo equipo = mapEquipoBasico(
                    stat.path("team").path("id").asLong(),
                    stat.path("team").path("name").asText(""),
                    stat.path("team").path("logo").asText(null)
            );
            Jugador jugador = mapJugador(player, equipo, stat);
            goleadores.add(new Object[]{jugador, stat.path("goals").path("total").asInt(0)});
        }
        return goleadores;
    }

    public List<Jugador> listarJugadores() {
        List<Jugador> jugadores = new ArrayList<>();
        for (Equipo equipo : listarEquipos()) {
            jugadores.addAll(listarJugadoresPorEquipo(equipo.getId()));
        }
        return jugadores;
    }

    public Jugador buscarJugadorPorId(Long id) {
        JsonNode stats = buscarNodoJugador(id);
        JsonNode player = stats.path("player");
        JsonNode leagueStats = findLeagueStat(stats.path("statistics"));
        Equipo equipo = mapEquipoBasico(
                leagueStats.path("team").path("id").asLong(),
                leagueStats.path("team").path("name").asText(""),
                leagueStats.path("team").path("logo").asText(null)
        );
        return mapJugador(player, equipo, leagueStats);
    }

    public List<Jugador> listarJugadoresPorEquipo(Long equipoId) {
        List<Jugador> jugadores = new ArrayList<>();
        int page = 1;

        while (true) {
            JsonNode response = getCached("/players", orderedParams(
                    "team", String.valueOf(equipoId),
                    "season", String.valueOf(season),
                    "page", String.valueOf(page)
            ));

            for (JsonNode item : response.path("response")) {
                JsonNode player = item.path("player");
                JsonNode stat = findLeagueStat(item.path("statistics"));
                jugadores.add(mapJugador(player, mapEquipoBasico(equipoId, stat.path("team").path("name").asText(""), stat.path("team").path("logo").asText(null)), stat));
            }

            int current = response.path("paging").path("current").asInt(page);
            int total = response.path("paging").path("total").asInt(page);
            if (current >= total) {
                break;
            }
            page++;
        }

        jugadores.sort(Comparator.comparing(jugador -> (jugador.getApellido() + " " + jugador.getNombre()), String.CASE_INSENSITIVE_ORDER));
        return jugadores;
    }

    private JsonNode buscarNodoJugador(Long jugadorId) {
        JsonNode response = getCached("/players", Map.of(
                "id", String.valueOf(jugadorId),
                "season", String.valueOf(season)
        ));
        JsonNode item = response.path("response").isArray() && response.path("response").size() > 0
                ? response.path("response").get(0)
                : null;
        if (item == null) {
            throw new ResponseStatusException(NOT_FOUND, "Jugador no encontrado");
        }
        return item;
    }

    private JsonNode findLeagueStat(JsonNode statsArray) {
        if (statsArray == null || !statsArray.isArray()) {
            return missingNode();
        }

        for (JsonNode stat : statsArray) {
            if (stat.path("league").path("id").asLong() == leagueId && stat.path("league").path("season").asInt() == season) {
                return stat;
            }
        }

        return statsArray.size() > 0 ? statsArray.get(0) : missingNode();
    }

    private Equipo mapEquipo(JsonNode teamNode, JsonNode venueNode) {
        return Equipo.builder()
                .id(teamNode.path("id").asLong())
                .nombre(teamNode.path("name").asText(""))
                .ciudad(textOrNull(venueNode.path("city")))
                .escudo(textOrNull(teamNode.path("logo")))
                .estadio(textOrNull(venueNode.path("name")))
                .fundacion(teamNode.path("founded").isNumber() ? teamNode.path("founded").asInt() : null)
                .entrenador(null)
                .build();
    }

    private Equipo mapEquipoBasico(Long id, String nombre, String escudo) {
        return Equipo.builder()
                .id(id)
                .nombre(nombre)
                .escudo(escudo)
                .build();
    }

    private Jugador mapJugador(JsonNode playerNode, Equipo equipo, JsonNode statNode) {
        String firstname = playerNode.path("firstname").asText("");
        String lastname = playerNode.path("lastname").asText("");
        String displayName = playerNode.path("name").asText("");

        String nombre = !firstname.isBlank() ? firstname : extractFirstName(displayName);
        String apellido = !lastname.isBlank() ? lastname : extractLastName(displayName);

        return Jugador.builder()
                .id(playerNode.path("id").asLong())
                .nombre(nombre)
                .apellido(apellido)
                .posicion(statNode != null ? textOrNull(statNode.path("games").path("position")) : null)
                .numeroCamiseta(statNode != null && statNode.path("games").path("number").isNumber() ? statNode.path("games").path("number").asInt() : null)
                .nacionalidad(textOrNull(playerNode.path("nationality")))
                .edad(playerNode.path("age").isNumber() ? playerNode.path("age").asInt() : null)
                .foto(textOrNull(playerNode.path("photo")))
                .equipo(equipo)
                .build();
    }

    private Partido mapPartido(JsonNode item) {
        ZonedDateTime dateTime = ZonedDateTime.parse(item.path("fixture").path("date").asText("1970-01-01T00:00:00Z")).withZoneSameInstant(APP_ZONE);

        return Partido.builder()
                .id(item.path("fixture").path("id").asLong())
                .equipoLocal(mapEquipoBasico(
                        item.path("teams").path("home").path("id").asLong(),
                        item.path("teams").path("home").path("name").asText(""),
                        item.path("teams").path("home").path("logo").asText(null)
                ))
                .equipoVisitante(mapEquipoBasico(
                        item.path("teams").path("away").path("id").asLong(),
                        item.path("teams").path("away").path("name").asText(""),
                        item.path("teams").path("away").path("logo").asText(null)
                ))
                .fecha(LocalDate.from(dateTime))
                .hora(LocalTime.from(dateTime).withSecond(0).withNano(0))
                .estadio(textOrNull(item.path("fixture").path("venue").path("name")))
                .jornada(extractRoundNumber(item.path("league").path("round").asText("")))
                .golesLocal(numberOrNull(item.path("goals").path("home")))
                .golesVisitante(numberOrNull(item.path("goals").path("away")))
                .estado(mapEstado(item.path("fixture").path("status").path("short").asText("")))
                .build();
    }

    private EstadoPartido mapEstado(String status) {
        return switch (status) {
            case "FT", "AET", "PEN", "CANC", "ABD", "AWD", "WO" -> EstadoPartido.FINALIZADO;
            case "1H", "HT", "2H", "ET", "BT", "P", "LIVE", "INT", "SUSP" -> EstadoPartido.EN_VIVO;
            default -> EstadoPartido.PROGRAMADO;
        };
    }

    private Integer extractRoundNumber(String round) {
        Matcher matcher = ROUND_NUMBER.matcher(round);
        return matcher.find() ? Integer.parseInt(matcher.group(1)) : 0;
    }

    private Integer numberOrNull(JsonNode node) {
        return node != null && node.isNumber() ? node.asInt() : null;
    }

    private String textOrNull(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }
        String value = node.asText("");
        return value.isBlank() ? null : value;
    }

    private String extractFirstName(String name) {
        if (name == null || name.isBlank()) {
            return "";
        }
        String[] parts = name.trim().split("\\s+");
        return parts.length > 0 ? parts[0] : name;
    }

    private String extractLastName(String name) {
        if (name == null || name.isBlank()) {
            return "";
        }
        String[] parts = name.trim().split("\\s+");
        if (parts.length <= 1) {
            return "";
        }
        return String.join(" ", java.util.Arrays.copyOfRange(parts, 1, parts.length));
    }

    private String joinName(String firstname, String lastname) {
        String joined = (firstname + " " + lastname).trim();
        return joined.isBlank() ? "Sin nombre" : joined;
    }

    private String normalizeTeamName(String value) {
        return value == null ? "" : value.toLowerCase()
                .replace("á", "a")
                .replace("é", "e")
                .replace("í", "i")
                .replace("ó", "o")
                .replace("ú", "u")
                .replaceAll("[^a-z0-9]+", " ")
                .trim();
    }

    private JsonNode getCached(String path, Map<String, String> params) {
        String cacheKey = buildCacheKey(path, params);
        CachePolicy policy = resolvePolicy(path, params);
        CacheEntry cached = findCachedEntry(cacheKey, path, params);
        Instant now = Instant.now();

        if (isFresh(cached, now)) {
            return cached.body();
        }

        Object lock = cacheLocks.computeIfAbsent(cacheKey, ignored -> new Object());
        synchronized (lock) {
            cached = cache.get(cacheKey);
            if (cached == null) {
                cached = findCachedEntry(cacheKey, path, params);
            }
            now = Instant.now();

            if (isFresh(cached, now)) {
                return cached.body();
            }

            try {
                validateConfig();
                JsonNode body = fetchFromApi(path, params);
                CacheEntry updated = new CacheEntry(
                        body,
                        now,
                        now.plus(policy.ttl()),
                        now.plus(policy.ttl()).plus(policy.staleGrace())
                );
                cache.put(cacheKey, updated);
                persistCache();
                return body;
            } catch (Exception ex) {
                if (canServeStored(cached)) {
                    return cached.body();
                }
                if (ex instanceof ResponseStatusException responseStatusException) {
                    throw responseStatusException;
                }
                throw new ResponseStatusException(NOT_FOUND, "No fue posible consultar API-Football", ex);
            } finally {
                cacheLocks.remove(cacheKey, lock);
            }
        }
    }

    private JsonNode fetchFromApi(String path, Map<String, String> params) {
        RestClient.UriSpec<?> uriSpec = restClient().get();
        JsonNode body = uriSpec.uri(uriBuilder -> {
                    var builder = uriBuilder.path(path);
                    params.forEach(builder::queryParam);
                    return builder.build();
                })
                .retrieve()
                .body(JsonNode.class);

        if (body == null) {
            throw new ResponseStatusException(NOT_FOUND, "API-Football no devolvio datos");
        }

        JsonNode errors = body.path("errors");
        if (!errors.isMissingNode() && !errors.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, errors.toString());
        }

        return body;
    }

    private CachePolicy resolvePolicy(String path, Map<String, String> params) {
        Duration defaultTtl = Duration.ofMinutes(cacheMinutes);

        if ("/teams".equals(path)) {
            return new CachePolicy(Duration.ofHours(12), Duration.ofDays(30));
        }
        if ("/standings".equals(path) || "/players/topscorers".equals(path)) {
            return new CachePolicy(Duration.ofHours(6), Duration.ofDays(3));
        }
        if ("/players".equals(path) && params.containsKey("team")) {
            return new CachePolicy(Duration.ofHours(12), Duration.ofDays(7));
        }
        if ("/players".equals(path) && params.containsKey("id")) {
            return new CachePolicy(Duration.ofHours(12), Duration.ofDays(7));
        }
        if ("/fixtures/players".equals(path)) {
            return new CachePolicy(Duration.ofDays(1), Duration.ofDays(14));
        }
        if ("/fixtures".equals(path) && params.containsKey("id")) {
            return new CachePolicy(Duration.ofHours(6), Duration.ofDays(7));
        }
        if ("/fixtures".equals(path)) {
            return new CachePolicy(Duration.ofHours(3), Duration.ofDays(7));
        }

        return new CachePolicy(defaultTtl, DEFAULT_STALE_GRACE);
    }

    private String buildCacheKey(String path, Map<String, String> params) {
        Map<String, String> ordered = new LinkedHashMap<>();
        params.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> ordered.put(entry.getKey(), entry.getValue()));
        return path + "?" + ordered;
    }

    private CacheEntry findCachedEntry(String cacheKey, String path, Map<String, String> params) {
        CacheEntry direct = cache.get(cacheKey);
        if (direct != null) {
            return direct;
        }

        for (Map.Entry<String, CacheEntry> entry : cache.entrySet()) {
            if (!entry.getKey().startsWith(path + "?")) {
                continue;
            }
            if (params.equals(parseCacheParams(entry.getKey()))) {
                cache.putIfAbsent(cacheKey, entry.getValue());
                return entry.getValue();
            }
        }
        return null;
    }

    private Map<String, String> parseCacheParams(String cacheKey) {
        int marker = cacheKey.indexOf("?{");
        if (marker < 0 || !cacheKey.endsWith("}")) {
            return Map.of();
        }

        String raw = cacheKey.substring(marker + 2, cacheKey.length() - 1);
        if (raw.isBlank()) {
            return Map.of();
        }

        Map<String, String> parsed = new LinkedHashMap<>();
        for (String pair : raw.split(", ")) {
            int separator = pair.indexOf('=');
            if (separator > 0) {
                parsed.put(pair.substring(0, separator), pair.substring(separator + 1));
            }
        }
        return parsed;
    }

    private boolean isFresh(CacheEntry entry, Instant now) {
        return entry != null && entry.expiresAt != null && entry.expiresAt.isAfter(now);
    }

    private boolean canServeStored(CacheEntry entry) {
        return entry != null && entry.body != null && !entry.body.isMissingNode();
    }

    private void loadPersistentCache() {
        Path path = Path.of(cacheFilePath);
        if (!Files.exists(path)) {
            return;
        }

        try {
            PersistentCacheSnapshot snapshot = objectMapper.readValue(path.toFile(), PersistentCacheSnapshot.class);
            if (snapshot == null || snapshot.entries == null) {
                return;
            }

            for (Map.Entry<String, CacheEntry> entry : snapshot.entries.entrySet()) {
                CacheEntry value = entry.getValue();
                if (canServeStored(value)) {
                    cache.put(entry.getKey(), value);
                }
            }
        } catch (IOException ignored) {
        }
    }

    private void persistCache() {
        Path path = Path.of(cacheFilePath);
        try {
            if (path.getParent() != null) {
                Files.createDirectories(path.getParent());
            }
            objectMapper.writerWithDefaultPrettyPrinter()
                    .writeValue(path.toFile(), new PersistentCacheSnapshot(new LinkedHashMap<>(cache)));
        } catch (IOException ignored) {
        }
    }

    private RestClient restClient() {
        return restClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.ACCEPT, "application/json")
                .defaultHeader("x-apisports-key", apiKey)
                .build();
    }

    private void validateConfig() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(NOT_FOUND, "Configura api.football.key para usar API-Football");
        }
    }

    private JsonNode missingNode() {
        return MissingNode.getInstance();
    }

    private Map<String, String> orderedParams(String... values) {
        Map<String, String> params = new LinkedHashMap<>();
        for (int i = 0; i < values.length; i += 2) {
            params.put(values[i], values[i + 1]);
        }
        return params;
    }

    private static final class CachePolicy {
        private final Duration ttl;
        private final Duration staleGrace;

        private CachePolicy(Duration ttl, Duration staleGrace) {
            this.ttl = ttl;
            this.staleGrace = staleGrace;
        }

        public Duration ttl() {
            return ttl;
        }

        public Duration staleGrace() {
            return staleGrace;
        }
    }

    private static final class PersistentCacheSnapshot {
        public Map<String, CacheEntry> entries;

        public PersistentCacheSnapshot() {
        }

        private PersistentCacheSnapshot(Map<String, CacheEntry> entries) {
            this.entries = entries;
        }
    }

    private static final class CacheEntry {
        public JsonNode body;
        public Instant fetchedAt;
        public Instant expiresAt;
        public Instant staleUntil;

        public CacheEntry() {
        }

        private CacheEntry(JsonNode body, Instant fetchedAt, Instant expiresAt, Instant staleUntil) {
            this.body = body;
            this.fetchedAt = fetchedAt;
            this.expiresAt = expiresAt;
            this.staleUntil = staleUntil;
        }

        public JsonNode body() {
            return body;
        }
    }
}
