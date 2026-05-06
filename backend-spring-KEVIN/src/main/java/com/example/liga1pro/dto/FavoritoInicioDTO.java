package com.example.liga1pro.dto;

import java.util.ArrayList;
import java.util.List;

public class FavoritoInicioDTO {
    private String equipo;
    private String descripcion;
    private String aviso;
    private String actualizadoEn;
    private FavoritoAlineacionDTO alineacion;
    private List<FavoritoProximoPartidoDTO> proximosPartidos = new ArrayList<>();

    public String getEquipo() {
        return equipo;
    }

    public void setEquipo(String equipo) {
        this.equipo = equipo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getAviso() {
        return aviso;
    }

    public void setAviso(String aviso) {
        this.aviso = aviso;
    }

    public String getActualizadoEn() {
        return actualizadoEn;
    }

    public void setActualizadoEn(String actualizadoEn) {
        this.actualizadoEn = actualizadoEn;
    }

    public FavoritoAlineacionDTO getAlineacion() {
        return alineacion;
    }

    public void setAlineacion(FavoritoAlineacionDTO alineacion) {
        this.alineacion = alineacion;
    }

    public List<FavoritoProximoPartidoDTO> getProximosPartidos() {
        return proximosPartidos;
    }

    public void setProximosPartidos(List<FavoritoProximoPartidoDTO> proximosPartidos) {
        this.proximosPartidos = proximosPartidos;
    }
}
