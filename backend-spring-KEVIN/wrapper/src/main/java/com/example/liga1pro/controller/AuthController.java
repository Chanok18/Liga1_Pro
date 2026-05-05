package com.example.liga1pro.controller;

import com.example.liga1pro.model.Usuario;
import com.example.liga1pro.security.JwtUtils;
import com.example.liga1pro.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {
        Usuario nuevo = usuarioService.registrar(usuario);
        return ResponseEntity.ok(Map.of(
                "mensaje", "Usuario registrado exitosamente",
                "username", nuevo.getUsername()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        credentials.get("username"),
                        credentials.get("password")
                )
        );
        String token = jwtUtils.generateToken(auth.getName());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", auth.getName(),
                "tipo", "Bearer"
        ));
    }
}
