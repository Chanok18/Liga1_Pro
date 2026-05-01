package com.example.liga1pro.dto;

import lombok.Data;

@Data
public class TablaPosicionDTO {
    private Long id;
    private EquipoDTO equipo;
    private Integer puntos;
    private Integer partidosJugados;
    private Integer partidosGanados;
    private Integer partidosEmpatados;
    private Integer partidosPerdidos;
    private Integer golesFavor;
    private Integer golesContra;
    private Integer diferenciaGoles;
}
