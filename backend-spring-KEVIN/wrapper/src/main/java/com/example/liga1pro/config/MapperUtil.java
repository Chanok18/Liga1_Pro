package com.example.liga1pro.config;

import com.example.liga1pro.dto.*;
import com.example.liga1pro.model.*;

public class MapperUtil {

    public static EquipoDTO toDTO(Equipo e) {
        if (e == null) return null;
        EquipoDTO dto = new EquipoDTO();
        dto.setId(e.getId());
        dto.setNombre(e.getNombre());
        dto.setCiudad(e.getCiudad());
        dto.setEscudo(e.getEscudo());
        dto.setFundacion(e.getFundacion());
        dto.setEstadio(e.getEstadio());
        return dto;
    }

    public static JugadorDTO toDTO(Jugador j) {
        if (j == null) return null;
        JugadorDTO dto = new JugadorDTO();
        dto.setId(j.getId());
        dto.setNombre(j.getNombre());
        dto.setPosicion(j.getPosicion());
        dto.setNumeroCamiseta(j.getNumeroCamiseta());
        dto.setNacionalidad(j.getNacionalidad());
        dto.setEdad(j.getEdad());
        dto.setEquipo(toDTO(j.getEquipo()));
        return dto;
    }

    public static PartidoDTO toDTO(Partido p) {
        if (p == null) return null;
        PartidoDTO dto = new PartidoDTO();
        dto.setId(p.getId());
        dto.setEquipoLocal(toDTO(p.getEquipoLocal()));
        dto.setEquipoVisitante(toDTO(p.getEquipoVisitante()));
        dto.setFechaHora(p.getFechaHora());
        dto.setGolesLocal(p.getGolesLocal());
        dto.setGolesVisitante(p.getGolesVisitante());
        dto.setEstado(p.getEstado() != null ? p.getEstado().name() : null);
        dto.setEstadio(p.getEstadio());
        return dto;
    }

    public static TablaPosicionDTO toDTO(TablaPosicion t) {
        if (t == null) return null;
        TablaPosicionDTO dto = new TablaPosicionDTO();
        dto.setId(t.getId());
        dto.setEquipo(toDTO(t.getEquipo()));
        dto.setPuntos(t.getPuntos());
        dto.setPartidosJugados(t.getPartidosJugados());
        dto.setPartidosGanados(t.getPartidosGanados());
        dto.setPartidosEmpatados(t.getPartidosEmpatados());
        dto.setPartidosPerdidos(t.getPartidosPerdidos());
        dto.setGolesFavor(t.getGolesFavor());
        dto.setGolesContra(t.getGolesContra());
        dto.setDiferenciaGoles(t.getDiferenciaGoles());
        return dto;
    }

    public static EstadisticaJugadorDTO toDTO(EstadisticaJugador e) {
        if (e == null) return null;
        EstadisticaJugadorDTO dto = new EstadisticaJugadorDTO();
        dto.setJugadorId(e.getJugador().getId());
        dto.setNombreJugador(e.getJugador().getNombre());
        dto.setPosicion(e.getJugador().getPosicion());
        dto.setEquipo(e.getJugador().getEquipo() != null ?
                e.getJugador().getEquipo().getNombre() : "Sin equipo");
        dto.setPartidosJugados(e.getPartidosJugados());
        dto.setGoles(e.getGoles());
        dto.setAsistencias(e.getAsistencias());
        dto.setTarjetasAmarillas(e.getTarjetasAmarillas());
        dto.setTarjetasRojas(e.getTarjetasRojas());
        dto.setMinutosJugados(e.getMinutosJugados());
        return dto;
    }
}
