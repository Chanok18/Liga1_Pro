package com.liga1pro.repository;

import com.liga1pro.model.MensajeChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MensajeChatRepository extends JpaRepository<MensajeChat, Long> {
    List<MensajeChat> findByPartidoIdOrderByTimestampAsc(Long partidoId);
    List<MensajeChat> findByGrupoChatIdOrderByTimestampAsc(Long grupoChatId);
}
