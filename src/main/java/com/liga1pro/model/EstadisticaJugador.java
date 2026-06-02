package com.liga1pro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estadisticas_jugadores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadisticaJugador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "jugador_id", nullable = false)
    private Jugador jugador;

    @ManyToOne
    @JoinColumn(name = "partido_id", nullable = false)
    private Partido partido;

    private int goles;
    private int asistencias;
    private int amarillas;
    private int rojas;
    private int minutosJugados;
    private boolean titular;
}
