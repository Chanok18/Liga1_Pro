package com.example.liga1pro.service;

import com.example.liga1pro.dto.EstadisticaJugadorDTO;
import com.example.liga1pro.model.EstadisticaJugador;
import com.example.liga1pro.repository.EstadisticaJugadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstadisticaService {
    
    @Autowired
    private EstadisticaJugadorRepository estadisticaRepository;
    
    public List<EstadisticaJugadorDTO> obtenerEstadisticasPorPartido(Long partidoId) {
        return estadisticaRepository.findByPartidoId(partidoId)
            .stream()
            .map(this::convertirEstadisticaDTO)
            .collect(Collectors.toList());
    }
    
    public List<EstadisticaJugadorDTO> obtenerEstadisticasPorJugador(Long jugadorId) {
        return estadisticaRepository.findByJugadorId(jugadorId)
            .stream()
            .map(this::convertirEstadisticaDTO)
            .collect(Collectors.toList());
    }
    
    private EstadisticaJugadorDTO convertirEstadisticaDTO(EstadisticaJugador est) {
        EstadisticaJugadorDTO dto = new EstadisticaJugadorDTO();
        dto.setId(est.getId());
        dto.setJugadorId(est.getJugador().getId());
        dto.setPartidoId(est.getPartido().getId());
        dto.setGoles(est.getGoles());
        dto.setAsistencias(est.getAsistencias());
        dto.setTarjetasAmarillas(est.getTarjetasAmarillas());
        dto.setTarjetasRojas(est.getTarjetasRojas());
        return dto;
    }
}
