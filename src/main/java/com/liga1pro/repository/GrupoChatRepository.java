package com.liga1pro.repository;

import com.liga1pro.model.GrupoChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GrupoChatRepository extends JpaRepository<GrupoChat, Long> {
}
