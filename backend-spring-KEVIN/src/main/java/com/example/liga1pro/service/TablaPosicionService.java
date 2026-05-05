package com.example.liga1pro.service;

import com.example.liga1pro.dto.TablaPosicionDTO;
import com.example.liga1pro.model.TablaPosicion;
import com.example.liga1pro.repository.TablaPosicionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TablaPosicionService {
    
    @Autowired
    private TablaPosicionRepository tablaPosicionRepository;
    
    @Autowired
    private MapperService mapperService;
    
    public List<TablaPosicionDTO> obtenerTablaPosiciones() {
        return tablaPosicionRepository.findAllOrdenada()
            .stream()
            .map(this::convertirTablaPosicionDTO)
            .collect(Collectors.toList());
    }
    
    private TablaPosicionDTO convertirTablaPosicionDTO(TablaPosicion tp) {
        TablaPosicionDTO dto = new TablaPosicionDTO();
        dto.setId(tp.getId());
        dto.setEquipo(mapperService.convertirEquipoDTO(tp.getEquipo()));
        dto.setPosicion(tp.getPosicion());
        dto.setPartidosJugados(tp.getPartidosJugados());
        dto.setPartidosGanados(tp.getPartidosGanados());
        dto.setPartidosEmpatados(tp.getPartidosEmpatados());
        dto.setPartidosPerdidos(tp.getPartidosPerdidos());
        dto.setGolesFavor(tp.getGolesFavor());
        dto.setGolesContra(tp.getGolesContra());
        dto.setDiferenciaGoles(tp.getDiferenciaGoles());
        dto.setPuntos(tp.getPuntos());
        return dto;
    }
}
