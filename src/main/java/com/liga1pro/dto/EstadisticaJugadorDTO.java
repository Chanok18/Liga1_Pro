package com.liga1pro.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticaJugadorDTO {
    private Long jugadorId;
    private String nombreCompleto;
    private String equipo;
    private String posicion;
    private int goles;
    private int asistencias;
    private int amarillas;
    private int rojas;
    private int minutosJugados;
    private int partidosJugados;
}
