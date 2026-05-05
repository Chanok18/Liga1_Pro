package com.example.liga1pro.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.FetchType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "partidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Partido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipo_local_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Equipo equipoLocal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipo_visitante_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Equipo equipoVisitante;

    private LocalDateTime fechaHora;
    private Integer golesLocal;
    private Integer golesVisitante;

    @Enumerated(EnumType.STRING)
    private EstadoPartido estado;

    private String estadio;

    public enum EstadoPartido {
        PROGRAMADO, EN_VIVO, FINALIZADO, SUSPENDIDO
    }
}
