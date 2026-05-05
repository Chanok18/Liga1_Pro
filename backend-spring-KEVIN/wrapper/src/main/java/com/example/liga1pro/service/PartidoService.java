package com.example.liga1pro.service;

import com.example.liga1pro.model.Partido;
import com.example.liga1pro.model.Partido.EstadoPartido;
import com.example.liga1pro.repository.PartidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PartidoService {

    private final PartidoRepository partidoRepository;

    public List<Partido> listarTodos() {
        return partidoRepository.findAll();
    }

    public List<Partido> listarPorEstado(EstadoPartido estado) {
        return partidoRepository.findByEstado(estado);
    }

    public Partido buscarPorId(Long id) {
        return partidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado con id: " + id));
    }

    public Partido guardar(Partido partido) {
        return partidoRepository.save(partido);
    }

    public Partido actualizarEstado(Long id, EstadoPartido nuevoEstado) {
        Partido partido = buscarPorId(id);
        partido.setEstado(nuevoEstado);
        return partidoRepository.save(partido);
    }

    public Partido actualizarMarcador(Long id, Integer golesLocal, Integer golesVisitante) {
        Partido partido = buscarPorId(id);
        partido.setGolesLocal(golesLocal);
        partido.setGolesVisitante(golesVisitante);
        return partidoRepository.save(partido);
    }

    public void eliminar(Long id) {
        partidoRepository.deleteById(id);
    }
}
