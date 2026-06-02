package com.liga1pro.repository;

import com.liga1pro.model.Jugador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JugadorRepository extends JpaRepository<Jugador, Long> {
    
    // Buscar jugadores por el ID del equipo
    List<Jugador> findByEquipoId(Long equipoId);
    
    // Buscar jugadores por posición (ignora mayúsculas/minúsculas)
    List<Jugador> findByPosicionIgnoreCase(String posicion);
    
    // Buscar jugadores por nacionalidad
    List<Jugador> findByNacionalidadIgnoreCase(String nacionalidad);
}
