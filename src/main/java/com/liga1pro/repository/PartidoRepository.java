package com.liga1pro.repository;

import com.liga1pro.model.EstadoPartido;
import com.liga1pro.model.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartidoRepository extends JpaRepository<Partido, Long> {
    
    // Buscar partidos por jornada
    List<Partido> findByJornada(Integer jornada);
    
    // Buscar partidos por estado (PROGRAMADO, EN_VIVO, FINALIZADO)
    List<Partido> findByEstado(EstadoPartido estado);
    
    // Buscar todos los partidos de un equipo (ya sea de local o visitante)
    List<Partido> findByEquipoLocalIdOrEquipoVisitanteId(Long equipoLocalId, Long equipoVisitanteId);
}
