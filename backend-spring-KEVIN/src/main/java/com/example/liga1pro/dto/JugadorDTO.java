package com.example.liga1pro.dto;

public class JugadorDTO {
    private Long id;
    private String nombre;
    private Integer numeroCamiseta;
    private String posicion;
    private String fotoUrl;
    private Long equipoId;

    public JugadorDTO() {
    }

    public JugadorDTO(Long id, String nombre, Integer numeroCamiseta, String posicion, String fotoUrl, Long equipoId) {
        this.id = id;
        this.nombre = nombre;
        this.numeroCamiseta = numeroCamiseta;
        this.posicion = posicion;
        this.fotoUrl = fotoUrl;
        this.equipoId = equipoId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getNumeroCamiseta() {
        return numeroCamiseta;
    }

    public void setNumeroCamiseta(Integer numeroCamiseta) {
        this.numeroCamiseta = numeroCamiseta;
    }

    public String getPosicion() {
        return posicion;
    }

    public void setPosicion(String posicion) {
        this.posicion = posicion;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public Long getEquipoId() {
        return equipoId;
    }

    public void setEquipoId(Long equipoId) {
        this.equipoId = equipoId;
    }
}
