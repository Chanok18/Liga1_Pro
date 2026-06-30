package com.liga1pro.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.liga1pro.dto.NoticiaDTO;
import com.liga1pro.dto.NoticiaFeedDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_GATEWAY;

@Service
@RequiredArgsConstructor
public class NoticiasService implements InitializingBean {

    private static final String LIGA_1_PERU = "Liga 1 Peru";
    private static final List<String> EQUIPOS_2026 = List.of(
            "ADT",
            "Alianza Atletico",
            "Alianza Lima",
            "Atletico Grau",
            "Cajamarca",
            "Cienciano",
            "Comerciantes Unidos",
            "Cusco",
            "Deportivo Garcilaso",
            "Deportivo Moquegua",
            "Juan Pablo II College",
            "Los Chankas",
            "Melgar",
            "Sport Boys",
            "Sport Huancayo",
            "Sporting Cristal",
            "Universitario",
            "UTC"
    );
    private static final Map<String, List<String>> ALIASES_BY_TEAM = Map.ofEntries(
            Map.entry("ADT", List.of("Asociacion Deportiva Tarma")),
            Map.entry("Alianza Atletico", List.of("Alianza Atletico de Sullana", "Alianza Atletico Sullana")),
            Map.entry("Alianza Lima", List.of("Alianza Lima")),
            Map.entry("Atletico Grau", List.of("Atletico Grau", "Atlético Grau", "Club Atletico Grau")),
            Map.entry("Cajamarca", List.of("FC Cajamarca")),
            Map.entry("Cienciano", List.of("Cienciano")),
            Map.entry("Comerciantes Unidos", List.of("Comerciantes Unidos")),
            Map.entry("Cusco", List.of("Cusco FC")),
            Map.entry("Deportivo Garcilaso", List.of("Deportivo Garcilaso")),
            Map.entry("Deportivo Moquegua", List.of("Deportivo Moquegua")),
            Map.entry("Juan Pablo II College", List.of("Juan Pablo II College", "Juan Pablo II")),
            Map.entry("Los Chankas", List.of("Los Chankas", "Club Deportivo Los Chankas")),
            Map.entry("Melgar", List.of("FBC Melgar")),
            Map.entry("Sport Boys", List.of("Sport Boys")),
            Map.entry("Sport Huancayo", List.of("Sport Huancayo")),
            Map.entry("Sporting Cristal", List.of("Sporting Cristal")),
            Map.entry("Universitario", List.of("Universitario de Deportes", "Club Universitario de Deportes")),
            Map.entry("UTC", List.of("UTC Cajamarca", "Universidad Tecnica de Cajamarca"))
    );

    private final RestClient.Builder restClientBuilder;
    private final ObjectMapper objectMapper;

    @Value("${news.api.base-url:https://newsapi.org/v2}")
    private String baseUrl;

    @Value("${news.api.key:}")
    private String apiKey;

    @Value("${news.api.cache-file:data/news-cache.json}")
    private String cacheFilePath;

    @Value("${news.api.cache-minutes:120}")
    private long cacheMinutes;

    @Value("${news.api.stale-hours:24}")
    private long staleHours;

    private final AtomicBoolean refreshInProgress = new AtomicBoolean(false);
    private final Object cacheLock = new Object();

    private volatile CacheEntry cacheEntry;

    @Override
    public void afterPropertiesSet() {
        loadPersistentCache();
        if (cacheEntry == null || cacheEntry.noticias == null || cacheEntry.noticias.isEmpty()) {
            try {
                refreshCacheSafely();
            } catch (ResponseStatusException ignored) {
            }
        } else if (isExpired(cacheEntry, Instant.now())) {
            triggerBackgroundRefresh();
        }
    }

    public NoticiaFeedDTO obtenerNoticias(String equipo, String liga) {
        List<NoticiaDTO> noticias = getFreshNews();

        List<NoticiaDTO> filtradas = noticias.stream()
                .filter(noticia -> liga == null || liga.isBlank() || "todas".equalsIgnoreCase(liga) || LIGA_1_PERU.equalsIgnoreCase(noticia.getLiga()))
                .filter(noticia -> equipo == null || equipo.isBlank() || "todos".equalsIgnoreCase(equipo) || equipo.equalsIgnoreCase(noticia.getEquipo()))
                .toList();

        return NoticiaFeedDTO.builder()
                .equipos(EQUIPOS_2026)
                .ligas(List.of(LIGA_1_PERU))
                .noticias(filtradas)
                .build();
    }

    private List<NoticiaDTO> getFreshNews() {
        Instant now = Instant.now();
        CacheEntry current = cacheEntry;

        if (isFresh(current, now)) {
            return current.noticias;
        }

        if (hasUsableNews(current)) {
            triggerBackgroundRefresh();
            return current.noticias;
        }

        return refreshCacheSafely();
    }

