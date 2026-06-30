package com.liga1pro.controller;

import com.liga1pro.model.Usuario;
import com.liga1pro.model.Rol;
import com.liga1pro.repository.UsuarioRepository;
import com.liga1pro.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Map<String, String> datos) {
        String nombre = datos.get("nombre");
        String email = datos.get("email");
        String password = datos.get("password");

        if (nombre == null || nombre.isBlank() || email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body("Nombre de usuario, email y password son requeridos");
        }
        nombre = nombre.trim();
        email = email.trim().toLowerCase();
        if (usuarioRepository.findByNombre(nombre).isPresent()) {
            return ResponseEntity.badRequest().body("Nombre de usuario ya registrado");
        }
        if (usuarioRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email ya registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(password));
        usuario.setRol(Rol.USER);
        usuario.setActivo(true);
        usuario.setFechaRegistro(LocalDateTime.now());
        usuarioRepository.save(usuario);

        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado exitosamente");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String identifier = credentials.get("identifier");
        if (identifier == null || identifier.isBlank()) {
            identifier = credentials.get("email");
        }
        String password = credentials.get("password");

        if (identifier == null || identifier.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body("Correo o nombre de usuario y password son requeridos");
        }

        String normalizedIdentifier = identifier.trim();

        return findByIdentifier(normalizedIdentifier)
                .filter(u -> !Boolean.FALSE.equals(u.getActivo()))
                .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .map(u -> {
                    u.setUltimoAcceso(LocalDateTime.now());
                    usuarioRepository.save(u);
                    return ResponseEntity.ok(Map.of("token", jwtUtil.generateToken(u.getEmail(), u.getId())));
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    private java.util.Optional<Usuario> findByIdentifier(String identifier) {
        if (identifier.contains("@")) {
            return usuarioRepository.findByEmailIgnoreCase(identifier.toLowerCase());
        }
        return usuarioRepository.findByNombreIgnoreCase(identifier);
    }

    @GetMapping("/me")
    public ResponseEntity<Usuario> obtenerMiUsuario(
            @RequestHeader(name = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = jwtUtil.extractEmail(token);
        return usuarioRepository.findByEmail(email)
                .filter(u -> !Boolean.FALSE.equals(u.getActivo()))
                .map(u -> {
                    u.setUltimoAcceso(LocalDateTime.now());
                    return usuarioRepository.save(u);
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
