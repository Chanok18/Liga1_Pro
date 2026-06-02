package com.liga1pro.repository;

import com.liga1pro.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Buscar usuario por email (para login / seguridad)
    Optional<Usuario> findByEmail(String email);
    
    // Verificar si existe un usuario registrado con ese email
    boolean existsByEmail(String email);
}
