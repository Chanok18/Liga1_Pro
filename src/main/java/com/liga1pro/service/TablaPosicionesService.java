package com.liga1pro.service;

import com.liga1pro.dto.TablaPosicionesDTO;
import com.liga1pro.model.EstadoPartido;
import com.liga1pro.model.Partido;
import com.liga1pro.repository.EquipoRepository;
import com.liga1pro.repository.PartidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TablaPosicionesService {

    private final PartidoRepository partidoRepository;
    private final EquipoRepository equipoRepository;

    public List<TablaPosicionesDTO> calcularTabla() {
        Map<Long, TablaPosicionesDTO> tabla = new HashMap<>();

        equipoRepository.findAll().forEach(equipo -> {
            tabla.put(equipo.getId(), TablaPosicionesDTO.builder()
                    .equipo(equipo.getNombre()).pj(0).pg(0).pe(0)
                    .pp(0).gf(0).gc(0).dg(0).pts(0).build());
        });

        List<Partido> finalizados = partidoRepository
                .findByEstado(EstadoPartido.FINALIZADO);

        for (Partido p : finalizados) {
            TablaPosicionesDTO local = tabla.get(p.getEquipoLocal().getId());
            TablaPosicionesDTO visita = tabla.get(p.getEquipoVisitante().getId());
            if (local == null || visita == null)
                continue;

            int gl = p.getGolesLocal();
            int gv = p.getGolesVisitante();

            local.setPj(local.getPj() + 1);
            visita.setPj(visita.getPj() + 1);
            local.setGf(local.getGf() + gl);
            local.setGc(local.getGc() + gv);
            visita.setGf(visita.getGf() + gv);
            visita.setGc(visita.getGc() + gl);

            if (gl > gv) {
                local.setPg(local.getPg() + 1);
                local.setPts(local.getPts() + 3);
                visita.setPp(visita.getPp() + 1);
            } else if (gl == gv) {
                local.setPe(local.getPe() + 1);
                local.setPts(local.getPts() + 1);
                visita.setPe(visita.getPe() + 1);
                visita.setPts(visita.getPts() + 1);
            } else {
                visita.setPg(visita.getPg() + 1);
                visita.setPts(visita.getPts() + 3);
                local.setPp(local.getPp() + 1);
            }
        }

        List<TablaPosicionesDTO> resultado = new ArrayList<>(tabla.values());
        resultado.forEach(e -> e.setDg(e.getGf() - e.getGc()));
        resultado.sort(Comparator.comparingInt(TablaPosicionesDTO::getPts)
                .thenComparingInt(TablaPosicionesDTO::getDg)
                .thenComparingInt(TablaPosicionesDTO::getGf).reversed());

        for (int i = 0; i < resultado.size(); i++) {
            resultado.get(i).setPosicion(i + 1);
        }
        return resultado;
    }
}
