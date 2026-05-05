package com.example.liga1pro.service;

import com.example.liga1pro.model.*;
import com.example.liga1pro.model.Partido.EstadoPartido;
import com.example.liga1pro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TablaPosicionService {

    private final TablaPosicionRepository tablaRepository;
    private final PartidoRepository partidoRepository;
    private final EquipoRepository equipoRepository;

    // Devuelve la tabla ordenada por puntos
    public List<TablaPosicion> obtenerTabla() {
        return tablaRepository.findAllByOrderByPuntosDescDiferenciaGolesDesc();
    }

    // Recalcula toda la tabla desde cero basándose en partidos FINALIZADOS
    public void recalcularTabla() {
        // Resetear todos los registros
        List<Equipo> equipos = equipoRepository.findAll();
        for (Equipo equipo : equipos) {
            TablaPosicion fila = tablaRepository.findByEquipoId(equipo.getId())
                    .orElse(new TablaPosicion());
            fila.setEquipo(equipo);
            fila.setPuntos(0);
            fila.setPartidosJugados(0);
            fila.setPartidosGanados(0);
            fila.setPartidosEmpatados(0);
            fila.setPartidosPerdidos(0);
            fila.setGolesFavor(0);
            fila.setGolesContra(0);
            fila.setDiferenciaGoles(0);
            tablaRepository.save(fila);
        }

        // Calcular desde partidos finalizados
        List<Partido> partidos = partidoRepository.findByEstado(EstadoPartido.FINALIZADO);
        for (Partido p : partidos) {
            actualizarFilas(p);
        }
    }

    private void actualizarFilas(Partido p) {
        TablaPosicion local = tablaRepository.findByEquipoId(p.getEquipoLocal().getId())
                .orElse(new TablaPosicion());
        local.setEquipo(p.getEquipoLocal());

        TablaPosicion visitante = tablaRepository.findByEquipoId(p.getEquipoVisitante().getId())
                .orElse(new TablaPosicion());
        visitante.setEquipo(p.getEquipoVisitante());

        int gl = p.getGolesLocal();
        int gv = p.getGolesVisitante();

        local.setPartidosJugados(local.getPartidosJugados() + 1);
        visitante.setPartidosJugados(visitante.getPartidosJugados() + 1);
        local.setGolesFavor(local.getGolesFavor() + gl);
        local.setGolesContra(local.getGolesContra() + gv);
        visitante.setGolesFavor(visitante.getGolesFavor() + gv);
        visitante.setGolesContra(visitante.getGolesContra() + gl);

        if (gl > gv) { // Gana local
            local.setPartidosGanados(local.getPartidosGanados() + 1);
            local.setPuntos(local.getPuntos() + 3);
            visitante.setPartidosPerdidos(visitante.getPartidosPerdidos() + 1);
        } else if (gl < gv) { // Gana visitante
            visitante.setPartidosGanados(visitante.getPartidosGanados() + 1);
            visitante.setPuntos(visitante.getPuntos() + 3);
            local.setPartidosPerdidos(local.getPartidosPerdidos() + 1);
        } else { // Empate
            local.setPartidosEmpatados(local.getPartidosEmpatados() + 1);
            visitante.setPartidosEmpatados(visitante.getPartidosEmpatados() + 1);
            local.setPuntos(local.getPuntos() + 1);
            visitante.setPuntos(visitante.getPuntos() + 1);
        }

        local.setDiferenciaGoles(local.getGolesFavor() - local.getGolesContra());
        visitante.setDiferenciaGoles(visitante.getGolesFavor() - visitante.getGolesContra());

        tablaRepository.save(local);
        tablaRepository.save(visitante);
    }
}
