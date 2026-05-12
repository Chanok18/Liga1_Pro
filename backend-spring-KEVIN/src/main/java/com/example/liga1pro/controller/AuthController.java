package com.example.liga1pro.controller;

import com.example.liga1pro.dto.AuthLoginRequest;
import com.example.liga1pro.dto.AuthRegisterRequest;
import com.example.liga1pro.model.Usuario;
import com.example.liga1pro.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthLoginRequest credentials) {
        Usuario usuario = usuarioService.iniciarSesion(credentials.getIdentifier(), credentials.getPassword());
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Credenciales invalidas"));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Login exitoso",
                "usuarioId", usuario.getId(),
                "email", usuario.getEmail(),
                "username", usuario.getUsername(),
                "nombreCompleto", usuario.getNombreCompleto() == null ? "" : usuario.getNombreCompleto()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRegisterRequest usuario) {
        try {
            Usuario creado = usuarioService.registrarUsuario(
                    usuario.getNombreCompleto(),
                    usuario.getEmail(),
                    usuario.getUsername(),
                    usuario.getPassword()
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Registro exitoso",
                    "usuarioId", creado.getId(),
                    "email", creado.getEmail(),
                    "username", creado.getUsername(),
                    "nombreCompleto", creado.getNombreCompleto() == null ? "" : creado.getNombreCompleto()
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
