package com.example.liga1pro.repository;

import com.example.liga1pro.model.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PartidoRepository extends JpaRepository<Partido, Long> {
    List<Partido> findByEstado(Partido.EstadoPartido estado);
}
