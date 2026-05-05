package com.example.liga1pro.dto;

import lombok.Data;

@Data
public class EstadisticaJugadorDTO {
    private Long jugadorId;
    private String nombreJugador;
    private String posicion;
    private String equipo;
    private Integer partidosJugados;
    private Integer goles;
    private Integer asistencias;
    private Integer tarjetasAmarillas;
    private Integer tarjetasRojas;
    private Double minutosJugados;
}
