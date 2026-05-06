package com.example.liga1pro.config;

import com.example.liga1pro.model.Equipo;
import com.example.liga1pro.repository.EquipoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class Liga1EquiposSeeder implements CommandLineRunner {

    private final EquipoRepository equipoRepository;

    public Liga1EquiposSeeder(EquipoRepository equipoRepository) {
        this.equipoRepository = equipoRepository;
    }

    @Override
    public void run(String... args) {
        List<String> equiposObjetivo = List.of(
                "ADT",
                "Alianza Atletico",
                "Alianza Lima",
                "Atletico Grau",
                "Cienciano",
                "Comerciantes Unidos",
                "Cusco FC",
                "Deportivo Garcilaso",
                "Deportivo Moquegua",
                "FC Cajamarca",
                "FBC Melgar",
                "Juan Pablo II College",
                "Los Chankas",
                "Sport Boys",
                "Sport Huancayo",
                "Sporting Cristal",
                "Universitario de Deportes",
                "UTC"
        );

        Set<String> existentes = equipoRepository.findAll()
                .stream()
                .map(Equipo::getNombre)
                .map(this::normalizar)
                .collect(Collectors.toSet());

        for (String nombre : equiposObjetivo) {
            String clave = normalizar(nombre);
            if (!existentes.contains(clave)) {
                Equipo nuevo = new Equipo();
                nuevo.setNombre(nombre);
                equipoRepository.save(nuevo);
                existentes.add(clave);
            }
        }
    }

    private String normalizar(String texto) {
        if (texto == null) {
            return "";
        }
        String sinAcentos = Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return sinAcentos.trim().toLowerCase();
    }
}
