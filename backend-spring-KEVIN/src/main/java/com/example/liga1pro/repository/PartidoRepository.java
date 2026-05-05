package com.example.liga1pro.repository;

import com.example.liga1pro.model.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PartidoRepository extends JpaRepository<Partido, Long> {
    @Query("SELECT p FROM Partido p WHERE p.estado = 'en_vivo' ORDER BY p.minuto DESC")
    List<Partido> findPartidosEnVivo();
    
    @Query("SELECT p FROM Partido p WHERE p.jornada = :jornada ORDER BY p.fechaHora ASC")
    List<Partido> findByJornada(Integer jornada);
}
