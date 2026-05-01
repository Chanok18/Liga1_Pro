package com.example.liga1pro.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PartidoDTO {
    private Long id;
    private EquipoDTO equipoLocal;
    private EquipoDTO equipoVisitante;
    private LocalDateTime fechaHora;
    private Integer golesLocal;
    private Integer golesVisitante;
    private String estado;
    private String estadio;
}
