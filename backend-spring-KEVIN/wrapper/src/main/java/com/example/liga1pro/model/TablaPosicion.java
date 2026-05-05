package com.example.liga1pro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tabla_posiciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TablaPosicion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "equipo_id", unique = true)
    private Equipo equipo;

    private Integer puntos = 0;
    private Integer partidosJugados = 0;
    private Integer partidosGanados = 0;
    private Integer partidosEmpatados = 0;
    private Integer partidosPerdidos = 0;
    private Integer golesFavor = 0;
    private Integer golesContra = 0;
    private Integer diferenciaGoles = 0;
}
