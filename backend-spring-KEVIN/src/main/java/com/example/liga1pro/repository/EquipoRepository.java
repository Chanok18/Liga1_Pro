package com.example.liga1pro.repository;

import com.example.liga1pro.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Long> {
    Equipo findByNombre(String nombre);
}
