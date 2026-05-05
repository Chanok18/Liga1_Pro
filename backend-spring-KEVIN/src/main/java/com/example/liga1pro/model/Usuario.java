package com.example.liga1pro.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {
    public enum Rol {
        USER,
        ADMIN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "nombre_completo")
    private String nombreCompleto;

    @Column(name = "activo")
    private Boolean activo = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol")
    private Rol rol = Rol.USER;

    @ManyToOne
    @JoinColumn(name = "equipo_favorito_id")
    private Equipo equipoFavorito;

    public Usuario() {
    }

    public Usuario(Long id, String username, String email, String password, String nombreCompleto, Boolean activo, Rol rol, Equipo equipoFavorito) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.nombreCompleto = nombreCompleto;
        this.activo = activo;
        this.rol = rol;
        this.equipoFavorito = equipoFavorito;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Equipo getEquipoFavorito() {
        return equipoFavorito;
    }

    public void setEquipoFavorito(Equipo equipoFavorito) {
        this.equipoFavorito = equipoFavorito;
    }
}
