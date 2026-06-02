package com.liga1pro.controller;

import com.liga1pro.model.Equipo;
import com.liga1pro.service.EquipoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EquipoController {

    private final EquipoService equipoService;

    @GetMapping
    public ResponseEntity<List<Equipo>> listarTodos() {
        return ResponseEntity.ok(equipoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipo> buscarPorId(@PathVariable Long id) {
        try {
            Equipo equipo = equipoService.buscarPorId(id);
            return ResponseEntity.ok(equipo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Equipo> crear(@RequestBody Equipo equipo) {
        Equipo nuevo = equipoService.guardar(equipo);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipo> actualizar(@PathVariable Long id, @RequestBody Equipo equipo) {
        try {
            Equipo existente = equipoService.buscarPorId(id);
            existente.setNombre(equipo.getNombre());
            existente.setCiudad(equipo.getCiudad());
            existente.setEscudo(equipo.getEscudo());
            existente.setEstadio(equipo.getEstadio());
            existente.setFundacion(equipo.getFundacion());
            existente.setEntrenador(equipo.getEntrenador());

            Equipo actualizado = equipoService.guardar(existente);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            equipoService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
