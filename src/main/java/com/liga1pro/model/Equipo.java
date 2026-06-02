package com.liga1pro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "equipos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 100)
    private String ciudad;

    @Column(name = "escudo_url", length = 255)
    private String escudo;

    @Column(length = 100)
    private String estadio;

    @Column(name = "anio_fundacion")
    private Integer fundacion;

    @Column(length = 100)
    private String entrenador;
}
