package com.example.liga1pro.controller;

import com.example.liga1pro.dto.EstadisticaJugadorDTO;
import com.example.liga1pro.model.EstadisticaJugador;
import com.example.liga1pro.service.EstadisticaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EstadisticaController {

    private final EstadisticaService estadisticaService;

    @GetMapping("/jugador/{jugadorId}")
    public ResponseEntity<EstadisticaJugadorDTO> porJugador(@PathVariable Long jugadorId) {
        return ResponseEntity.ok(estadisticaService.obtenerPorJugador(jugadorId));
    }

    @GetMapping("/goleadores")
    public List<EstadisticaJugadorDTO> topGoleadores() {
        return estadisticaService.topGoleadores();
    }

    @GetMapping("/asistentes")
    public List<EstadisticaJugadorDTO> topAsistentes() {
        return estadisticaService.topAsistentes();
    }

    @PostMapping("/jugador/{jugadorId}")
    public ResponseEntity<EstadisticaJugadorDTO> guardar(
            @PathVariable Long jugadorId,
            @RequestBody EstadisticaJugador stats) {
        return ResponseEntity.ok(estadisticaService.guardar(jugadorId, stats));
    }
}
