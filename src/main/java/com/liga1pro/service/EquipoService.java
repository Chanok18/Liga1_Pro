package com.liga1pro.service;

import com.liga1pro.model.Equipo;
import com.liga1pro.repository.EquipoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EquipoService {

    private final EquipoRepository equipoRepository;

    @Transactional(readOnly = true)
    public List<Equipo> listarTodos() {
        return equipoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Equipo buscarPorId(Long id) {
        return equipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con id: " + id));
    }

    public Equipo guardar(Equipo equipo) {
        return equipoRepository.save(equipo);
    }

    public void eliminar(Long id) {
        if (!equipoRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar. Equipo no encontrado con id: " + id);
        }
        equipoRepository.deleteById(id);
    }
}
