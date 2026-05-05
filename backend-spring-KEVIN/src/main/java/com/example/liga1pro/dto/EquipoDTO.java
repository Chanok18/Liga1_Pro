package com.example.liga1pro.dto;

public class EquipoDTO {
    private Long id;
    private String nombre;
    private String logoUrl;
    private String ciudad;
    private String estadio;

    public EquipoDTO() {
    }

    public EquipoDTO(Long id, String nombre, String logoUrl, String ciudad, String estadio) {
        this.id = id;
        this.nombre = nombre;
        this.logoUrl = logoUrl;
        this.ciudad = ciudad;
        this.estadio = estadio;
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

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getEstadio() {
        return estadio;
    }

    public void setEstadio(String estadio) {
        this.estadio = estadio;
    }
}
