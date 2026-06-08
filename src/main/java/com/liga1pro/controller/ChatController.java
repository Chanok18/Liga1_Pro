package com.liga1pro.controller;

import com.liga1pro.dto.MensajeChatDTO;
import com.liga1pro.model.GrupoChat;
import com.liga1pro.model.MensajeChat;
import com.liga1pro.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/chat.partido/{partidoId}")
    public void enviarMensajePartido(
            @DestinationVariable Long partidoId,
            MensajeChatDTO mensajeDto) {
        chatService.guardarMensaje(mensajeDto);
        messagingTemplate.convertAndSend("/topic/partido/" + partidoId, mensajeDto);
    }

    @MessageMapping("/chat.grupo/{grupoId}")
    public void enviarMensajeGrupo(
            @DestinationVariable Long grupoId,
            MensajeChatDTO mensajeDto) {
        chatService.guardarMensaje(mensajeDto);
        messagingTemplate.convertAndSend("/topic/grupo/" + grupoId, mensajeDto);
    }

    @GetMapping("/partido/{partidoId}")
    public ResponseEntity<List<MensajeChat>> historialPartido(
            @PathVariable Long partidoId) {
        return ResponseEntity.ok(chatService.obtenerMensajesPartido(partidoId));
    }

    @GetMapping("/grupo/{grupoChatId}")
    public ResponseEntity<List<MensajeChat>> historialGrupo(
            @PathVariable Long grupoChatId) {
        return ResponseEntity.ok(chatService.obtenerMensajesGrupo(grupoChatId));
    }

    @GetMapping("/grupos")
    public ResponseEntity<List<GrupoChat>> obtenerGrupos() {
        return ResponseEntity.ok(chatService.obtenerGrupos());
    }
}