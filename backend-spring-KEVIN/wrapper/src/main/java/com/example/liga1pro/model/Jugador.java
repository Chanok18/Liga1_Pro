package com.example.liga1pro.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "jugadores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Jugador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String posicion;
    private Integer numeroCamiseta;
    private String nacionalidad;
    private Integer edad;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipo_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Equipo equipo;
}
