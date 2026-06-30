package com.liga1pro.service;

import com.liga1pro.dto.EstadisticaJugadorDTO;
import com.liga1pro.model.EstadisticaJugador;
import com.liga1pro.model.Jugador;
import com.liga1pro.repository.EstadisticaJugadorRepository;
import com.liga1pro.repository.JugadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstadisticaJugadorService {

    private final EstadisticaJugadorRepository estadisticaRepository;
    private final JugadorRepository jugadorRepository;

    public EstadisticaJugador guardar(EstadisticaJugador e) {
        return estadisticaRepository.save(e);
    }

    public List<EstadisticaJugador> obtenerPorPartido(Long partidoId) {
        return estadisticaRepository.findByPartidoId(partidoId);
    }

    public EstadisticaJugadorDTO obtenerResumenJugador(Long jugadorId) {
        Jugador j = jugadorRepository.findById(jugadorId)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        Object[] resumen = estadisticaRepository.findResumenByJugadorId(jugadorId);
        List<EstadisticaJugador> partidos = estadisticaRepository.findByJugadorId(jugadorId);

        return EstadisticaJugadorDTO.builder()
                .jugadorId(jugadorId)
                .nombreCompleto(j.getNombre() + " " + j.getApellido())
                .equipo(j.getEquipo().getNombre())
                .posicion(j.getPosicion())
                .goles(resumen[0] != null ? ((Number) resumen[0]).intValue() : 0)
                .asistencias(resumen[1] != null ? ((Number) resumen[1]).intValue() : 0)
                .amarillas(resumen[2] != null ? ((Number) resumen[2]).intValue() : 0)
                .rojas(resumen[3] != null ? ((Number) resumen[3]).intValue() : 0)
                .minutosJugados(resumen[4] != null ? ((Number) resumen[4]).intValue() : 0)
                .partidosJugados(partidos.size())
                .build();
    }

    public List<Object[]> topGoleadores() {
        return estadisticaRepository.findTopGoleadores();
    }
}