package com.example.liga1pro.service;

import com.example.liga1pro.model.Equipo;
import com.example.liga1pro.model.Usuario;
import com.example.liga1pro.repository.EquipoRepository;
import com.example.liga1pro.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EquipoRepository equipoRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
        return new org.springframework.security.core.userdetails.User(
                usuario.getUsername(), usuario.getPassword(), new ArrayList<>());
    }

    public Usuario registrar(Usuario usuario) {
        if (usuarioRepository.existsByUsername(usuario.getUsername()))
            throw new RuntimeException("Username ya existe");
        if (usuarioRepository.existsByEmail(usuario.getEmail()))
            throw new RuntimeException("Email ya registrado");
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRol(Usuario.Rol.USER);
        return usuarioRepository.save(usuario);
    }
    public Usuario setEquipoFavorito(Long usuarioId, Long equipoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
        usuario.setEquipoFavorito(equipo);
        return usuarioRepository.save(usuario);
    }
}
