package com.example.liga1pro.controller;

import com.example.liga1pro.dto.EquipoDTO;
import com.example.liga1pro.dto.FavoritoInicioDTO;
import com.example.liga1pro.model.Usuario;
import com.example.liga1pro.service.FavoritoApiFootballService;
import com.example.liga1pro.service.MapperService;
import com.example.liga1pro.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private MapperService mapperService;

    @Autowired
    private FavoritoApiFootballService favoritoApiFootballService;

    @GetMapping("/{usuarioId}/equipo-favorito")
    public ResponseEntity<?> obtenerEquipoFavorito(@PathVariable Long usuarioId) {
        Usuario usuario = usuarioService.obtenerUsuarioPorIdConFallback(usuarioId);
        if (usuario == null) {
            return ResponseEntity.status(404).body(Map.of("message", "No existe ningun usuario registrado"));
        }
        if (usuario.getEquipoFavorito() == null) {
            return ResponseEntity.noContent().build();
        }

        EquipoDTO equipoDTO = mapperService.convertirEquipoDTO(usuario.getEquipoFavorito());
        return ResponseEntity.ok(equipoDTO);
    }

    @PutMapping("/{usuarioId}/equipo-favorito/{equipoId}")
    public ResponseEntity<?> actualizarEquipoFavorito(@PathVariable Long usuarioId, @PathVariable Long equipoId) {
        Usuario usuario = usuarioService.setEquipoFavorito(usuarioId, equipoId);
        if (usuario == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Usuario o equipo no encontrado"));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Equipo favorito actualizado",
                "usuarioId", usuario.getId(),
                "equipoFavoritoId", usuario.getEquipoFavorito() != null ? usuario.getEquipoFavorito().getId() : null
        ));
    }

    @GetMapping("/{usuarioId}/inicio-favorito")
    public ResponseEntity<?> obtenerInicioFavorito(@PathVariable Long usuarioId) {
        try {
            FavoritoInicioDTO data = favoritoApiFootballService.obtenerContenidoInicio(usuarioId);
            return ResponseEntity.ok(data);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(404).body(Map.of("message", ex.getMessage()));
        } catch (IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
