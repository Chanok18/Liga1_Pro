package com.example.liga1pro.dto;

import lombok.Data;
import java.util.List;

@Data
public class EquipoFavoritoDTO {
    private EquipoDTO equipo;
    private TablaPosicionDTO posicionActual;
    private List<PartidoDTO> proximosPartidos;
    private List<PartidoDTO> ultimosResultados;
    private List<String> alertas;
}