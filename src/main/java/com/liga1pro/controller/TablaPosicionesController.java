package com.liga1pro.controller;

import com.liga1pro.dto.TablaPosicionesDTO;
import com.liga1pro.service.TablaPosicionesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tabla")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TablaPosicionesController {

    private final TablaPosicionesService tablaPosicionesService;

    @GetMapping
    public List<TablaPosicionesDTO> getTabla() {
        return tablaPosicionesService.calcularTabla();
    }
}