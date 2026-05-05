package com.example.liga1pro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estadisticas_jugadores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticaJugador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "jugador_id", unique = true)
    private Jugador jugador;

    private Integer partidosJugados = 0;
    private Integer goles = 0;
    private Integer asistencias = 0;
    private Integer tarjetasAmarillas = 0;
    private Integer tarjetasRojas = 0;
    private Double minutosJugados = 0.0;
}