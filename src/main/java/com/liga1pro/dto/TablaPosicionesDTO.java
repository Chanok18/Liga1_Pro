package com.liga1pro.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TablaPosicionesDTO {
    private int posicion;
    private String equipo;
    private int pj; // partidos jugados
    private int pg; // partidos ganados
    private int pe; // partidos empatados
    private int pp; // partidos perdidos
    private int gf; // goles favor
    private int gc; // goles contra
    private int dg; // diferencia de goles
    private int pts; // puntos
}