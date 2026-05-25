package com.liga1pro.repository;

import com.liga1pro.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Long> {
    
    // Buscar equipos por ciudad (ignora mayúsculas/minúsculas)
    List<Equipo> findByCiudadIgnoreCase(String ciudad);
    
    // Buscar equipos por nombre (búsqueda exacta)
    Equipo findByNombre(String nombre);
    
    // Buscar equipos por nombre (búsqueda parcial)
    List<Equipo> findByNombreContainingIgnoreCase(String nombre);
}
