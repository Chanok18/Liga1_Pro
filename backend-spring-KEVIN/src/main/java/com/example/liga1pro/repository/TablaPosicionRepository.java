package com.example.liga1pro.repository;

import com.example.liga1pro.model.TablaPosicion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TablaPosicionRepository extends JpaRepository<TablaPosicion, Long> {
    @Query("SELECT tp FROM TablaPosicion tp ORDER BY tp.puntos DESC, tp.diferenciaGoles DESC")
    List<TablaPosicion> findAllOrdenada();
}
