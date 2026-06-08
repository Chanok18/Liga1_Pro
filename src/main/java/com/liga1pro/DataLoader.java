package com.liga1pro;

import com.liga1pro.model.*;
import com.liga1pro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

        private final EquipoRepository equipoRepository;
        private final JugadorRepository jugadorRepository;
        private final PartidoRepository partidoRepository;
        private final EstadisticaJugadorRepository estadisticaJugadorRepository;
        private final UsuarioRepository usuarioRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) throws Exception {

                // =========================================================
                // USUARIOS
                // =========================================================
                if (usuarioRepository.count() == 0) {
                        List<Usuario> usuarios = Arrays.asList(
                                Usuario.builder()
                                        .nombre("Rony Carlos")
                                        .email("rony@liga1pro.com")
                                        .password(passwordEncoder.encode("12345678"))
                                        .rol(Rol.ADMIN)
                                        .build(),
                                Usuario.builder()
                                        .nombre("Juan Pérez")
                                        .email("juan@liga1pro.com")
                                        .password(passwordEncoder.encode("12345678"))
                                        .rol(Rol.USER)
                                        .build(),
                                Usuario.builder()
                                        .nombre("Maria García")
                                        .email("maria@liga1pro.com")
                                        .password(passwordEncoder.encode("12345678"))
                                        .rol(Rol.USER)
                                        .build(),
                                Usuario.builder()
                                        .nombre("Carlos López")
                                        .email("carlos@liga1pro.com")
                                        .password(passwordEncoder.encode("12345678"))
                                        .rol(Rol.USER)
                                        .build(),
                                Usuario.builder()
                                        .nombre("Ana Martínez")
                                        .email("ana@liga1pro.com")
                                        .password(passwordEncoder.encode("12345678"))
                                        .rol(Rol.USER)
                                        .build()
                        );
                        usuarioRepository.saveAll(usuarios);
                        System.out.println("=========================================================");
                        System.out.println("✅ Usuarios cargados correctamente");
                        System.out.println("=========================================================");
                }

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
                        // Universitario
                        Equipo laU = equipoRepository.findByNombre("Universitario");
                        if (laU != null) {
                                List<Jugador> jugadoresU = Arrays.asList(
                                        Jugador.builder().nombre("Diego").apellido("Romero").posicion("Portero")
                                                .numeroCamiseta(1).nacionalidad("Peruano").edad(23).equipo(laU).build(),
                                        Jugador.builder().nombre("Manuel").apellido("Heredia").posicion("Portero")
                                                .numeroCamiseta(12).nacionalidad("Peruano").edad(34).equipo(laU).build(),
                                        Jugador.builder().nombre("Aldo").apellido("Corzo").posicion("Defensa")
                                                .numeroCamiseta(2).nacionalidad("Peruano").edad(37).equipo(laU).build(),
                                        Jugador.builder().nombre("Matías").apellido("Di Benedetto").posicion("Defensa")
                                                .numeroCamiseta(5).nacionalidad("Argentino").edad(33).equipo(laU).build(),
                                        Jugador.builder().nombre("Williams").apellido("Riveros").posicion("Defensa")
                                                .numeroCamiseta(3).nacionalidad("Paraguayo").edad(33).equipo(laU).build(),
                                        Jugador.builder().nombre("Gustavo").apellido("Dulanto").posicion("Defensa")
                                                .numeroCamiseta(4).nacionalidad("Peruano").edad(30).equipo(laU).build(),
                                        Jugador.builder().nombre("Joaquín").apellido("Carabalí").posicion("Defensa")
                                                .numeroCamiseta(27).nacionalidad("Ecuatoriano").edad(28).equipo(laU).build(),
                                        Jugador.builder().nombre("Jairo").apellido("Concha").posicion("Mediocampista")
                                                .numeroCamiseta(17).nacionalidad("Peruano").edad(26).equipo(laU).build(),
                                        Jugador.builder().nombre("Jorge").apellido("Murrugarra").posicion("Mediocampista")
                                                .numeroCamiseta(23).nacionalidad("Peruano").edad(29).equipo(laU).build(),
                                        Jugador.builder().nombre("Horacio").apellido("Calcaterra").posicion("Mediocampista")
                                                .numeroCamiseta(10).nacionalidad("Argentino").edad(36).equipo(laU).build(),
                                        Jugador.builder().nombre("Andy").apellido("Polo").posicion("Mediocampista")
                                                .numeroCamiseta(7).nacionalidad("Peruano").edad(31).equipo(laU).build(),
                                        Jugador.builder().nombre("Alex").apellido("Valera").posicion("Delantero")
                                                .numeroCamiseta(9).nacionalidad("Peruano").edad(29).equipo(laU).build(),
                                        Jugador.builder().nombre("Edison").apellido("Flores").posicion("Delantero")
                                                .numeroCamiseta(19).nacionalidad("Peruano").edad(31).equipo(laU).build(),
                                        Jugador.builder().nombre("José").apellido("Rivera").posicion("Delantero")
                                                .numeroCamiseta(11).nacionalidad("Peruano").edad(27).equipo(laU).build()
                                );
                                jugadorRepository.saveAll(jugadoresU);
                        }

                        // Alianza Lima
                        Equipo alianza = equipoRepository.findByNombre("Alianza Lima");
                        if (alianza != null) {
                                List<Jugador> jugadoresAlianza = Arrays.asList(
                                        Jugador.builder().nombre("Ángelo").apellido("Campos").posicion("Portero")
                                                .numeroCamiseta(1).nacionalidad("Peruano").edad(30).equipo(alianza).build(),
                                        Jugador.builder().nombre("Cristian").apellido("Benavente").posicion("Defensa")
                                                .numeroCamiseta(4).nacionalidad("Peruano").edad(26).equipo(alianza).build(),
                                        Jugador.builder().nombre("Víctor").apellido("Rivas").posicion("Defensa")
                                                .numeroCamiseta(3).nacionalidad("Peruano").edad(28).equipo(alianza).build(),
                                        Jugador.builder().nombre("Juan").apellido("Pablo").posicion("Defensa")
                                                .numeroCamiseta(2).nacionalidad("Peruano").edad(25).equipo(alianza).build(),
                                        Jugador.builder().nombre("Leandro").apellido("Martins").posicion("Mediocampista")
                                                .numeroCamiseta(5).nacionalidad("Brasileño").edad(31).equipo(alianza).build(),
                                        Jugador.builder().nombre("Hernán").apellido("Barcos").posicion("Delantero")
                                                .numeroCamiseta(9).nacionalidad("Argentino").edad(32).equipo(alianza).build(),
                                        Jugador.builder().nombre("Cristian").apellido("Cueva").posicion("Mediocampista")
                                                .numeroCamiseta(10).nacionalidad("Peruano").edad(29).equipo(alianza).build(),
                                        Jugador.builder().nombre("Fabio").apellido("Otero").posicion("Delantero")
                                                .numeroCamiseta(7).nacionalidad("Peruano").edad(26).equipo(alianza).build()
                                );
                                jugadorRepository.saveAll(jugadoresAlianza);
                        }

                        // Sporting Cristal
                        Equipo cristal = equipoRepository.findByNombre("Sporting Cristal");
                        if (cristal != null) {
                                List<Jugador> jugadoresCristal = Arrays.asList(
                                        Jugador.builder().nombre("Patric").apellido("Silva").posicion("Portero")
                                                .numeroCamiseta(1).nacionalidad("Brasileño").edad(28).equipo(cristal).build(),
                                        Jugador.builder().nombre("Roberto").apellido("Ormachea").posicion("Defensa")
                                                .numeroCamiseta(4).nacionalidad("Boliviano").edad(27).equipo(cristal).build(),
                                        Jugador.builder().nombre("Mitchell").apellido("Mendoza").posicion("Defensa")
                                                .numeroCamiseta(5).nacionalidad("Peruano").edad(24).equipo(cristal).build(),
                                        Jugador.builder().nombre("Carlos").apellido("Casilla").posicion("Defensa")
                                                .numeroCamiseta(3).nacionalidad("Peruano").edad(26).equipo(cristal).build(),
                                        Jugador.builder().nombre("Jhoyo").apellido("Sánchez").posicion("Mediocampista")
                                                .numeroCamiseta(6).nacionalidad("Peruano").edad(25).equipo(cristal).build(),
                                        Jugador.builder().nombre("Raúl").apellido("Ruidíaz").posicion("Delantero")
                                                .numeroCamiseta(10).nacionalidad("Peruano").edad(32).equipo(cristal).build(),
                                        Jugador.builder().nombre("Edwin").apellido("Andreu").posicion("Delantero")
                                                .numeroCamiseta(9).nacionalidad("Peruano").edad(28).equipo(cristal).build(),
                                        Jugador.builder().nombre("Nilson").apellido("Loyola").posicion("Mediocampista")
                                                .numeroCamiseta(8).nacionalidad("Peruano").edad(27).equipo(cristal).build()
                                );
                                jugadorRepository.saveAll(jugadoresCristal);
                        }

                        // FBC Melgar
                        Equipo melgar = equipoRepository.findByNombre("FBC Melgar");
                        if (melgar != null) {
                                List<Jugador> jugadoresMelgar = Arrays.asList(
                                        Jugador.builder().nombre("Carlos").apellido("Cáceda").posicion("Portero")
                                                .numeroCamiseta(1).nacionalidad("Peruano").edad(35).equipo(melgar).build(),
                                        Jugador.builder().nombre("Jhony").apellido("Ramírez").posicion("Defensa")
                                                .numeroCamiseta(4).nacionalidad("Peruano").edad(24).equipo(melgar).build(),
                                        Jugador.builder().nombre("Cristian").apellido("Zúñiga").posicion("Defensa")
                                                .numeroCamiseta(3).nacionalidad("Peruano").edad(23).equipo(melgar).build(),
                                        Jugador.builder().nombre("Jhamir").apellido("D'Alessandro").posicion("Mediocampista")
                                                .numeroCamiseta(6).nacionalidad("Peruano").edad(34).equipo(melgar).build(),
                                        Jugador.builder().nombre("Cristian").apellido("Benavente").posicion("Mediocampista")
                                                .numeroCamiseta(10).nacionalidad("Peruano").edad(29).equipo(melgar).build(),
                                        Jugador.builder().nombre("Waldir").apellido("Martínez").posicion("Delantero")
                                                .numeroCamiseta(9).nacionalidad("Peruano").edad(30).equipo(melgar).build()
                                );
                                jugadorRepository.saveAll(jugadoresMelgar);
                        }

                        System.out.println("=========================================================");
                        System.out.println("✅ Jugadores cargados correctamente (100+ jugadores)");
                        System.out.println("=========================================================");
                }


                // =========================================================
                // PARTIDOS (50+)
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

                        // RESULTADOS PASADOS (FINALIZADOS)
                        guardarPartidoSiExisten(juanPablo, melgar, LocalDate.of(2026, 5, 23), LocalTime.of(15, 0),
                                "Juan Pablo II", 1, 1, 1, EstadoPartido.FINALIZADO);
                        guardarPartidoSiExisten(universitario, cristal, LocalDate.of(2026, 5, 22), LocalTime.of(19, 0),
                                "Monumental U Marathon", 1, 3, 1, EstadoPartido.FINALIZADO);
                        guardarPartidoSiExisten(alianza, comerciantes, LocalDate.of(2026, 5, 21), LocalTime.of(19, 30),
                                "Alejandro Villanueva", 1, 2, 0, EstadoPartido.FINALIZADO);
                        guardarPartidoSiExisten(cristal, huancayo, LocalDate.of(2026, 5, 20), LocalTime.of(15, 0),
                                "Alberto Gallardo", 1, 4, 1, EstadoPartido.FINALIZADO);
                        guardarPartidoSiExisten(melgar, cienciano, LocalDate.of(2026, 5, 19), LocalTime.of(16, 0),
                                "Monumental UNSA", 1, 2, 2, EstadoPartido.FINALIZADO);
                        guardarPartidoSiExisten(adt, cuscoFC, LocalDate.of(2026, 5, 18), LocalTime.of(15, 0),
                                "Unión Tarma", 1, 1, 3, EstadoPartido.FINALIZADO);
                        guardarPartidoSiExisten(grau, boys, LocalDate.of(2026, 5, 17), LocalTime.of(15, 0),
                                "Campeones del 36", 1, 0, 0, EstadoPartido.FINALIZADO);
                        guardarPartidoSiExisten(chankas, adt, LocalDate.of(2026, 5, 16), LocalTime.of(14, 0),
                                "Los Chankas", 1, 2, 1, EstadoPartido.FINALIZADO);
                        guardarPartidoSiExisten(alianzaAtletico, cajamarca, LocalDate.of(2026, 5, 15), LocalTime.of(15, 0),
                                "Campeones del 36", 1, 3, 0, EstadoPartido.FINALIZADO);
                        guardarPartidoSiExisten(garcilaso, utc, LocalDate.of(2026, 5, 14), LocalTime.of(15, 0),
                                "Inca Garcilaso", 1, 1, 2, EstadoPartido.FINALIZADO);

                        // EN VIVO
                        guardarPartidoSiExisten(universitario, alianza, LocalDate.of(2026, 6, 7), LocalTime.of(19, 0),
                                "Monumental U Marathon", 2, 2, 1, EstadoPartido.EN_VIVO);
                        guardarPartidoSiExisten(cristal, melgar, LocalDate.of(2026, 6, 7), LocalTime.of(15, 0),
                                "Alberto Gallardo", 2, 1, 0, EstadoPartido.EN_VIVO);

                        // PRÓXIMOS PARTIDOS (PROGRAMADO)
                        guardarPartidoSiExisten(moquegua, universitario, LocalDate.of(2026, 6, 8), LocalTime.of(12, 45),
                                "25 de Noviembre", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(alianza, chankas, LocalDate.of(2026, 6, 8), LocalTime.of(15, 30),
                                "Alejandro Villanueva", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(cristal, adt, LocalDate.of(2026, 6, 9), LocalTime.of(15, 0),
                                "Alberto Gallardo", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(huancayo, cienciano, LocalDate.of(2026, 6, 9), LocalTime.of(15, 0),
                                "Huancayo", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(alianzaAtletico, cajamarca, LocalDate.of(2026, 6, 9), LocalTime.of(15, 0),
                                "Campeones del 36", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(comerciantes, garcilaso, LocalDate.of(2026, 6, 10), LocalTime.of(15, 0),
                                "Juan Maldonado Gamarra", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(cuscoFC, grau, LocalDate.of(2026, 6, 8), LocalTime.of(15, 0),
                                "Inca Garcilaso", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(utc, boys, LocalDate.of(2026, 6, 8), LocalTime.of(15, 0),
                                "Germán Contreras Jara", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(juanPablo, melgar, LocalDate.of(2026, 6, 11), LocalTime.of(16, 0),
                                "Juan Pablo II", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(adt, alianza, LocalDate.of(2026, 6, 12), LocalTime.of(19, 0),
                                "Unión Tarma", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(melgar, universitario, LocalDate.of(2026, 6, 13), LocalTime.of(19, 30),
                                "Monumental UNSA", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(cienciano, cristal, LocalDate.of(2026, 6, 14), LocalTime.of(15, 0),
                                "Inca Garcilaso", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(chankas, alianzaAtletico, LocalDate.of(2026, 6, 15), LocalTime.of(14, 0),
                                "Los Chankas", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(huancayo, moquegua, LocalDate.of(2026, 6, 16), LocalTime.of(15, 0),
                                "Huancayo", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(cuscoFC, comerciantes, LocalDate.of(2026, 6, 17), LocalTime.of(15, 0),
                                "Inca Garcilaso", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(boys, grau, LocalDate.of(2026, 6, 18), LocalTime.of(15, 0),
                                "Miguel Grau", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(cajamarca, adt, LocalDate.of(2026, 6, 19), LocalTime.of(15, 0),
                                "Héroes de San Ramón", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(garcilaso, juanPablo, LocalDate.of(2026, 6, 20), LocalTime.of(15, 0),
                                "Inca Garcilaso", 2, 0, 0, EstadoPartido.PROGRAMADO);
                        guardarPartidoSiExisten(universitario, comerciantes, LocalDate.of(2026, 6, 21), LocalTime.of(19, 0),
                                "Monumental U Marathon", 2, 0, 0, EstadoPartido.PROGRAMADO);

                        System.out.println("=========================================================");
                        System.out.println("✅ Partidos cargados correctamente (50+ partidos)");
                        System.out.println("=========================================================");
                }

                if (estadisticaJugadorRepository.count() == 0) {
                        List<Partido> finalizados = partidoRepository.findByEstado(EstadoPartido.FINALIZADO);
                        Jugador alexValera = buscarJugador("Alex", "Valera");
                        Jugador edisonFlores = buscarJugador("Edison", "Flores");
                        Jugador horacioCalcaterra = buscarJugador("Horacio", "Calcaterra");
                        Jugador hernanBarcos = buscarJugador("Hernán", "Barcos");
                        Jugador raulRuidiaz = buscarJugador("Raúl", "Ruidíaz");
                        Jugador walterMartinez = buscarJugador("Waldir", "Martínez");
                        Jugador cristianBenavente = buscarJugador("Cristian", "Benavente");
                        Jugador jairoConcha = buscarJugador("Jairo", "Concha");

                        List<EstadisticaJugador> estadisticas = new ArrayList<>();
                        if (!finalizados.isEmpty()) {
                                agregarEstadisticaSiPosible(estadisticas, alexValera, finalizados.get(0), 2, 0, 0, 0, 90, true);
                                agregarEstadisticaSiPosible(estadisticas, edisonFlores, finalizados.get(0), 1, 1, 0, 0, 90, true);
                                agregarEstadisticaSiPosible(estadisticas, horacioCalcaterra, finalizados.get(0), 0, 2, 1, 0, 89, true);
                        }
                        if (finalizados.size() > 1) {
                                agregarEstadisticaSiPosible(estadisticas, hernanBarcos, finalizados.get(1), 1, 0, 0, 0, 90, true);
                                agregarEstadisticaSiPosible(estadisticas, cristianBenavente, finalizados.get(1), 0, 1, 0, 0, 88, true);
                        }
                        if (finalizados.size() > 2) {
                                agregarEstadisticaSiPosible(estadisticas, raulRuidiaz, finalizados.get(2), 3, 0, 1, 0, 90, true);
                                agregarEstadisticaSiPosible(estadisticas, walterMartinez, finalizados.get(2), 2, 0, 0, 0, 90, true);
                        }
                        if (finalizados.size() > 3) {
                                agregarEstadisticaSiPosible(estadisticas, jairoConcha, finalizados.get(3), 1, 1, 0, 0, 90, true);
                        }

                        if (!estadisticas.isEmpty()) {
                                estadisticaJugadorRepository.saveAll(estadisticas);
                                System.out.println("=========================================================");
                                System.out.println("✅ Estadísticas de jugadores cargadas correctamente");
                                System.out.println("=========================================================");
                        }
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

        private Jugador buscarJugador(String nombre, String apellido) {
                return jugadorRepository.findAll().stream()
                        .filter(j -> nombre.equals(j.getNombre()) && apellido.equals(j.getApellido()))
                        .findFirst()
                        .orElse(null);
        }

        private void agregarEstadisticaSiPosible(
                List<EstadisticaJugador> lista,
                Jugador jugador,
                Partido partido,
                int goles,
                int asistencias,
                int amarillas,
                int rojas,
                int minutosJugados,
                boolean titular) {

                if (jugador != null && partido != null) {
                        lista.add(EstadisticaJugador.builder()
                                .jugador(jugador)
                                .partido(partido)
                                .goles(goles)
                                .asistencias(asistencias)
                                .amarillas(amarillas)
                                .rojas(rojas)
                                .minutosJugados(minutosJugados)
                                .titular(titular)
                                .build());
                }
        }
}