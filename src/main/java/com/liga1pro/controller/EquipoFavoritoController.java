package com.liga1pro.controller;

import com.liga1pro.model.Equipo;
import com.liga1pro.service.EquipoFavoritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/favoritos")
@RequiredArgsConstructor
public class EquipoFavoritoController {

    private final EquipoFavoritoService equipoFavoritoService;

    @GetMapping("/{usuarioId}")
    public ResponseEntity<?> obtenerFavorito(@PathVariable Long usuarioId) {
        Optional<Equipo> favorito = equipoFavoritoService.obtenerFavorito(usuarioId);
        if (favorito.isPresent()) {
            return ResponseEntity.ok(favorito.get());
        }
        Map<String, Object> payload = new HashMap<>();
        payload.put("equipo", null);
        return ResponseEntity.ok(payload);
    }

    @PostMapping
    public ResponseEntity<?> marcarFavorito(@RequestBody Map<String, Long> body) {
        Long usuarioId = body.get("usuarioId");
        Long equipoId = body.get("equipoId");

        if (usuarioId == null || equipoId == null) {
            return ResponseEntity.badRequest().body("usuarioId y equipoId son requeridos");
        }

        Equipo equipo = equipoFavoritoService.marcarFavorito(usuarioId, equipoId);
        return ResponseEntity.ok(equipo);
    }

    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<?> quitarFavorito(@PathVariable Long usuarioId) {
        equipoFavoritoService.quitarFavorito(usuarioId);
        return ResponseEntity.ok(Map.of("mensaje", "Favorito eliminado"));
    }
}
