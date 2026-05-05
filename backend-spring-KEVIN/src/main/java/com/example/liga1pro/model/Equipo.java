package com.example.liga1pro.model;

import jakarta.persistence.*;

@Entity
@Table(name = "equipos")
public class Equipo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "ciudad")
    private String ciudad;

    @Column(name = "estadio")
    private String estadio;

    public Equipo() {
    }

    public Equipo(Long id, String nombre, String logoUrl, String ciudad, String estadio) {
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
