package com.example.liga1pro.controller;

import com.example.liga1pro.model.Partido;
import com.example.liga1pro.model.Partido.EstadoPartido;
import com.example.liga1pro.service.PartidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/partidos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PartidoController {

    private final PartidoService partidoService;

    @GetMapping
    public List<Partido> listar() {
        return partidoService.listarTodos();
    }

    @GetMapping("/en-vivo")
    public List<Partido> enVivo() {
        return partidoService.listarPorEstado(EstadoPartido.EN_VIVO);
    }

    @GetMapping("/programados")
    public List<Partido> programados() {
        return partidoService.listarPorEstado(EstadoPartido.PROGRAMADO);
    }

    @GetMapping("/resultados")
    public List<Partido> resultados() {
        return partidoService.listarPorEstado(EstadoPartido.FINALIZADO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Partido> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(partidoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Partido> crear(@RequestBody Partido partido) {
        return ResponseEntity.ok(partidoService.guardar(partido));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Partido> actualizarEstado(
            @PathVariable Long id,
            @RequestParam EstadoPartido estado) {
        return ResponseEntity.ok(partidoService.actualizarEstado(id, estado));
    }

    @PatchMapping("/{id}/marcador")
    public ResponseEntity<Partido> actualizarMarcador(
            @PathVariable Long id,
            @RequestParam Integer golesLocal,
            @RequestParam Integer golesVisitante) {
        return ResponseEntity.ok(partidoService.actualizarMarcador(id, golesLocal, golesVisitante));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        partidoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
