package com.example.liga1pro.service;

import com.example.liga1pro.config.MapperUtil;
import com.example.liga1pro.dto.EstadisticaJugadorDTO;
import com.example.liga1pro.model.EstadisticaJugador;
import com.example.liga1pro.model.Jugador;
import com.example.liga1pro.repository.EstadisticaJugadorRepository;
import com.example.liga1pro.repository.JugadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstadisticaService {

    private final EstadisticaJugadorRepository estadisticaRepository;
    private final JugadorRepository jugadorRepository;

    public EstadisticaJugadorDTO obtenerPorJugador(Long jugadorId) {
        return estadisticaRepository.findByJugadorId(jugadorId)
                .map(MapperUtil::toDTO)
                .orElseThrow(() -> new RuntimeException("Sin estadísticas para jugador: " + jugadorId));
    }

    public List<EstadisticaJugadorDTO> topGoleadores() {
        return estadisticaRepository.findAllByOrderByGolesDesc()
                .stream().map(MapperUtil::toDTO).collect(Collectors.toList());
    }

    public List<EstadisticaJugadorDTO> topAsistentes() {
        return estadisticaRepository.findAllByOrderByAsistenciasDesc()
                .stream().map(MapperUtil::toDTO).collect(Collectors.toList());
    }

    public EstadisticaJugadorDTO guardar(Long jugadorId, EstadisticaJugador stats) {
        Jugador jugador = jugadorRepository.findById(jugadorId)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));
        EstadisticaJugador existente = estadisticaRepository
                .findByJugadorId(jugadorId).orElse(new EstadisticaJugador());
        existente.setJugador(jugador);
        existente.setPartidosJugados(stats.getPartidosJugados());
        existente.setGoles(stats.getGoles());
        existente.setAsistencias(stats.getAsistencias());
        existente.setTarjetasAmarillas(stats.getTarjetasAmarillas());
        existente.setTarjetasRojas(stats.getTarjetasRojas());
        existente.setMinutosJugados(stats.getMinutosJugados());
        return MapperUtil.toDTO(estadisticaRepository.save(existente));
    }
}
