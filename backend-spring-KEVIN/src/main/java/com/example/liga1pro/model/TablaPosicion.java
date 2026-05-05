package com.example.liga1pro.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tabla_posiciones")
public class TablaPosicion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;

    @Column(name = "posicion")
    private Integer posicion;

    @Column(name = "partidos_jugados")
    private Integer partidosJugados;

    @Column(name = "partidos_ganados")
    private Integer partidosGanados;

    @Column(name = "partidos_empatados")
    private Integer partidosEmpatados;

    @Column(name = "partidos_perdidos")
    private Integer partidosPerdidos;

    @Column(name = "goles_favor")
    private Integer golesFavor;

    @Column(name = "goles_contra")
    private Integer golesContra;

    @Column(name = "diferencia_goles")
    private Integer diferenciaGoles;

    @Column(name = "puntos")
    private Integer puntos;

    public TablaPosicion() {
    }

    public TablaPosicion(Long id, Equipo equipo, Integer posicion, Integer partidosJugados, Integer partidosGanados, Integer partidosEmpatados, Integer partidosPerdidos, Integer golesFavor, Integer golesContra, Integer diferenciaGoles, Integer puntos) {
        this.id = id;
        this.equipo = equipo;
        this.posicion = posicion;
        this.partidosJugados = partidosJugados;
        this.partidosGanados = partidosGanados;
        this.partidosEmpatados = partidosEmpatados;
        this.partidosPerdidos = partidosPerdidos;
        this.golesFavor = golesFavor;
        this.golesContra = golesContra;
        this.diferenciaGoles = diferenciaGoles;
        this.puntos = puntos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Equipo getEquipo() {
        return equipo;
    }

    public void setEquipo(Equipo equipo) {
        this.equipo = equipo;
    }

    public Integer getPosicion() {
        return posicion;
    }

    public void setPosicion(Integer posicion) {
        this.posicion = posicion;
    }

    public Integer getPartidosJugados() {
        return partidosJugados;
    }

    public void setPartidosJugados(Integer partidosJugados) {
        this.partidosJugados = partidosJugados;
    }

    public Integer getPartidosGanados() {
        return partidosGanados;
    }

    public void setPartidosGanados(Integer partidosGanados) {
        this.partidosGanados = partidosGanados;
    }

    public Integer getPartidosEmpatados() {
        return partidosEmpatados;
    }

    public void setPartidosEmpatados(Integer partidosEmpatados) {
        this.partidosEmpatados = partidosEmpatados;
    }

    public Integer getPartidosPerdidos() {
        return partidosPerdidos;
    }

    public void setPartidosPerdidos(Integer partidosPerdidos) {
        this.partidosPerdidos = partidosPerdidos;
    }

    public Integer getGolesFavor() {
        return golesFavor;
    }

    public void setGolesFavor(Integer golesFavor) {
        this.golesFavor = golesFavor;
    }

    public Integer getGolesContra() {
        return golesContra;
    }

    public void setGolesContra(Integer golesContra) {
        this.golesContra = golesContra;
    }

    public Integer getDiferenciaGoles() {
        return diferenciaGoles;
    }

    public void setDiferenciaGoles(Integer diferenciaGoles) {
        this.diferenciaGoles = diferenciaGoles;
    }

    public Integer getPuntos() {
        return puntos;
    }

    public void setPuntos(Integer puntos) {
        this.puntos = puntos;
    }
}
