package com.example.liga1pro.service;

import com.example.liga1pro.dto.FavoritoAlineacionDTO;
import com.example.liga1pro.dto.FavoritoInicioDTO;
import com.example.liga1pro.dto.FavoritoProximoPartidoDTO;
import com.example.liga1pro.model.Equipo;
import com.example.liga1pro.model.Usuario;
import com.example.liga1pro.repository.EquipoRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.text.Normalizer;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class FavoritoApiFootballService {

    private static final Duration CACHE_TTL = Duration.ofHours(12);

    private final UsuarioService usuarioService;
    private final EquipoRepository equipoRepository;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    private final ConcurrentMap<Long, CacheItem> cachePorEquipo = new ConcurrentHashMap<>();
    private volatile List<JsonNode> cacheEquiposLiga = new ArrayList<>();
    private volatile Instant cacheEquiposLigaActualizadoEn;
    private volatile List<JsonNode> cacheEquiposTemporada = new ArrayList<>();
    private volatile Instant cacheEquiposTemporadaActualizadoEn;

    @Value("${sportsdb.base-url:https://www.thesportsdb.com/api/v1/json}")
    private String sportsDbBaseUrl;

    @Value("${sportsdb.api-key:123}")
    private String sportsDbApiKey;

    @Value("${sportsdb.league-id:4688}")
    private String sportsDbLeagueId;

    @Value("${sportsdb.league-name:Peruvian_Primera_Division}")
    private String sportsDbLeagueName;

    @Value("${sportsdb.season:2026}")
    private String sportsDbSeason;

    @Value("${sportsdb.next-fixtures:5}")
    private int nextFixtures;

    @Value("${sportsdb.timezone:America/Lima}")
    private String apiTimezone;

    @Value("${api.football.base-url:https://v3.football.api-sports.io}")
    private String apiFootballBaseUrl;

    @Value("${api.football.key:}")
    private String apiFootballKey;

    public FavoritoApiFootballService(
            UsuarioService usuarioService,
            EquipoRepository equipoRepository,
            ObjectMapper objectMapper
    ) {
        this.usuarioService = usuarioService;
        this.equipoRepository = equipoRepository;
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    public FavoritoInicioDTO obtenerContenidoInicio(Long usuarioId) {
        Usuario usuario = usuarioService.obtenerUsuarioPorIdConFallback(usuarioId);
        if (usuario == null) {
            throw new IllegalArgumentException("No existe ningun usuario registrado");
        }
        if (usuario.getEquipoFavorito() == null) {
            throw new IllegalArgumentException("El usuario aun no tiene equipo favorito");
        }
        return obtenerContenidoEquipo(usuario.getEquipoFavorito());
    }

    @Scheduled(
            fixedDelayString = "${sportsdb.refresh-ms:43200000}",
            initialDelayString = "${sportsdb.initial-delay-ms:60000}"
    )
    public void refrescarCacheCada12Horas() {
        if (cachePorEquipo.isEmpty()) {
            return;
        }

        for (Long equipoId : new HashSet<>(cachePorEquipo.keySet())) {
            try {
                Equipo equipo = equipoRepository.findById(equipoId).orElse(null);
                if (equipo == null) {
                    continue;
                }
                FavoritoInicioDTO dto = consultarSportsDb(equipo);
                cachePorEquipo.put(equipoId, new CacheItem(dto, Instant.now()));
            } catch (Exception ignored) {
                // Ignorado para no detener scheduler.
            }
        }
    }

    private FavoritoInicioDTO obtenerContenidoEquipo(Equipo equipo) {
        CacheItem cacheItem = cachePorEquipo.get(equipo.getId());
        if (cacheItem != null && !cacheExpirada(cacheItem.actualizadoEn)) {
            return cacheItem.dto;
        }

        synchronized (("equipo-cache-" + equipo.getId()).intern()) {
            CacheItem cacheSegundoIntento = cachePorEquipo.get(equipo.getId());
            if (cacheSegundoIntento != null && !cacheExpirada(cacheSegundoIntento.actualizadoEn)) {
                return cacheSegundoIntento.dto;
            }

            FavoritoInicioDTO dto = consultarSportsDb(equipo);
            cachePorEquipo.put(equipo.getId(), new CacheItem(dto, Instant.now()));
            return dto;
        }
    }

    private FavoritoInicioDTO consultarSportsDb(Equipo equipoLocal) {
        JsonNode equipoRemoto = resolverEquipoRemoto(equipoLocal);
        if (equipoRemoto == null) {
            throw new IllegalStateException("No se pudo resolver el equipo en TheSportsDB: " + equipoLocal.getNombre());
        }

        String teamId = equipoRemoto.path("idTeam").asText("");
        List<JsonNode> proximos = obtenerProximosEventos(teamId);
        FavoritoAlineacionDTO alineacion = construirAlineacion(teamId, dtoSafeText(equipoRemoto.path("strTeam")), proximos);

        FavoritoInicioDTO dto = new FavoritoInicioDTO();
        dto.setEquipo(textoConFallback(equipoRemoto.path("strTeam").asText(), equipoLocal.getNombre()));
        dto.setDescripcion(construirDescripcion(equipoRemoto, equipoLocal.getNombre()));
        dto.setAviso(null);
        dto.setProximosPartidos(construirProximosPartidos(proximos, teamId));
        dto.setAlineacion(alineacion);
        dto.setActualizadoEn(ZonedDateTime.now(ZoneId.of(apiTimezone)).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        return dto;
    }

    private JsonNode resolverEquipoRemoto(Equipo equipoLocal) {
        List<JsonNode> candidatos = new ArrayList<>();
        candidatos.addAll(obtenerEquiposLiga());
        candidatos.addAll(obtenerEquiposTemporada());
        if (candidatos.isEmpty()) {
            return null;
        }

        if (equipoLocal.getApiFootballTeamId() != null) {
            String apiFootballId = String.valueOf(equipoLocal.getApiFootballTeamId());
            for (JsonNode candidato : candidatos) {
                if (apiFootballId.equals(candidato.path("idAPIfootball").asText(""))) {
                    return candidato;
                }
            }
        }

        String objetivo = normalizar(equipoLocal.getNombre());
        List<String> alias = aliasesBusqueda(equipoLocal.getNombre());

        JsonNode mejor = null;
        int mejorScore = Integer.MIN_VALUE;
        for (JsonNode candidato : candidatos) {
            int score = scoreCoincidencia(candidato, objetivo, alias);
            if (score > mejorScore) {
                mejorScore = score;
                mejor = candidato;
            }
        }

        if (mejor == null || mejorScore < 40) {
            return null;
        }
        return mejor;
    }

    private List<JsonNode> obtenerEquiposLiga() {
        if (cacheEquiposLigaActualizadoEn != null
                && Duration.between(cacheEquiposLigaActualizadoEn, Instant.now()).compareTo(CACHE_TTL) < 0
                && !cacheEquiposLiga.isEmpty()) {
            return cacheEquiposLiga;
        }

        JsonNode body = sportsDbGet("search_all_teams", Map.of("l", sportsDbLeagueName));
        JsonNode teams = body.path("teams");
        List<JsonNode> lista = new ArrayList<>();
        if (teams.isArray()) {
            for (JsonNode t : teams) {
                lista.add(t);
            }
        }

        cacheEquiposLiga = lista;
        cacheEquiposLigaActualizadoEn = Instant.now();
        return lista;
    }

    private List<JsonNode> obtenerEquiposTemporada() {
        if (cacheEquiposTemporadaActualizadoEn != null
                && Duration.between(cacheEquiposTemporadaActualizadoEn, Instant.now()).compareTo(CACHE_TTL) < 0
                && !cacheEquiposTemporada.isEmpty()) {
            return cacheEquiposTemporada;
        }

        JsonNode body = sportsDbGet("eventsseason", Map.of("id", sportsDbLeagueId, "s", sportsDbSeason));
        JsonNode events = body.path("events");
        Map<String, JsonNode> map = new HashMap<>();
        if (events.isArray()) {
            for (JsonNode e : events) {
                String homeId = e.path("idHomeTeam").asText("");
                String awayId = e.path("idAwayTeam").asText("");
                if (!homeId.isBlank() && !map.containsKey(homeId)) {
                    ObjectNode t = objectMapper.createObjectNode();
                    t.put("idTeam", homeId);
                    t.put("strTeam", e.path("strHomeTeam").asText(""));
                    t.put("strBadge", e.path("strHomeTeamBadge").asText(""));
                    t.put("strCountry", "Peru");
                    map.put(homeId, t);
                }
                if (!awayId.isBlank() && !map.containsKey(awayId)) {
                    ObjectNode t = objectMapper.createObjectNode();
                    t.put("idTeam", awayId);
                    t.put("strTeam", e.path("strAwayTeam").asText(""));
                    t.put("strBadge", e.path("strAwayTeamBadge").asText(""));
                    t.put("strCountry", "Peru");
                    map.put(awayId, t);
                }
            }
        }

        cacheEquiposTemporada = new ArrayList<>(map.values());
        cacheEquiposTemporadaActualizadoEn = Instant.now();
        return cacheEquiposTemporada;
    }

    private List<JsonNode> obtenerProximosEventos(String teamId) {
        List<JsonNode> salida = new ArrayList<>();

        JsonNode nextLeagueBody = sportsDbGet("eventsnextleague", Map.of("id", sportsDbLeagueId));
        JsonNode events = nextLeagueBody.path("events");
        if (events.isArray()) {
            for (JsonNode e : events) {
                String idHome = e.path("idHomeTeam").asText("");
                String idAway = e.path("idAwayTeam").asText("");
                if (teamId.equals(idHome) || teamId.equals(idAway)) {
                    salida.add(e);
                }
            }
        }

        if (salida.isEmpty()) {
            JsonNode nextTeamBody = sportsDbGet("eventsnext", Map.of("id", teamId));
            JsonNode nextTeamEvents = nextTeamBody.path("events");
            if (nextTeamEvents.isArray()) {
                for (JsonNode e : nextTeamEvents) {
                    salida.add(e);
                }
            }
        }

        salida.sort(Comparator.comparing(this::obtenerFechaEvento));
        if (salida.size() > nextFixtures) {
            return new ArrayList<>(salida.subList(0, nextFixtures));
        }
        return salida;
    }

    private List<JsonNode> obtenerEventosPasados(String teamId) {
        List<JsonNode> salida = new ArrayList<>();
        JsonNode body = sportsDbGet("eventsseason", Map.of("id", sportsDbLeagueId, "s", sportsDbSeason));
        JsonNode events = body.path("events");
        if (!events.isArray()) {
            return salida;
        }

        LocalDate hoy = LocalDate.now(ZoneId.of(apiTimezone));
        for (JsonNode e : events) {
            String idHome = e.path("idHomeTeam").asText("");
            String idAway = e.path("idAwayTeam").asText("");
            if (!teamId.equals(idHome) && !teamId.equals(idAway)) {
                continue;
            }
            if (obtenerFechaEvento(e).toLocalDate().isAfter(hoy)) {
                continue;
            }
            salida.add(e);
        }

        salida.sort(Comparator.comparing(this::obtenerFechaEvento).reversed());
        return salida;
    }

    private List<JsonNode> obtenerEventosRecientesTeam(String teamId) {
        List<JsonNode> salida = new ArrayList<>();
        JsonNode body = sportsDbGet("eventslast", Map.of("id", teamId));
        JsonNode results = body.path("results");
        if (!results.isArray()) {
            return salida;
        }
        for (JsonNode e : results) {
            salida.add(e);
        }
        salida.sort(Comparator.comparing(this::obtenerFechaEvento).reversed());
        return salida;
    }

    private FavoritoAlineacionDTO construirAlineacion(String teamId, String nombreEquipo, List<JsonNode> proximos) {
        FavoritoAlineacionDTO alineacion = new FavoritoAlineacionDTO();

        List<JsonNode> candidatos = new ArrayList<>();
        candidatos.addAll(proximos);
        candidatos.addAll(obtenerEventosRecientesTeam(teamId));
        candidatos.addAll(obtenerEventosPasados(teamId));
        if (candidatos.size() > 20) {
            candidatos = new ArrayList<>(candidatos.subList(0, 20));
        }

        for (JsonNode fixture : candidatos) {
            List<String> titulares = obtenerTitularesSportsDb(teamId, fixture);
            if (titulares.isEmpty()) {
                titulares = obtenerTitularesApiFootball(nombreEquipo, fixture.path("idAPIfootball").asText(""));
            }
            if (!titulares.isEmpty()) {
                alineacion.setFixtureId(parseLong(fixture.path("idEvent").asText(null)));
                alineacion.setFechaHora(fixture.path("strTimestamp").asText(fixture.path("dateEvent").asText("")));
                String idHome = fixture.path("idHomeTeam").asText("");
                String rival = teamId.equals(idHome)
                        ? fixture.path("strAwayTeam").asText("N/D")
                        : fixture.path("strHomeTeam").asText("N/D");
                alineacion.setRival(rival);
                alineacion.setFormacion("Oficial");
                alineacion.setTitulares(titulares);
                return alineacion;
            }
        }

        if (!candidatos.isEmpty()) {
            JsonNode ref = candidatos.get(0);
            alineacion.setFixtureId(parseLong(ref.path("idEvent").asText(null)));
            alineacion.setFechaHora(ref.path("strTimestamp").asText(ref.path("dateEvent").asText("")));
            String idHome = ref.path("idHomeTeam").asText("");
            String rival = teamId.equals(idHome)
                    ? ref.path("strAwayTeam").asText("N/D")
                    : ref.path("strHomeTeam").asText("N/D");
            alineacion.setRival(rival);
        }

        alineacion.setMensaje("Alineacion oficial aun no publicada para los partidos disponibles en las APIs.");
        return alineacion;
    }

    private List<String> obtenerTitularesSportsDb(String teamId, JsonNode fixture) {
        String eventId = fixture.path("idEvent").asText("");
        if (eventId.isBlank()) {
            return List.of();
        }

        JsonNode lineupsBody = sportsDbGet("lookuplineup", Map.of("id", eventId));
        JsonNode lineups = lineupsBody.path("lineup");
        List<String> titulares = new ArrayList<>();
        if (!lineups.isArray()) {
            return titulares;
        }

        for (JsonNode item : lineups) {
            if (!teamId.equals(item.path("idTeam").asText(""))) {
                continue;
            }
            String esSuplente = item.path("strSubstitute").asText("No");
            if ("Yes".equalsIgnoreCase(esSuplente)) {
                continue;
            }
            String nombre = item.path("strPlayer").asText("");
            if (!nombre.isBlank()) {
                titulares.add(nombre);
            }
        }
        return titulares;
    }

    private List<String> obtenerTitularesApiFootball(String nombreEquipo, String fixtureId) {
        if (fixtureId == null || fixtureId.isBlank() || apiFootballKey == null || apiFootballKey.isBlank()) {
            return List.of();
        }
        try {
            UriComponentsBuilder builder = UriComponentsBuilder
                    .fromHttpUrl(apiFootballBaseUrl + "/fixtures/lineups")
                    .queryParam("fixture", fixtureId);

            HttpHeaders headers = new HttpHeaders();
            headers.set("x-apisports-key", apiFootballKey);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            ResponseEntity<String> response = restTemplate.exchange(
                    builder.build().encode().toUriString(),
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class
            );
            JsonNode body = objectMapper.readTree(response.getBody());
            JsonNode lineups = body.path("response");
            if (!lineups.isArray()) {
                return List.of();
            }

            String equipoNorm = normalizar(nombreEquipo);
            List<String> titulares = new ArrayList<>();
            for (JsonNode item : lineups) {
                String teamName = normalizar(item.path("team").path("name").asText(""));
                if (!teamName.equals(equipoNorm) && !equipoNorm.contains(teamName) && !teamName.contains(equipoNorm)) {
                    continue;
                }
                JsonNode startXI = item.path("startXI");
                if (!startXI.isArray()) {
                    continue;
                }
                for (JsonNode jugador : startXI) {
                    String nombre = jugador.path("player").path("name").asText("");
                    if (!nombre.isBlank()) {
                        titulares.add(nombre);
                    }
                }
                if (!titulares.isEmpty()) {
                    return titulares;
                }
            }
            return List.of();
        } catch (Exception ex) {
            return List.of();
        }
    }

    private String construirDescripcion(JsonNode equipoRemoto, String fallbackNombre) {
        String nombre = textoConFallback(equipoRemoto.path("strTeam").asText(), fallbackNombre);
        String descripcion = equipoRemoto.path("strDescriptionES").asText("");
        if (descripcion.isBlank()) {
            descripcion = equipoRemoto.path("strDescriptionEN").asText("");
        }
        if (!descripcion.isBlank()) {
            return descripcion;
        }

        String estadio = textoConFallback(equipoRemoto.path("strStadium").asText(), "N/D");
        String ciudad = textoConFallback(equipoRemoto.path("strLocation").asText(), "Peru");
        String fundado = textoConFallback(equipoRemoto.path("intFormedYear").asText(), "N/D");
        return nombre + " es un club peruano fundado en " + fundado + ". Juega en " + estadio + " (" + ciudad + ").";
    }

    private List<FavoritoProximoPartidoDTO> construirProximosPartidos(List<JsonNode> eventos, String teamId) {
        List<FavoritoProximoPartidoDTO> salida = new ArrayList<>();
        for (JsonNode e : eventos) {
            FavoritoProximoPartidoDTO dto = new FavoritoProximoPartidoDTO();
            dto.setFixtureId(parseLong(e.path("idEvent").asText(null)));
            dto.setFechaHora(e.path("strTimestamp").asText(e.path("dateEvent").asText("")));
            dto.setTorneo(e.path("strLeague").asText("N/D"));
            dto.setEstadio(e.path("strVenue").asText("N/D"));

            boolean local = teamId.equals(e.path("idHomeTeam").asText(""));
            dto.setCondicion(local ? "Local" : "Visitante");
            dto.setRival(local ? e.path("strAwayTeam").asText("N/D") : e.path("strHomeTeam").asText("N/D"));
            salida.add(dto);
        }
        return salida;
    }

    private JsonNode sportsDbGet(String endpoint, Map<String, String> queryParams) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder
                    .fromHttpUrl(sportsDbBaseUrl + "/" + sportsDbApiKey + "/" + endpoint + ".php");
            for (Map.Entry<String, String> entry : queryParams.entrySet()) {
                builder.queryParam(entry.getKey(), entry.getValue());
            }

            ResponseEntity<String> response = restTemplate.exchange(
                    builder.build().encode().toUriString(),
                    HttpMethod.GET,
                    null,
                    String.class
            );
            return objectMapper.readTree(response.getBody());
        } catch (Exception ex) {
            throw new IllegalStateException("Error consultando TheSportsDB: " + ex.getMessage(), ex);
        }
    }

    private LocalDateTime obtenerFechaEvento(JsonNode event) {
        String timestamp = event.path("strTimestamp").asText("");
        if (!timestamp.isBlank()) {
            try {
                return LocalDateTime.parse(timestamp, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
            } catch (Exception ignored) {
                // fallback
            }
        }

        String fecha = event.path("dateEvent").asText("");
        if (fecha.isBlank()) {
            fecha = event.path("dateEventLocal").asText("");
        }
        String hora = event.path("strTimeLocal").asText("");
        if (hora.isBlank()) {
            hora = event.path("strTime").asText("00:00:00");
        }

        try {
            LocalDate d = LocalDate.parse(fecha);
            LocalTime t = LocalTime.parse(hora);
            return LocalDateTime.of(d, t);
        } catch (Exception ex) {
            return LocalDateTime.MIN;
        }
    }

    private boolean cacheExpirada(Instant actualizadoEn) {
        return actualizadoEn == null || Duration.between(actualizadoEn, Instant.now()).compareTo(CACHE_TTL) >= 0;
    }

    private String normalizar(String texto) {
        String base = texto == null ? "" : texto;
        return Normalizer.normalize(base, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .trim();
    }

    private String textoConFallback(String valor, String fallback) {
        if (valor == null || valor.isBlank()) {
            return fallback;
        }
        return valor;
    }

    private String dtoSafeText(JsonNode value) {
        if (value == null || value.isMissingNode() || value.isNull()) {
            return "";
        }
        return value.asText("");
    }

    private int scoreCoincidencia(JsonNode candidato, String objetivo, List<String> alias) {
        String name = normalizar(candidato.path("strTeam").asText(""));
        String alt = normalizar(candidato.path("strTeamAlternate").asText(""));
        String combined = name + " " + alt;

        int score = -100;
        boolean textualMatch = false;
        if (name.equals(objetivo) || alt.equals(objetivo)) {
            score += 120;
            textualMatch = true;
        }
        if (combined.contains(objetivo)) {
            score += 60;
            textualMatch = true;
        }
        for (String a : alias) {
            String na = normalizar(a);
            if (na.isBlank()) {
                continue;
            }
            if (name.equals(na) || alt.equals(na)) {
                score += 110;
                textualMatch = true;
            }
            if (combined.contains(na)) {
                score += 50;
                textualMatch = true;
            }
        }

        if (!textualMatch) {
            return -100;
        }

        if ("peru".equalsIgnoreCase(candidato.path("strCountry").asText(""))) {
            score += 20;
        }
        return score;
    }

    private List<String> aliasesBusqueda(String nombre) {
        Map<String, List<String>> map = new HashMap<>();
        map.put("adt", List.of("ADT", "Asociacion Deportiva Tarma"));
        map.put("alianza atletico", List.of("Alianza Atletico", "Alianza Atlético"));
        map.put("alianza lima", List.of("Alianza Lima"));
        map.put("atletico grau", List.of("Atletico Grau", "Atlético Grau"));
        map.put("cienciano", List.of("Cienciano"));
        map.put("comerciantes unidos", List.of("Comerciantes Unidos"));
        map.put("cusco fc", List.of("Cusco FC", "Cusco"));
        map.put("deportivo garcilaso", List.of("Deportivo Garcilaso"));
        map.put("deportivo moquegua", List.of("Deportivo Moquegua"));
        map.put("fc cajamarca", List.of("FC Cajamarca", "Cajamarca"));
        map.put("fbc melgar", List.of("FBC Melgar", "Melgar"));
        map.put("juan pablo ii college", List.of("Juan Pablo II College"));
        map.put("los chankas", List.of("Los Chankas", "Club Deportivo Los Chankas"));
        map.put("sport boys", List.of("Sport Boys"));
        map.put("sport huancayo", List.of("Sport Huancayo"));
        map.put("sporting cristal", List.of("Sporting Cristal"));
        map.put("universitario de deportes", List.of("Universitario de Deportes", "Universitario"));
        map.put("utc", List.of("UTC", "Universidad Tecnica de Cajamarca", "Universidad Técnica de Cajamarca"));

        List<String> aliases = map.get(normalizar(nombre));
        if (aliases != null && !aliases.isEmpty()) {
            return aliases;
        }
        return List.of(nombre);
    }

    private Long parseLong(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Long.parseLong(value);
        } catch (Exception ex) {
            return null;
        }
    }

    private static class CacheItem {
        private final FavoritoInicioDTO dto;
        private final Instant actualizadoEn;

        private CacheItem(FavoritoInicioDTO dto, Instant actualizadoEn) {
            this.dto = dto;
            this.actualizadoEn = actualizadoEn;
        }
    }
}
