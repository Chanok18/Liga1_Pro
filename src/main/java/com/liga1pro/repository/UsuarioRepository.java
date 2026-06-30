package com.liga1pro.repository;

import com.liga1pro.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByNombre(String nombre);

    Optional<Usuario> findByEmailIgnoreCase(String email);

    Optional<Usuario> findByNombreIgnoreCase(String nombre);

    boolean existsByEmail(String email);

    boolean existsByNombre(String nombre);

    List<Usuario> findTop25ByNombreContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByFechaRegistroDesc(String nombre, String email);

    long countByActivoTrue();

    long countByUltimoAccesoAfterAndActivoTrue(LocalDateTime since);
}
