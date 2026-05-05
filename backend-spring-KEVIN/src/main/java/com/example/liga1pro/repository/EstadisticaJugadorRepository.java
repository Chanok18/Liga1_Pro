package com.example.liga1pro.repository;

import com.example.liga1pro.model.EstadisticaJugador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EstadisticaJugadorRepository extends JpaRepository<EstadisticaJugador, Long> {
    List<EstadisticaJugador> findByPartidoId(Long partidoId);
    List<EstadisticaJugador> findByJugadorId(Long jugadorId);
}
