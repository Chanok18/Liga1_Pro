package com.example.liga1pro.controller;

import com.example.liga1pro.dto.TablaPosicionDTO;
import com.example.liga1pro.service.TablaPosicionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tabla-posiciones")
public class TablaPosicionController {
    
    @Autowired
    private TablaPosicionService tablaPosicionService;
    
    @GetMapping
    public ResponseEntity<List<TablaPosicionDTO>> obtenerTablaPosiciones() {
        return ResponseEntity.ok(tablaPosicionService.obtenerTablaPosiciones());
    }
}
