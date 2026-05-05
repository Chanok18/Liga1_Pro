package com.example.liga1pro.controller;

import com.example.liga1pro.dto.EstadisticaJugadorDTO;
import com.example.liga1pro.service.EstadisticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticaController {
    
    @Autowired
    private EstadisticaService estadisticaService;
    
    @GetMapping("/partido/{partidoId}")
    public ResponseEntity<List<EstadisticaJugadorDTO>> obtenerEstadisticasPorPartido(@PathVariable Long partidoId) {
        return ResponseEntity.ok(estadisticaService.obtenerEstadisticasPorPartido(partidoId));
    }
    
    @GetMapping("/jugador/{jugadorId}")
    public ResponseEntity<List<EstadisticaJugadorDTO>> obtenerEstadisticasPorJugador(@PathVariable Long jugadorId) {
        return ResponseEntity.ok(estadisticaService.obtenerEstadisticasPorJugador(jugadorId));
    }
}
