package com.example.liga1pro.service;

import com.example.liga1pro.dto.EquipoDTO;
import com.example.liga1pro.dto.PartidoDTO;
import com.example.liga1pro.model.Equipo;
import com.example.liga1pro.model.Partido;
import org.springframework.stereotype.Service;

@Service
public class MapperService {
    
    public EquipoDTO convertirEquipoDTO(Equipo equipo) {
        if (equipo == null) {
            return null;
        }
        EquipoDTO dto = new EquipoDTO();
        dto.setId(equipo.getId());
        dto.setNombre(equipo.getNombre());
        dto.setLogoUrl(equipo.getLogoUrl());
        dto.setCiudad(equipo.getCiudad());
        dto.setEstadio(equipo.getEstadio());
        return dto;
    }
    
    public PartidoDTO convertirPartidoDTO(Partido partido) {
        if (partido == null) {
            return null;
        }
        PartidoDTO dto = new PartidoDTO();
        dto.setId(partido.getId());
        dto.setEquipoLocal(convertirEquipoDTO(partido.getEquipoLocal()));
        dto.setEquipoVisitante(convertirEquipoDTO(partido.getEquipoVisitante()));
        dto.setGolesLocal(partido.getGolesLocal());
        dto.setGolesVisitante(partido.getGolesVisitante());
        dto.setFechaHora(partido.getFechaHora());
        dto.setEstado(partido.getEstado());
        dto.setMinuto(partido.getMinuto());
        dto.setEstadio(partido.getEstadio());
        dto.setJornada(partido.getJornada());
        return dto;
    }
}
