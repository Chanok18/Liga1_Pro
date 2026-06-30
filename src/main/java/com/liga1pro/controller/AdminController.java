package com.liga1pro.controller;

import com.liga1pro.model.Rol;
import com.liga1pro.model.Usuario;
import com.liga1pro.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/usuarios")
    public ResponseEntity<?> buscarUsuarios(@RequestParam(defaultValue = "") String q, Principal principal) {
        if (!isAdmin(principal)) {
            return forbidden();
        }

        String query = q.trim();
        List<Usuario> usuarios = query.isBlank()
                ? usuarioRepository.findAll().stream()
                        .sorted(Comparator.comparing(Usuario::getFechaRegistro, Comparator.nullsLast(Comparator.reverseOrder())))
                        .limit(25)
                        .toList()
                : usuarioRepository.findTop25ByNombreContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByFechaRegistroDesc(query, query);

        return ResponseEntity.ok(usuarios);
    }

    @PatchMapping("/usuarios/{usuarioId}/password")
    public ResponseEntity<?> cambiarPassword(@PathVariable Long usuarioId, @RequestBody Map<String, String> body, Principal principal) {
        if (!isAdmin(principal)) {
            return forbidden();
        }

        String password = body.get("password");
        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body("password es requerido");
        }

        Usuario usuario = getUsuario(usuarioId);
        usuario.setPassword(passwordEncoder.encode(password));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Map.of("mensaje", "Contrasena actualizada"));
    }

    @PatchMapping("/usuarios/{usuarioId}/rol")
    public ResponseEntity<?> cambiarRol(@PathVariable Long usuarioId, @RequestBody Map<String, String> body, Principal principal) {
        if (!isAdmin(principal)) {
            return forbidden();
        }

        Rol rol = Rol.valueOf(body.getOrDefault("rol", "USER").toUpperCase());
        Usuario usuario = getUsuario(usuarioId);
        usuario.setRol(rol);
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/usuarios/{usuarioId}")
    public ResponseEntity<?> eliminarCuenta(@PathVariable Long usuarioId, Principal principal) {
        if (!isAdmin(principal)) {
            return forbidden();
        }

        Usuario usuario = getUsuario(usuarioId);
        if (isCurrentUser(usuario, principal)) {
            return ResponseEntity.badRequest().body("No puedes eliminar tu propia cuenta desde este panel");
        }

        usuario.setActivo(false);
        usuario.setFechaEliminacion(LocalDateTime.now());
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Map.of("mensaje", "Cuenta desactivada"));
    }

    @GetMapping("/metricas")
    public ResponseEntity<?> metricas(Principal principal) {
        if (!isAdmin(principal)) {
            return forbidden();
        }

        List<Usuario> usuarios = usuarioRepository.findAll();
        LocalDateTime recentWindow = LocalDateTime.now().minusMinutes(15);
        long usuariosRegistrados = usuarios.size();
        long usuariosActivos = usuarios.stream().filter(usuario -> !Boolean.FALSE.equals(usuario.getActivo())).count();
        long usuariosEnLinea = usuarios.stream()
                .filter(usuario -> !Boolean.FALSE.equals(usuario.getActivo()))
                .filter(usuario -> usuario.getUltimoAcceso() != null && usuario.getUltimoAcceso().isAfter(recentWindow))
                .count();

        return ResponseEntity.ok(Map.of(
                "usuariosRegistrados", usuariosRegistrados,
                "usuariosActivos", usuariosActivos,
                "usuariosEnLinea", usuariosEnLinea
        ));
    }

    private Usuario getUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    private boolean isAdmin(Principal principal) {
        if (principal == null) {
            return false;
        }
        return usuarioRepository.findByEmailIgnoreCase(principal.getName())
                .filter(usuario -> !Boolean.FALSE.equals(usuario.getActivo()))
                .map(usuario -> usuario.getRol() == Rol.ADMIN)
                .orElse(false);
    }

    private boolean isCurrentUser(Usuario usuario, Principal principal) {
        return principal != null && Objects.equals(usuario.getEmail(), principal.getName());
    }

    private ResponseEntity<?> forbidden() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Requiere rango ADMIN");
    }
}
