package com.example.liga1pro.repository;

import com.example.liga1pro.model.EstadisticaJugador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EstadisticaJugadorRepository extends JpaRepository<EstadisticaJugador, Long> {
    Optional<EstadisticaJugador> findByJugadorId(Long jugadorId);
    List<EstadisticaJugador> findAllByOrderByGolesDesc();
    List<EstadisticaJugador> findAllByOrderByAsistenciasDesc();
}
