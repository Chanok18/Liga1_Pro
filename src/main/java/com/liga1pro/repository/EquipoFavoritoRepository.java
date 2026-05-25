package com.liga1pro.repository;

import com.liga1pro.model.EquipoFavorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipoFavoritoRepository extends JpaRepository<EquipoFavorito, Long> {
    
    // Buscar equipos favoritos por el ID del usuario
    List<EquipoFavorito> findByUsuarioId(Long usuarioId);
    
    // Buscar si existe una relación específica entre usuario y equipo
    Optional<EquipoFavorito> findByUsuarioIdAndEquipoId(Long usuarioId, Long equipoId);
    
    // Verificar si un equipo ya está marcado como favorito por el usuario
    boolean existsByUsuarioIdAndEquipoId(Long usuarioId, Long equipoId);
}
