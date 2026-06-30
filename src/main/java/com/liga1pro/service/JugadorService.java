package com.liga1pro.service;

import com.liga1pro.model.Jugador;
import com.liga1pro.repository.JugadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class JugadorService {

    private final JugadorRepository jugadorRepository;

    @Transactional(readOnly = true)
    public List<Jugador> listarTodos() {
        return jugadorRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Jugador buscarPorId(Long id) {
        return jugadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Jugador> listarPorEquipo(Long equipoId) {
        return jugadorRepository.findByEquipoId(equipoId);
    }

    public Jugador guardar(Jugador jugador) {
        return jugadorRepository.save(jugador);
    }

    public void eliminar(Long id) {
        if (!jugadorRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar. Jugador no encontrado con id: " + id);
        }
        jugadorRepository.deleteById(id);
    }
}
