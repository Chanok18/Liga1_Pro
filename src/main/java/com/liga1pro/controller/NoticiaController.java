package com.liga1pro.controller;

import com.liga1pro.dto.NoticiaFeedDTO;
import com.liga1pro.service.NoticiasService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/noticias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NoticiaController {

    private final NoticiasService noticiasService;

    @GetMapping
    public NoticiaFeedDTO obtenerNoticias(
            @RequestParam(required = false) String equipo,
            @RequestParam(required = false) String liga) {
        return noticiasService.obtenerNoticias(equipo, liga);
    }
}
