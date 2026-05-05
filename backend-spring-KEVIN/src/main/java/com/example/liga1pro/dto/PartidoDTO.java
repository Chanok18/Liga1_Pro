package com.example.liga1pro.dto;

import java.time.LocalDateTime;

public class PartidoDTO {
    private Long id;
    private EquipoDTO equipoLocal;
    private EquipoDTO equipoVisitante;
    private Integer golesLocal;
    private Integer golesVisitante;
    private LocalDateTime fechaHora;
    private String estado;
    private Integer minuto;
    private String estadio;
    private Integer jornada;

    public PartidoDTO() {
    }

    public PartidoDTO(Long id, EquipoDTO equipoLocal, EquipoDTO equipoVisitante, Integer golesLocal, Integer golesVisitante, LocalDateTime fechaHora, String estado, Integer minuto, String estadio, Integer jornada) {
        this.id = id;
        this.equipoLocal = equipoLocal;
        this.equipoVisitante = equipoVisitante;
        this.golesLocal = golesLocal;
        this.golesVisitante = golesVisitante;
        this.fechaHora = fechaHora;
        this.estado = estado;
        this.minuto = minuto;
        this.estadio = estadio;
        this.jornada = jornada;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EquipoDTO getEquipoLocal() {
        return equipoLocal;
    }

    public void setEquipoLocal(EquipoDTO equipoLocal) {
        this.equipoLocal = equipoLocal;
    }

    public EquipoDTO getEquipoVisitante() {
        return equipoVisitante;
    }

    public void setEquipoVisitante(EquipoDTO equipoVisitante) {
        this.equipoVisitante = equipoVisitante;
    }

    public Integer getGolesLocal() {
        return golesLocal;
    }

    public void setGolesLocal(Integer golesLocal) {
        this.golesLocal = golesLocal;
    }

    public Integer getGolesVisitante() {
        return golesVisitante;
    }

    public void setGolesVisitante(Integer golesVisitante) {
        this.golesVisitante = golesVisitante;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getMinuto() {
        return minuto;
    }

    public void setMinuto(Integer minuto) {
        this.minuto = minuto;
    }

    public String getEstadio() {
        return estadio;
    }

    public void setEstadio(String estadio) {
        this.estadio = estadio;
    }

    public Integer getJornada() {
        return jornada;
    }

    public void setJornada(Integer jornada) {
        this.jornada = jornada;
    }
}
