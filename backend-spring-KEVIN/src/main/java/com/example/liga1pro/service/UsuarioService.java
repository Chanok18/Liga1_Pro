package com.example.liga1pro.service;

import com.example.liga1pro.model.Equipo;
import com.example.liga1pro.model.Usuario;
import com.example.liga1pro.repository.EquipoRepository;
import com.example.liga1pro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EquipoRepository equipoRepository;
    
    public Usuario obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
    
    public Usuario crearUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario obtenerUsuarioPorIdConFallback(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario != null) {
            return usuario;
        }
        return usuarioRepository.findFirstByOrderByIdAsc().orElse(null);
    }

    public Usuario setEquipoFavorito(Long usuarioId, Long equipoId) {
        Usuario usuario = obtenerUsuarioPorIdConFallback(usuarioId);
        if (usuario == null) {
            return null;
        }

        Equipo equipo = equipoRepository.findById(equipoId).orElse(null);
        if (equipo == null) {
            return null;
        }

        usuario.setEquipoFavorito(equipo);
        return usuarioRepository.save(usuario);
    }

    public Usuario registrarUsuario(String nombreCompleto, String email, String username, String password) {
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            throw new IllegalArgumentException("Email y password son obligatorios");
        }

        String emailNormalizado = email.trim().toLowerCase(Locale.ROOT);
        String usernameNormalizado = (username == null || username.isBlank())
                ? emailNormalizado.split("@")[0]
                : username.trim().toLowerCase(Locale.ROOT);

        if (usuarioRepository.existsByEmail(emailNormalizado)) {
            throw new IllegalArgumentException("El email ya esta registrado");
        }

        if (usuarioRepository.existsByUsername(usernameNormalizado)) {
            usernameNormalizado = usernameNormalizado + "_" + System.currentTimeMillis();
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(emailNormalizado);
        usuario.setUsername(usernameNormalizado);
        usuario.setPassword(password);
        usuario.setNombreCompleto(nombreCompleto);
        usuario.setRol(Usuario.Rol.USER);
        usuario.setActivo(true);

        return usuarioRepository.save(usuario);
    }

    public Usuario iniciarSesion(String email, String password) {
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return null;
        }

        Usuario usuario = usuarioRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT));
        if (usuario == null) {
            return null;
        }

        if (!password.equals(usuario.getPassword())) {
            return null;
        }

        return usuario;
    }
}
