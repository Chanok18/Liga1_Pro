package com.liga1pro.service;

import com.liga1pro.model.EstadoPartido;
import com.liga1pro.model.Partido;
import com.liga1pro.repository.PartidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PartidoService {

    private final PartidoRepository partidoRepository;

    @Transactional(readOnly = true)
    public List<Partido> listarTodos() {
        return partidoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Partido buscarPorId(Long id) {
        return partidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado con id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Partido> listarPorJornada(Integer jornada) {
        return partidoRepository.findByJornada(jornada);
    }

    @Transactional(readOnly = true)
    public List<Partido> listarPorEstado(EstadoPartido estado) {
        return partidoRepository.findByEstado(estado);
    }

    public Partido guardar(Partido partido) {
        return partidoRepository.save(partido);
    }

    public void eliminar(Long id) {
        if (!partidoRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar. Partido no encontrado con id: " + id);
        }
        partidoRepository.deleteById(id);
    }
}
