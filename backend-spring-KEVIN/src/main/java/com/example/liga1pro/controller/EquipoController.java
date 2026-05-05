package com.example.liga1pro.controller;

import com.example.liga1pro.dto.EquipoDTO;
import com.example.liga1pro.service.EquipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {
    
    @Autowired
    private EquipoService equipoService;
    
    @GetMapping
    public ResponseEntity<List<EquipoDTO>> obtenerTodosEquipos() {
        return ResponseEntity.ok(equipoService.obtenerTodosEquipos());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EquipoDTO> obtenerEquipoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(equipoService.obtenerEquipoPorId(id));
    }
    
    @PostMapping
    public ResponseEntity<EquipoDTO> crearEquipo(@RequestBody EquipoDTO equipoDTO) {
        return ResponseEntity.ok(equipoService.crearEquipo(equipoDTO));
    }
}
