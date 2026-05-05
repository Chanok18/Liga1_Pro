package com.example.liga1pro.controller;

import com.example.liga1pro.dto.EquipoFavoritoDTO;
import com.example.liga1pro.service.EquipoFavoritoService;
import com.example.liga1pro.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorito")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EquipoFavoritoController {

    private final EquipoFavoritoService equipoFavoritoService;
    private final UsuarioService usuarioService;

    // Obtener contenido personalizado del equipo favorito
    @GetMapping("/{equipoId}")
    public ResponseEntity<EquipoFavoritoDTO> contenidoFavorito(
            @PathVariable Long equipoId) {
        return ResponseEntity.ok(
                equipoFavoritoService.obtenerContenidoFavorito(equipoId));
    }

    // El usuario elige su equipo favorito
    @PutMapping("/usuario/{usuarioId}/equipo/{equipoId}")
    public ResponseEntity<?> elegirFavorito(
            @PathVariable Long usuarioId,
            @PathVariable Long equipoId) {
        usuarioService.setEquipoFavorito(usuarioId, equipoId);
        return ResponseEntity.ok("Equipo favorito actualizado correctamente");
    }
}