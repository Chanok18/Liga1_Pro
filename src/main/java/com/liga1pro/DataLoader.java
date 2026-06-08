package com.liga1pro;

import com.liga1pro.model.Equipo;
import com.liga1pro.model.EstadoPartido;
import com.liga1pro.model.GrupoChat;
import com.liga1pro.model.Jugador;
import com.liga1pro.model.Partido;
import com.liga1pro.model.Rol;
import com.liga1pro.model.Usuario;
import com.liga1pro.repository.EquipoFavoritoRepository;
import com.liga1pro.repository.EquipoRepository;
import com.liga1pro.repository.GrupoChatRepository;
import com.liga1pro.repository.JugadorRepository;
import com.liga1pro.repository.PartidoRepository;
import com.liga1pro.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

        private final EquipoRepository equipoRepository;
        private final JugadorRepository jugadorRepository;
        private final PartidoRepository partidoRepository;
        private final EquipoFavoritoRepository equipoFavoritoRepository;
        private final UsuarioRepository usuarioRepository;
        private final PasswordEncoder passwordEncoder;
        private final GrupoChatRepository grupoChatRepository;

        @Override
        @Transactional
        public void run(String... args) throws Exception {

                // =========================================================
                // EQUIPOS
                // =========================================================
                if (equipoRepository.count() == 0) {

                        List<Equipo> equipos = Arrays.asList(

                                        Equipo.builder()
                                                        .nombre("Universitario")
                                                        .ciudad("Lima")
                                                        .estadio("Monumental U Marathon")
                                                        .entrenador("Héctor Cúper")
                                                        .fundacion(1924)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("Alianza Lima")
                                                        .ciudad("Lima")
                                                        .estadio("Alejandro Villanueva")
                                                        .entrenador("Pablo Guede")
                                                        .fundacion(1901)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("Sporting Cristal")
                                                        .ciudad("Lima")
                                                        .estadio("Alberto Gallardo")
                                                        .entrenador("Paulo Autuori")
                                                        .fundacion(1955)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("FBC Melgar")
                                                        .ciudad("Arequipa")
                                                        .estadio("Monumental UNSA")
                                                        .entrenador("Juan Reynoso")
                                                        .fundacion(1915)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("Cienciano")
                                                        .ciudad("Cusco")
                                                        .estadio("Inca Garcilaso")
                                                        .entrenador("Horacio Melgarejo")
                                                        .fundacion(1901)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("Cusco FC")
                                                        .ciudad("Cusco")
                                                        .estadio("Inca Garcilaso")
                                                        .entrenador("Miguel Rondelli")
                                                        .fundacion(2010)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("Deportivo Garcilaso")
                                                        .ciudad("Cusco")
                                                        .estadio("Inca Garcilaso")
                                                        .entrenador("Sebastián Domínguez")
                                                        .fundacion(2007)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("Sport Huancayo")
                                                        .ciudad("Huancayo")
                                                        .estadio("Huancayo")
                                                        .entrenador("Roberto Mosquera")
                                                        .fundacion(2008)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("ADT")
                                                        .ciudad("Tarma")
                                                        .estadio("Unión Tarma")
                                                        .entrenador("Diego Ripacolli")
                                                        .fundacion(1984)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("Los Chankas")
                                                        .ciudad("Andahuaylas")
                                                        .estadio("Los Chankas")
                                                        .entrenador("Walter Paolella")
                                                        .fundacion(2011)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("Atlético Grau")
                                                        .ciudad("Piura")
                                                        .estadio("Campeones del 36")
                                                        .entrenador("Gerardo Ameli")
                                                        .fundacion(1919)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("Alianza Atlético")
                                                        .ciudad("Sullana")
                                                        .estadio("Campeones del 36")
                                                        .entrenador("Federico Urciuoli")
                                                        .fundacion(1920)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("Sport Boys")
                                                        .ciudad("Callao")
                                                        .estadio("Miguel Grau")
                                                        .entrenador("Carlos Desio")
                                                        .fundacion(1927)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("UTC")
                                                        .ciudad("Cajamarca")
                                                        .estadio("Germán Contreras Jara")
                                                        .entrenador("Carlos Bustos")
                                                        .fundacion(1908)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("Comerciantes Unidos")
                                                        .ciudad("Cutervo")
                                                        .estadio("Juan Maldonado Gamarra")
                                                        .entrenador("Claudio Biaggio")
                                                        .fundacion(2008)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("Juan Pablo II College")
                                                        .ciudad("Chongoyape")
                                                        .estadio("Juan Pablo II")
                                                        .entrenador("Marcelo Zuleta")
                                                        .fundacion(2010)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("FC Cajamarca")
                                                        .ciudad("Cajamarca")
                                                        .estadio("Héroes de San Ramón")
                                                        .entrenador("Celso Ayala")
                                                        .fundacion(2010)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build(),

                                        Equipo.builder()
                                                        .nombre("CD Moquegua")
                                                        .ciudad("Moquegua")
                                                        .estadio("25 de Noviembre")
                                                        .entrenador("Jaime Serna")
                                                        .fundacion(1965)
                                                        .escudo("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120")
                                                        .build());

                        equipoRepository.saveAll(equipos);

                        System.out.println("=========================================================");
                        System.out.println("✅ Equipos cargados correctamente");
                        System.out.println("=========================================================");
                }

                // =========================================================
                // JUGADORES
                // =========================================================
                if (jugadorRepository.count() == 0) {

                        Equipo laU = equipoRepository.findByNombre("Universitario de Deportes");

                        if (laU != null) {

                                List<Jugador> jugadores = Arrays.asList(

                                                // PORTEROS
                                                Jugador.builder().nombre("Diego").apellido("Romero").posicion("Portero")
                                                                .numeroCamiseta(1).nacionalidad("Peruano").edad(23)
                                                                .equipo(laU).build(),
                                                Jugador.builder().nombre("Manuel").apellido("Heredia")
                                                                .posicion("Portero").numeroCamiseta(12)
                                                                .nacionalidad("Peruano").edad(34).equipo(laU).build(),

                                                // DEFENSAS
                                                Jugador.builder().nombre("Aldo").apellido("Corzo").posicion("Defensa")
                                                                .numeroCamiseta(2).nacionalidad("Peruano").edad(37)
                                                                .equipo(laU).build(),
                                                Jugador.builder().nombre("Matías").apellido("Di Benedetto")
                                                                .posicion("Defensa").numeroCamiseta(5)
                                                                .nacionalidad("Argentino").edad(33).equipo(laU).build(),
                                                Jugador.builder().nombre("Williams").apellido("Riveros")
                                                                .posicion("Defensa").numeroCamiseta(3)
                                                                .nacionalidad("Paraguayo").edad(33).equipo(laU).build(),
                                                Jugador.builder().nombre("Gustavo").apellido("Dulanto")
                                                                .posicion("Defensa").numeroCamiseta(4)
                                                                .nacionalidad("Peruano").edad(30).equipo(laU).build(),
                                                Jugador.builder().nombre("Joaquín").apellido("Carabalí")
                                                                .posicion("Defensa").numeroCamiseta(27)
                                                                .nacionalidad("Ecuatoriano").edad(28).equipo(laU)
                                                                .build(),

                                                // MEDIOCAMPISTAS
                                                Jugador.builder().nombre("Jairo").apellido("Concha")
                                                                .posicion("Mediocampista").numeroCamiseta(17)
                                                                .nacionalidad("Peruano").edad(26).equipo(laU).build(),
                                                Jugador.builder().nombre("Jorge").apellido("Murrugarra")
                                                                .posicion("Mediocampista").numeroCamiseta(23)
                                                                .nacionalidad("Peruano").edad(29).equipo(laU).build(),
                                                Jugador.builder().nombre("Horacio").apellido("Calcaterra")
                                                                .posicion("Mediocampista").numeroCamiseta(10)
                                                                .nacionalidad("Argentino").edad(36).equipo(laU).build(),
                                                Jugador.builder().nombre("Andy").apellido("Polo")
                                                                .posicion("Mediocampista").numeroCamiseta(7)
                                                                .nacionalidad("Peruano").edad(31).equipo(laU).build(),

                                                // DELANTEROS
                                                Jugador.builder().nombre("Alex").apellido("Valera")
                                                                .posicion("Delantero").numeroCamiseta(9)
                                                                .nacionalidad("Peruano").edad(29).equipo(laU).build(),
                                                Jugador.builder().nombre("Edison").apellido("Flores")
                                                                .posicion("Delantero").numeroCamiseta(19)
                                                                .nacionalidad("Peruano").edad(31).equipo(laU).build(),
                                                Jugador.builder().nombre("José").apellido("Rivera")
                                                                .posicion("Delantero").numeroCamiseta(11)
                                                                .nacionalidad("Peruano").edad(27).equipo(laU).build()

                                );

                                jugadorRepository.saveAll(jugadores);

                                System.out.println("=========================================================");
                                System.out.println("✅ Jugadores cargados correctamente");
                                System.out.println("=========================================================");
                        }
                }

                // =========================================================
                // PARTIDOS
                // =========================================================
                if (partidoRepository.count() == 0) {

                        Equipo juanPablo = equipoRepository.findByNombre("Juan Pablo II College");
                        Equipo melgar = equipoRepository.findByNombre("FBC Melgar");
                        Equipo moquegua = equipoRepository.findByNombre("CD Moquegua");
                        Equipo universitario = equipoRepository.findByNombre("Universitario");
                        Equipo alianza = equipoRepository.findByNombre("Alianza Lima");
                        Equipo chankas = equipoRepository.findByNombre("Los Chankas");
                        Equipo cristal = equipoRepository.findByNombre("Sporting Cristal");
                        Equipo adt = equipoRepository.findByNombre("ADT");
                        Equipo huancayo = equipoRepository.findByNombre("Sport Huancayo");
                        Equipo cienciano = equipoRepository.findByNombre("Cienciano");
                        Equipo alianzaAtletico = equipoRepository.findByNombre("Alianza Atlético");
                        Equipo cajamarca = equipoRepository.findByNombre("FC Cajamarca");
                        Equipo comerciantes = equipoRepository.findByNombre("Comerciantes Unidos");
                        Equipo garcilaso = equipoRepository.findByNombre("Deportivo Garcilaso");
                        Equipo cuscoFC = equipoRepository.findByNombre("Cusco FC");
                        Equipo grau = equipoRepository.findByNombre("Atlético Grau");
                        Equipo utc = equipoRepository.findByNombre("UTC");
                        Equipo boys = equipoRepository.findByNombre("Sport Boys");

                        guardarPartidoSiExisten(
                                        juanPablo, melgar,
                                        LocalDate.of(2026, 5, 23),
                                        LocalTime.of(15, 0),
                                        "Juan Pablo II",
                                        16,
                                        1,
                                        1,
                                        EstadoPartido.FINALIZADO);

                        guardarPartidoSiExisten(
                                        moquegua, universitario,
                                        LocalDate.of(2026, 5, 24),
                                        LocalTime.of(12, 45),
                                        "25 de Noviembre",
                                        16,
                                        0,
                                        0,
                                        EstadoPartido.PROGRAMADO);

                        guardarPartidoSiExisten(
                                        alianza, chankas,
                                        LocalDate.of(2026, 5, 24),
                                        LocalTime.of(15, 30),
                                        "Alejandro Villanueva",
                                        16,
                                        0,
                                        0,
                                        EstadoPartido.PROGRAMADO);

                        guardarPartidoSiExisten(
                                        cristal, adt,
                                        LocalDate.of(2026, 5, 25),
                                        LocalTime.of(15, 0),
                                        "Alberto Gallardo",
                                        16,
                                        0,
                                        0,
                                        EstadoPartido.PROGRAMADO);

                        guardarPartidoSiExisten(
                                        huancayo, cienciano,
                                        LocalDate.of(2026, 5, 25),
                                        LocalTime.of(15, 0),
                                        "Huancayo",
                                        16,
                                        0,
                                        0,
                                        EstadoPartido.PROGRAMADO);

                        guardarPartidoSiExisten(
                                        alianzaAtletico, cajamarca,
                                        LocalDate.of(2026, 5, 25),
                                        LocalTime.of(15, 0),
                                        "Campeones del 36",
                                        16,
                                        0,
                                        0,
                                        EstadoPartido.PROGRAMADO);

                        guardarPartidoSiExisten(
                                        comerciantes, garcilaso,
                                        LocalDate.of(2026, 5, 26),
                                        LocalTime.of(15, 0),
                                        "Juan Maldonado Gamarra",
                                        16,
                                        0,
                                        0,
                                        EstadoPartido.PROGRAMADO);

                        guardarPartidoSiExisten(
                                        cuscoFC, grau,
                                        LocalDate.of(2026, 5, 24),
                                        LocalTime.of(15, 0),
                                        "Inca Garcilaso",
                                        16,
                                        0,
                                        0,
                                        EstadoPartido.PROGRAMADO);

                        guardarPartidoSiExisten(
                                        utc, boys,
                                        LocalDate.of(2026, 5, 24),
                                        LocalTime.of(15, 0),
                                        "Germán Contreras Jara",
                                        16,
                                        0,
                                        0,
                                        EstadoPartido.PROGRAMADO);

                        System.out.println("=========================================================");
                        System.out.println("✅ Partidos cargados correctamente");
                        System.out.println("=========================================================");
                }

                // =========================================================
                // USUARIO ADMIN Y GRUPOS DE CHAT
                // =========================================================
                Usuario admin = usuarioRepository.findByEmail("admin@liga1pro.com")
                        .orElseGet(() -> {
                                Usuario newAdmin = Usuario.builder()
                                                .nombre("Administrador Liga1 Pro")
                                                .email("admin@liga1pro.com")
                                                .password(passwordEncoder.encode("admin123"))
                                                .rol(Rol.ADMIN)
                                                .build();
                                Usuario saved = usuarioRepository.save(newAdmin);
                                System.out.println("=========================================================");
                                System.out.println("✅ Usuario admin creado: admin@liga1pro.com / admin123");
                                System.out.println("=========================================================");
                                return saved;
                        });

                if (grupoChatRepository.count() == 0) {
                        List<GrupoChat> grupos = Arrays.asList(
                                        GrupoChat.builder()
                                                        .nombre("Hinchada Crema")
                                                        .descripcion("Conversaciones de Universitario")
                                                        .admin(admin)
                                                        .build(),
                                        GrupoChat.builder()
                                                        .nombre("Fans de Alianza")
                                                        .descripcion("Debate y recomendaciones de Alianza")
                                                        .admin(admin)
                                                        .build(),
                                        GrupoChat.builder()
                                                        .nombre("Liga 1 General")
                                                        .descripcion("Temas generales del torneo")
                                                        .admin(admin)
                                                        .build(),
                                        GrupoChat.builder()
                                                        .nombre("Análisis Táctico")
                                                        .descripcion("Charlas tácticas y estadísticas")
                                                        .admin(admin)
                                                        .build()
                        );
                        grupoChatRepository.saveAll(grupos);
                        System.out.println("=========================================================");
                        System.out.println("✅ Grupos de chat creados correctamente");
                        System.out.println("=========================================================");
                }
        }

        // =========================================================
        // MÉTODO AUXILIAR
        // =========================================================
        private void guardarPartidoSiExisten(
                        Equipo local,
                        Equipo visitante,
                        LocalDate fecha,
                        LocalTime hora,
                        String estadio,
                        int jornada,
                        int golesLocal,
                        int golesVisitante,
                        EstadoPartido estado) {

                if (local != null && visitante != null) {

                        Partido partido = Partido.builder()
                                        .equipoLocal(local)
                                        .equipoVisitante(visitante)
                                        .fecha(fecha)
                                        .hora(hora)
                                        .estadio(estadio)
                                        .jornada(jornada)
                                        .golesLocal(golesLocal)
                                        .golesVisitante(golesVisitante)
                                        .estado(estado)
                                        .build();

                        partidoRepository.save(partido);

                } else {

                        System.out.println("=========================================================");
                        System.out.println("⚠ PARTIDO OMITIDO - Equipo no encontrado:");
                        System.out.println(
                                        (local == null ? "LOCAL null" : local.getNombre())
                                                        + " vs "
                                                        + (visitante == null ? "VISITANTE null"
                                                                        : visitante.getNombre()));
                        System.out.println("=========================================================");
                }
        }
}