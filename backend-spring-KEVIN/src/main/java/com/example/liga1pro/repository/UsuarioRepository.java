package com.example.liga1pro.repository;

import com.example.liga1pro.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByEmail(String email);
    Optional<Usuario> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Optional<Usuario> findFirstByOrderByIdAsc();
    List<Usuario> findByEquipoFavoritoIsNotNull();
}
