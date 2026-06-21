package com.liga1pro.dto;

import com.liga1pro.model.TipoChat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MensajeChatDTO {
    private String contenido;
    private Long usuarioId;
    private Long partidoId;
    private Long equipoId;
    private Long grupoChatId;
    private TipoChat tipo;
}