    @Scheduled(fixedDelayString = "${news.api.refresh-interval-ms:900000}", initialDelayString = "${news.api.refresh-initial-delay-ms:60000}")
    public void refreshExpiredCache() {
        CacheEntry current = cacheEntry;
        if (current == null || isExpired(current, Instant.now())) {
            try {
                refreshCacheSafely();
            } catch (ResponseStatusException ignored) {
            }
        }
    }

    private void triggerBackgroundRefresh() {
        if (!refreshInProgress.compareAndSet(false, true)) {
            return;
        }

        Thread refreshThread = new Thread(() -> {
            try {
                refreshCache();
            } catch (Exception ignored) {
            } finally {
                refreshInProgress.set(false);
            }
        }, "noticias-cache-refresh");
        refreshThread.setDaemon(true);
        refreshThread.start();
    }

    private List<NoticiaDTO> refreshCacheSafely() {
        if (!refreshInProgress.compareAndSet(false, true)) {
            CacheEntry current = waitForRefresh();
            if (hasUsableNews(current)) {
                return current.noticias;
            }
            while (!refreshInProgress.compareAndSet(false, true)) {
                current = waitForRefresh();
                if (hasUsableNews(current)) {
                    return current.noticias;
                }
            }
        }

        try {
            return refreshCache().noticias;
        } catch (Exception ex) {
            CacheEntry fallback = cacheEntry;
            if (hasUsableNews(fallback)) {
                return fallback.noticias;
            }
            throw new ResponseStatusException(BAD_GATEWAY, "No fue posible consultar NewsAPI", ex);
        } finally {
            refreshInProgress.set(false);
        }
    }

    private CacheEntry refreshCache() {
        synchronized (cacheLock) {
            CacheEntry current = cacheEntry;
            Instant now = Instant.now();
            if (isFresh(current, now)) {
                return current;
            }

            List<NoticiaDTO> noticias = fetchNewsFromApi();
            if (noticias.isEmpty() && hasUsableNews(current)) {
                return current;
            }

            CacheEntry updated = new CacheEntry(
                    noticias,
                    now,
                    now.plus(Duration.ofMinutes(cacheMinutes)),
                    now.plus(Duration.ofHours(staleHours))
            );
            cacheEntry = updated;
            persistCache(updated);
            return updated;
        }
    }

    private CacheEntry waitForRefresh() {
        for (int i = 0; i < 20; i++) {
            try {
                Thread.sleep(100);
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
                break;
            }
            CacheEntry current = cacheEntry;
            if (hasUsableNews(current)) {
                return current;
            }
        }
        return cacheEntry;
    }

    private List<NoticiaDTO> fetchNewsFromApi() {
        validateConfig();

        List<String> queryBlocks = List.of(
                "\"Alianza Lima\" OR \"Universitario de Deportes\" OR \"Sporting Cristal\"",
                "\"FBC Melgar\" OR Cienciano OR \"Cusco FC\" OR \"Sport Boys\"",
                "\"Sport Huancayo\" OR \"UTC Cajamarca\" OR \"Alianza Atletico\" OR \"Atletico Grau\"",
                "\"Deportivo Garcilaso\" OR \"Comerciantes Unidos\" OR \"Los Chankas\" OR ADT",
                "\"Juan Pablo II College\" OR \"FC Cajamarca\" OR \"Deportivo Moquegua\"",
                "\"Liga 1\" OR \"Liga 1 Te Apuesto\" OR \"torneo apertura\" OR \"torneo clausura\""
        );

        Map<String, NoticiaDTO> dedup = new LinkedHashMap<>();
        for (String query : queryBlocks) {
            JsonNode body = restClient().get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/everything")
                            .queryParam("q", query)
                            .queryParam("sortBy", "publishedAt")
                            .queryParam("searchIn", "title,description")
                            .queryParam("pageSize", "20")
                            .build())
                    .retrieve()
                    .body(JsonNode.class);

            if (body == null || !"ok".equalsIgnoreCase(body.path("status").asText())) {
                continue;
            }

            for (JsonNode article : body.path("articles")) {
                NoticiaDTO noticia = mapArticle(article);
                if (noticia != null) {
                    dedup.putIfAbsent(noticia.getUrl(), noticia);
                }
            }
        }

