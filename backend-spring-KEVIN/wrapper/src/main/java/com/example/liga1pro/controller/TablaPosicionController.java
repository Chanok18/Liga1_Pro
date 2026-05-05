package com.example.liga1pro.controller;

import com.example.liga1pro.model.TablaPosicion;
import com.example.liga1pro.service.TablaPosicionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tabla")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TablaPosicionController {

    private final TablaPosicionService tablaPosicionService;

    @GetMapping
    public List<TablaPosicion> obtenerTabla() {
        return tablaPosicionService.obtenerTabla();
    }

    @PostMapping("/recalcular")
    public ResponseEntity<?> recalcular() {
        tablaPosicionService.recalcularTabla();
        return ResponseEntity.ok("Tabla recalculada correctamente");
    }
}
