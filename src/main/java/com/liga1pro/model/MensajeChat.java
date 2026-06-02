package com.liga1pro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes_chat")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MensajeChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "partido_id", nullable = true)
    private Partido partido;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "grupo_chat_id", nullable = true)
    private GrupoChat grupoChat;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoChat tipo;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
