package com.example.liga1pro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "equipos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private String ciudad;
    private String escudo;
    private Integer fundacion;
    private String estadio;
}
