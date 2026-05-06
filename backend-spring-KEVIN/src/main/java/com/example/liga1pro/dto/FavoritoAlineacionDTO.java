package com.example.liga1pro.dto;

import java.util.ArrayList;
import java.util.List;

public class FavoritoAlineacionDTO {
    private Long fixtureId;
    private String rival;
    private String fechaHora;
    private String formacion;
    private List<String> titulares = new ArrayList<>();
    private String mensaje;

    public Long getFixtureId() {
        return fixtureId;
    }

    public void setFixtureId(Long fixtureId) {
        this.fixtureId = fixtureId;
    }

    public String getRival() {
        return rival;
    }

    public void setRival(String rival) {
        this.rival = rival;
    }

    public String getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(String fechaHora) {
        this.fechaHora = fechaHora;
    }

    public String getFormacion() {
        return formacion;
    }

    public void setFormacion(String formacion) {
        this.formacion = formacion;
    }

    public List<String> getTitulares() {
        return titulares;
    }

    public void setTitulares(List<String> titulares) {
        this.titulares = titulares;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}

