package com.liga1pro.controller;

import com.liga1pro.model.EstadoPartido;
import com.liga1pro.model.Partido;
import com.liga1pro.service.PartidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partidos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PartidoController {

    private final PartidoService partidoService;

    @GetMapping
    public ResponseEntity<List<Partido>> listarTodos() {
        return ResponseEntity.ok(partidoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Partido> buscarPorId(@PathVariable Long id) {
        try {
            Partido partido = partidoService.buscarPorId(id);
            return ResponseEntity.ok(partido);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/jornada/{jornada}")
    public ResponseEntity<List<Partido>> listarPorJornada(@PathVariable Integer jornada) {
        return ResponseEntity.ok(partidoService.listarPorJornada(jornada));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Partido>> listarPorEstado(@PathVariable EstadoPartido estado) {
        return ResponseEntity.ok(partidoService.listarPorEstado(estado));
    }

    @PostMapping
    public ResponseEntity<Partido> crear(@RequestBody Partido partido) {
        Partido nuevo = partidoService.guardar(partido);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Partido> actualizar(@PathVariable Long id, @RequestBody Partido partido) {
        try {
            Partido existente = partidoService.buscarPorId(id);
            existente.setEquipoLocal(partido.getEquipoLocal());
            existente.setEquipoVisitante(partido.getEquipoVisitante());
            existente.setFecha(partido.getFecha());
            existente.setHora(partido.getHora());
            existente.setEstadio(partido.getEstadio());
            existente.setJornada(partido.getJornada());
            existente.setGolesLocal(partido.getGolesLocal());
            existente.setGolesVisitante(partido.getGolesVisitante());
            existente.setEstado(partido.getEstado());

            Partido actualizado = partidoService.guardar(existente);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            partidoService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
