package com.example.liga1pro.service;

import com.example.liga1pro.model.Jugador;
import com.example.liga1pro.repository.JugadorRepository;
import com.example.liga1pro.repository.EquipoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JugadorService {

    private final JugadorRepository jugadorRepository;
    private final EquipoRepository equipoRepository;

    public List<Jugador> listarTodos() {
        return jugadorRepository.findAll();
    }

    public List<Jugador> listarPorEquipo(Long equipoId) {
        return jugadorRepository.findByEquipoId(equipoId);
    }

    public Jugador buscarPorId(Long id) {
        return jugadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con id: " + id));
    }

    public Jugador guardar(Jugador jugador) {
        return jugadorRepository.save(jugador);
    }

    public Jugador actualizar(Long id, Jugador jugador) {
        Jugador existente = buscarPorId(id);
        existente.setNombre(jugador.getNombre());
        existente.setPosicion(jugador.getPosicion());
        existente.setNumeroCamiseta(jugador.getNumeroCamiseta());
        existente.setNacionalidad(jugador.getNacionalidad());
        existente.setEdad(jugador.getEdad());
        existente.setEquipo(jugador.getEquipo());
        return jugadorRepository.save(existente);
    }

    public void eliminar(Long id) {
        jugadorRepository.deleteById(id);
    }
}
