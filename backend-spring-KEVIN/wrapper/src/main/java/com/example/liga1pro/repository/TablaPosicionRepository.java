package com.example.liga1pro.repository;

import com.example.liga1pro.model.TablaPosicion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TablaPosicionRepository extends JpaRepository<TablaPosicion, Long> {
    Optional<TablaPosicion> findByEquipoId(Long equipoId);
    List<TablaPosicion> findAllByOrderByPuntosDescDiferenciaGolesDesc();
}
