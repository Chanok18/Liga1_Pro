package com.liga1pro.controller;

import com.liga1pro.model.Equipo;
import com.liga1pro.model.MensajeChat;
import com.liga1pro.model.Rol;
import com.liga1pro.model.TipoChat;
import com.liga1pro.model.Usuario;
import com.liga1pro.repository.EquipoRepository;
import com.liga1pro.repository.MensajeChatRepository;
import com.liga1pro.repository.UsuarioRepository;
import com.liga1pro.service.EquipoFavoritoService;
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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final UsuarioRepository usuarioRepository;
    private final EquipoRepository equipoRepository;
    private final MensajeChatRepository mensajeChatRepository;
    private final EquipoFavoritoService equipoFavoritoService;
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

    @PatchMapping("/usuarios/{usuarioId}/favorito")
    public ResponseEntity<?> cambiarFavorito(@PathVariable Long usuarioId, @RequestBody Map<String, Long> body, Principal principal) {
        if (!isAdmin(principal)) {
            return forbidden();
        }

        Long equipoId = body.get("equipoId");
        if (equipoId == null) {
            return ResponseEntity.badRequest().body("equipoId es requerido");
        }

        Equipo equipo = equipoFavoritoService.marcarFavorito(usuarioId, equipoId);
        return ResponseEntity.ok(equipo);
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
        long mensajesEquipo = mensajeChatRepository.countByTipo(TipoChat.EQUIPO);
        long mensajesPartido = mensajeChatRepository.countByTipo(TipoChat.PARTIDO);

        return ResponseEntity.ok(Map.of(
                "usuariosRegistrados", usuariosRegistrados,
                "usuariosActivos", usuariosActivos,
                "usuariosEnLinea", usuariosEnLinea,
                "mensajesEquipo", mensajesEquipo,
                "mensajesPartido", mensajesPartido,
                "mensajesTotales", mensajesEquipo + mensajesPartido + mensajeChatRepository.countByTipo(TipoChat.GRUPO)
        ));
    }

    @GetMapping("/chats/equipos")
    public ResponseEntity<?> chatsEquipo(Principal principal) {
        if (!isAdmin(principal)) {
            return forbidden();
        }

        List<Map<String, Object>> payload = equipoRepository.findAll().stream()
                .sorted(Comparator.comparing(Equipo::getNombre, String.CASE_INSENSITIVE_ORDER))
                .map(equipo -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("equipo", equipo);
                    item.put("mensajes", mensajeChatRepository.countByTipoAndEquipoId(TipoChat.EQUIPO, equipo.getId()));
                    return item;
                })
                .toList();
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/chats/equipos/{equipoId}/mensajes")
    public ResponseEntity<?> historialEquipo(@PathVariable Long equipoId, Principal principal) {
        if (!isAdmin(principal)) {
            return forbidden();
        }
        return ResponseEntity.ok(mensajeChatRepository.findByEquipoIdAndTipoOrderByTimestampAsc(equipoId, TipoChat.EQUIPO));
    }

    @GetMapping("/chats/partidos")
    public ResponseEntity<?> chatsPartido(Principal principal) {
        if (!isAdmin(principal)) {
            return forbidden();
        }

        Map<Long, List<MensajeChat>> grouped = mensajeChatRepository.findByPartidoChatIdIsNotNullOrderByTimestampDesc()
                .stream()
                .collect(Collectors.groupingBy(MensajeChat::getPartidoChatId, LinkedHashMap::new, Collectors.toList()));

        List<Map<String, Object>> payload = grouped.entrySet().stream()
                .map(entry -> {
                    MensajeChat sample = entry.getValue().get(0);
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("partidoId", entry.getKey());
                    item.put("partido", sample.getPartido());
                    item.put("mensajes", entry.getValue().size());
                    item.put("ultimoMensaje", sample.getTimestamp());
                    return item;
                })
                .toList();
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/chats/partidos/{partidoId}/mensajes")
    public ResponseEntity<?> historialPartido(@PathVariable Long partidoId, Principal principal) {
        if (!isAdmin(principal)) {
            return forbidden();
        }
        return ResponseEntity.ok(mensajeChatRepository.findByPartidoChatIdOrderByTimestampAsc(partidoId));
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
