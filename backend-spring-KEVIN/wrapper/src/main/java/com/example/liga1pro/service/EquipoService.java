package com.example.liga1pro.service;

import com.example.liga1pro.model.Equipo;
import com.example.liga1pro.repository.EquipoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipoService {

    private final EquipoRepository equipoRepository;

    public List<Equipo> listarTodos() {
        return equipoRepository.findAll();
    }

    public Equipo buscarPorId(Long id) {
        return equipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con id: " + id));
    }

    public Equipo guardar(Equipo equipo) {
        return equipoRepository.save(equipo);
    }

    public Equipo actualizar(Long id, Equipo equipo) {
        Equipo existente = buscarPorId(id);
        existente.setNombre(equipo.getNombre());
        existente.setCiudad(equipo.getCiudad());
        existente.setEscudo(equipo.getEscudo());
        existente.setEstadio(equipo.getEstadio());
        existente.setFundacion(equipo.getFundacion());
        return equipoRepository.save(existente);
    }

    public void eliminar(Long id) {
        equipoRepository.deleteById(id);
    }
}
