package com.example.liga1pro.controller;

import com.example.liga1pro.model.Jugador;
import com.example.liga1pro.service.JugadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jugadores")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class JugadorController {

    private final JugadorService jugadorService;

    @GetMapping
    public List<Jugador> listar() {
        return jugadorService.listarTodos();
    }

    @GetMapping("/equipo/{equipoId}")
    public List<Jugador> listarPorEquipo(@PathVariable Long equipoId) {
        return jugadorService.listarPorEquipo(equipoId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Jugador> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(jugadorService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Jugador> crear(@RequestBody Jugador jugador) {
        return ResponseEntity.ok(jugadorService.guardar(jugador));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Jugador> actualizar(@PathVariable Long id, @RequestBody Jugador jugador) {
        return ResponseEntity.ok(jugadorService.actualizar(id, jugador));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        jugadorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
