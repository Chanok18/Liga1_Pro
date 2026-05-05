package com.example.liga1pro.controller;

import com.example.liga1pro.dto.JugadorDTO;
import com.example.liga1pro.service.JugadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jugadores")
@CrossOrigin(origins = "*")
public class JugadorController {
    
    @Autowired
    private JugadorService jugadorService;
    
    @GetMapping("/equipo/{equipoId}")
    public ResponseEntity<List<JugadorDTO>> obtenerJugadoresPorEquipo(@PathVariable Long equipoId) {
        return ResponseEntity.ok(jugadorService.obtenerJugadoresPorEquipo(equipoId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<JugadorDTO> obtenerJugadorPorId(@PathVariable Long id) {
        return ResponseEntity.ok(jugadorService.obtenerJugadorPorId(id));
    }
}
