package com.liga1pro.repository;

import com.liga1pro.model.EstadisticaJugador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EstadisticaJugadorRepository extends JpaRepository<EstadisticaJugador, Long> {

    List<EstadisticaJugador> findByJugadorId(Long jugadorId);

    List<EstadisticaJugador> findByPartidoId(Long partidoId);

    // Top goleadores
    @Query("SELECT e.jugador, SUM(e.goles) as totalGoles " +
            "FROM EstadisticaJugador e " +
            "GROUP BY e.jugador " +
            "ORDER BY totalGoles DESC")
    List<Object[]> findTopGoleadores();

    // Estadísticas totales por jugador
    @Query("SELECT SUM(e.goles), SUM(e.asistencias), " +
            "SUM(e.amarillas), SUM(e.rojas), SUM(e.minutosJugados) " +
            "FROM EstadisticaJugador e WHERE e.jugador.id = :jugadorId")
    Object[] findResumenByJugadorId(@Param("jugadorId") Long jugadorId);
}
