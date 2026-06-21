package com.liga1pro.repository;

import com.liga1pro.model.MensajeChat;
import com.liga1pro.model.TipoChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MensajeChatRepository extends JpaRepository<MensajeChat, Long> {
    List<MensajeChat> findByPartidoIdOrderByTimestampAsc(Long partidoId);
    List<MensajeChat> findByPartidoChatIdOrderByTimestampAsc(Long partidoChatId);
    List<MensajeChat> findByGrupoChatIdOrderByTimestampAsc(Long grupoChatId);
    List<MensajeChat> findByEquipoIdAndTipoOrderByTimestampAsc(Long equipoId, TipoChat tipo);
    List<MensajeChat> findByEquipoIdAndTipoAndTimestampAfterOrderByTimestampAsc(Long equipoId, TipoChat tipo, LocalDateTime timestamp);
    List<MensajeChat> findByTipoOrderByTimestampDesc(TipoChat tipo);
    List<MensajeChat> findByPartidoChatIdIsNotNullOrderByTimestampDesc();

    long countByTipo(TipoChat tipo);

    long countByTipoAndEquipoId(TipoChat tipo, Long equipoId);

    long countByPartidoChatId(Long partidoChatId);
}
