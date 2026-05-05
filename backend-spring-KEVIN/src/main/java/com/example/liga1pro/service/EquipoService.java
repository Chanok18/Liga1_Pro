package com.example.liga1pro.service;

import com.example.liga1pro.dto.EquipoDTO;
import com.example.liga1pro.model.Equipo;
import com.example.liga1pro.repository.EquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipoService {
    
    @Autowired
    private EquipoRepository equipoRepository;
    
    @Autowired
    private MapperService mapperService;
    
    public List<EquipoDTO> obtenerTodosEquipos() {
        return equipoRepository.findAll()
            .stream()
            .map(mapperService::convertirEquipoDTO)
            .collect(Collectors.toList());
    }
    
    public EquipoDTO obtenerEquipoPorId(Long id) {
        Equipo equipo = equipoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
        return mapperService.convertirEquipoDTO(equipo);
    }
    
    public EquipoDTO crearEquipo(EquipoDTO equipoDTO) {
        Equipo equipo = new Equipo();
        equipo.setNombre(equipoDTO.getNombre());
        equipo.setLogoUrl(equipoDTO.getLogoUrl());
        equipo.setCiudad(equipoDTO.getCiudad());
        equipo.setEstadio(equipoDTO.getEstadio());
        
        Equipo savedEquipo = equipoRepository.save(equipo);
        return mapperService.convertirEquipoDTO(savedEquipo);
    }
}
