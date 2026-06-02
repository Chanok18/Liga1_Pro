package com.liga1pro.controller;

import com.liga1pro.model.Jugador;
import com.liga1pro.service.JugadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jugadores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JugadorController {

    private final JugadorService jugadorService;

    @GetMapping
    public ResponseEntity<List<Jugador>> listarTodos() {
        return ResponseEntity.ok(jugadorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Jugador> buscarPorId(@PathVariable Long id) {
        try {
            Jugador jugador = jugadorService.buscarPorId(id);
            return ResponseEntity.ok(jugador);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/equipo/{equipoId}")
    public ResponseEntity<List<Jugador>> listarPorEquipo(@PathVariable Long equipoId) {
        return ResponseEntity.ok(jugadorService.listarPorEquipo(equipoId));
    }

    @PostMapping
    public ResponseEntity<Jugador> crear(@RequestBody Jugador jugador) {
        Jugador nuevo = jugadorService.guardar(jugador);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Jugador> actualizar(@PathVariable Long id, @RequestBody Jugador jugador) {
        try {
            Jugador existente = jugadorService.buscarPorId(id);
            existente.setNombre(jugador.getNombre());
            existente.setApellido(jugador.getApellido());
            existente.setPosicion(jugador.getPosicion());
            existente.setNumeroCamiseta(jugador.getNumeroCamiseta());
            existente.setNacionalidad(jugador.getNacionalidad());
            existente.setEdad(jugador.getEdad());
            existente.setFoto(jugador.getFoto());
            existente.setEquipo(jugador.getEquipo());

            Jugador actualizado = jugadorService.guardar(existente);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            jugadorService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
