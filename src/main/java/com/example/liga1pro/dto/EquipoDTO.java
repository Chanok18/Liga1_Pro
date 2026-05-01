package com.example.liga1pro.dto;

import lombok.Data;

@Data
public class EquipoDTO {
    private Long id;
    private String nombre;
    private String ciudad;
    private String escudo;
    private Integer fundacion;
    private String estadio;
}
