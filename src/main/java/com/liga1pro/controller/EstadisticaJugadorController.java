package com.liga1pro.controller;

import com.liga1pro.dto.EstadisticaJugadorDTO;
import com.liga1pro.model.EstadisticaJugador;
import com.liga1pro.service.EstadisticaJugadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EstadisticaJugadorController {

    private final EstadisticaJugadorService estadisticaService;

    @PostMapping
    public ResponseEntity<EstadisticaJugador> guardar(
            @RequestBody EstadisticaJugador estadistica) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(estadisticaService.guardar(estadistica));
    }

    @GetMapping("/jugador/{jugadorId}")
    public ResponseEntity<EstadisticaJugadorDTO> getResumenJugador(
            @PathVariable Long jugadorId) {
        return ResponseEntity.ok(estadisticaService.obtenerResumenJugador(jugadorId));
    }

    @GetMapping("/partido/{partidoId}")
    public ResponseEntity<List<EstadisticaJugador>> getPorPartido(
            @PathVariable Long partidoId) {
        return ResponseEntity.ok(estadisticaService.obtenerPorPartido(partidoId));
    }

    @GetMapping("/goleadores")
    public ResponseEntity<List<Object[]>> getTopGoleadores() {
        return ResponseEntity.ok(estadisticaService.topGoleadores());
    }
}
