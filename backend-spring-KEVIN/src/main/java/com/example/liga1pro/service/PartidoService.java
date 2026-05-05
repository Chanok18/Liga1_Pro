package com.example.liga1pro.service;

import com.example.liga1pro.dto.PartidoDTO;
import com.example.liga1pro.model.Partido;
import com.example.liga1pro.repository.PartidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PartidoService {
    
    @Autowired
    private PartidoRepository partidoRepository;
    
    @Autowired
    private MapperService mapperService;
    
    public List<PartidoDTO> obtenerPartidosEnVivo() {
        return partidoRepository.findPartidosEnVivo()
            .stream()
            .map(mapperService::convertirPartidoDTO)
            .collect(Collectors.toList());
    }
    
    public List<PartidoDTO> obtenerPartidosPorJornada(Integer jornada) {
        return partidoRepository.findByJornada(jornada)
            .stream()
            .map(mapperService::convertirPartidoDTO)
            .collect(Collectors.toList());
    }
    
    public PartidoDTO obtenerPartidoPorId(Long id) {
        Partido partido = partidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Partido no encontrado"));
        return mapperService.convertirPartidoDTO(partido);
    }
    
    public PartidoDTO crearPartido(PartidoDTO partidoDTO) {
        Partido partido = new Partido();
        partido.setEstado("no_iniciado");
        Partido savedPartido = partidoRepository.save(partido);
        return mapperService.convertirPartidoDTO(savedPartido);
    }
}
