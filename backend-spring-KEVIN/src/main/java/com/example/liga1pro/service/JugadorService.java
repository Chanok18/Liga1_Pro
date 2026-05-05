package com.example.liga1pro.service;

import com.example.liga1pro.dto.JugadorDTO;
import com.example.liga1pro.model.Jugador;
import com.example.liga1pro.repository.JugadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JugadorService {
    
    @Autowired
    private JugadorRepository jugadorRepository;
    
    public List<JugadorDTO> obtenerJugadoresPorEquipo(Long equipoId) {
        return jugadorRepository.findByEquipoId(equipoId)
            .stream()
            .map(this::convertirJugadorDTO)
            .collect(Collectors.toList());
    }
    
    public JugadorDTO obtenerJugadorPorId(Long id) {
        Jugador jugador = jugadorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));
        return convertirJugadorDTO(jugador);
    }
    
    private JugadorDTO convertirJugadorDTO(Jugador jugador) {
        JugadorDTO dto = new JugadorDTO();
        dto.setId(jugador.getId());
        dto.setNombre(jugador.getNombre());
        dto.setNumeroCamiseta(jugador.getNumeroCamiseta());
        dto.setPosicion(jugador.getPosicion());
        dto.setFotoUrl(jugador.getFotoUrl());
        dto.setEquipoId(jugador.getEquipo().getId());
        return dto;
    }
}
