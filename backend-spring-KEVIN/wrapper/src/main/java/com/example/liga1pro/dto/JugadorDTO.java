package com.example.liga1pro.dto;

import lombok.Data;

@Data
public class JugadorDTO {
    private Long id;
    private String nombre;
    private String posicion;
    private Integer numeroCamiseta;
    private String nacionalidad;
    private Integer edad;
    private EquipoDTO equipo;
}
