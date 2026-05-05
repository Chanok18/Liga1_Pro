package com.example.liga1pro.controller;

import com.example.liga1pro.dto.PartidoDTO;
import com.example.liga1pro.service.PartidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/partidos")
public class PartidoController {
    
    @Autowired
    private PartidoService partidoService;
    
    @GetMapping("/en-vivo")
    public ResponseEntity<List<PartidoDTO>> obtenerPartidosEnVivo() {
        return ResponseEntity.ok(partidoService.obtenerPartidosEnVivo());
    }
    
    @GetMapping("/jornada/{jornada}")
    public ResponseEntity<List<PartidoDTO>> obtenerPartidosPorJornada(@PathVariable Integer jornada) {
        return ResponseEntity.ok(partidoService.obtenerPartidosPorJornada(jornada));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PartidoDTO> obtenerPartidoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(partidoService.obtenerPartidoPorId(id));
    }
    
    @PostMapping
    public ResponseEntity<PartidoDTO> crearPartido(@RequestBody PartidoDTO partidoDTO) {
        return ResponseEntity.ok(partidoService.crearPartido(partidoDTO));
    }
}