        return dedup.values().stream()
                .sorted((a, b) -> b.getFechaPublicacion().compareTo(a.getFechaPublicacion()))
                .limit(60)
                .toList();
    }

    private NoticiaDTO mapArticle(JsonNode article) {
        String titulo = article.path("title").asText("");
        String descripcion = article.path("description").asText("");
        String url = article.path("url").asText("");
        if (titulo.isBlank() || url.isBlank()) {
            return null;
        }

        String contenido = (titulo + " " + descripcion).toLowerCase(Locale.ROOT);

        if (!isLiga1Relevant(contenido)) {
            return null;
        }

        String equipo = detectTeam(contenido);
        return NoticiaDTO.builder()
                .id(UUID.nameUUIDFromBytes(article.path("url").asText("").getBytes()).toString())
                .titulo(titulo)
                .descripcion(descripcion)
                .url(url)
                .imagen(article.path("urlToImage").isTextual() ? article.path("urlToImage").asText() : null)
                .fuente(article.path("source").path("name").asText("Fuente externa"))
                .fechaPublicacion(normalizeDate(article.path("publishedAt").asText("")))
                .equipo(equipo)
                .liga(LIGA_1_PERU)
                .build();
    }

    private boolean isLiga1Relevant(String contenido) {
        boolean mentionsLeague = contenido.contains("liga 1")
                || contenido.contains("liga1")
                || contenido.contains("liga 1 te apuesto")
                || contenido.contains("futbol peruano")
                || contenido.contains("torneo apertura")
                || contenido.contains("torneo clausura")
                || contenido.contains("liga peruana");
        boolean mentionsPeru = contenido.contains("peru")
                || contenido.contains("perú")
                || contenido.contains("peruano")
                || contenido.contains("peruana");

        boolean footballContext = contenido.contains("futbol")
                || contenido.contains("fútbol")
                || contenido.contains("soccer")
                || contenido.contains("liga")
                || contenido.contains("partido")
                || contenido.contains("club")
                || contenido.contains("gol")
                || contenido.contains("libertadores")
                || contenido.contains("sudamericana")
                || contenido.contains("apertura")
                || contenido.contains("clausura");

        long teamsMentioned = ALIASES_BY_TEAM.values().stream()
                .flatMap(List::stream)
                .map(alias -> alias.toLowerCase(Locale.ROOT))
                .filter(contenido::contains)
                .count();

        return (mentionsLeague && (mentionsPeru || teamsMentioned > 0) && footballContext)
                || (teamsMentioned > 0 && footballContext);
    }

    private String detectTeam(String contenido) {
        for (Map.Entry<String, List<String>> entry : ALIASES_BY_TEAM.entrySet()) {
            for (String alias : entry.getValue()) {
                if (contenido.contains(alias.toLowerCase(Locale.ROOT))) {
                    return entry.getKey();
                }
            }
        }
        return "Liga 1 Peru";
    }

    private String normalizeDate(String raw) {
        try {
            return OffsetDateTime.parse(raw).toString();
        } catch (DateTimeParseException ex) {
            return raw;
        }
    }

    private void validateConfig() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(BAD_GATEWAY, "Configura news.api.key para usar NewsAPI");
        }
    }

    private RestClient restClient() {
        return restClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.ACCEPT, "application/json")
                .defaultHeader("X-Api-Key", apiKey)
                .build();
    }

    private boolean isFresh(CacheEntry entry, Instant now) {
        return hasUsableNews(entry)
                && entry.expiresAt != null
                && entry.expiresAt.isAfter(now);
    }

    private boolean isExpired(CacheEntry entry, Instant now) {
        return entry == null
                || entry.expiresAt == null
                || !entry.expiresAt.isAfter(now);
    }

    private boolean hasUsableNews(CacheEntry entry) {
        return entry != null
                && entry.noticias != null
                && !entry.noticias.isEmpty()
                && (entry.staleUntil == null || entry.staleUntil.isAfter(Instant.now()));
    }

    private void loadPersistentCache() {
        Path path = Path.of(cacheFilePath);
        if (!Files.exists(path)) {
            return;
        }

        try {
            CacheEntry loaded = objectMapper.readValue(path.toFile(), CacheEntry.class);
            if (hasUsableNews(loaded)) {
                cacheEntry = loaded;
            }
        } catch (IOException ignored) {
        }
    }

    private void persistCache(CacheEntry entry) {
        Path path = Path.of(cacheFilePath);
        try {
            if (path.getParent() != null) {
                Files.createDirectories(path.getParent());
            }
            Path tempPath = path.resolveSibling(path.getFileName() + ".tmp");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(tempPath.toFile(), entry);
            try {
                Files.move(tempPath, path, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
            } catch (IOException ex) {
                Files.move(tempPath, path, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException ignored) {
        }
    }

    private static final class CacheEntry {
        public List<NoticiaDTO> noticias = new ArrayList<>();
        public Instant fetchedAt;
        public Instant expiresAt;
        public Instant staleUntil;

        public CacheEntry() {
        }

        private CacheEntry(List<NoticiaDTO> noticias, Instant fetchedAt, Instant expiresAt, Instant staleUntil) {
            this.noticias = noticias;
            this.fetchedAt = fetchedAt;
            this.expiresAt = expiresAt;
            this.staleUntil = staleUntil;
        }
    }
}
