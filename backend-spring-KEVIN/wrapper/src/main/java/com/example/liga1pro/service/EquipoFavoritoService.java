package com.example.liga1pro.service;

import com.example.liga1pro.config.MapperUtil;
import com.example.liga1pro.dto.*;
import com.example.liga1pro.model.Partido;
import com.example.liga1pro.model.Partido.EstadoPartido;
import com.example.liga1pro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipoFavoritoService {

    private final PartidoRepository partidoRepository;
    private final TablaPosicionRepository tablaRepository;
    private final EquipoRepository equipoRepository;

    public EquipoFavoritoDTO obtenerContenidoFavorito(Long equipoId) {

        EquipoFavoritoDTO resultado = new EquipoFavoritoDTO();

        // 1. Info del equipo
        equipoRepository.findById(equipoId).ifPresent(e ->
                resultado.setEquipo(MapperUtil.toDTO(e)));

        // 2. Posición en tabla
        tablaRepository.findByEquipoId(equipoId).ifPresent(t ->
                resultado.setPosicionActual(MapperUtil.toDTO(t)));

        // 3. Próximos partidos del equipo
        List<PartidoDTO> proximos = partidoRepository
                .findByEstado(EstadoPartido.PROGRAMADO)
                .stream()
                .filter(p -> esDelEquipo(p, equipoId))
                .limit(3)
                .map(MapperUtil::toDTO)
                .collect(Collectors.toList());
        resultado.setProximosPartidos(proximos);

        // 4. Últimos resultados
        List<PartidoDTO> resultados = partidoRepository
                .findByEstado(EstadoPartido.FINALIZADO)
                .stream()
                .filter(p -> esDelEquipo(p, equipoId))
                .limit(5)
                .map(MapperUtil::toDTO)
                .collect(Collectors.toList());
        resultado.setUltimosResultados(resultados);

        // 5. Generar alertas
        resultado.setAlertas(generarAlertas(equipoId, proximos, resultados));

        return resultado;
    }

    private boolean esDelEquipo(Partido p, Long equipoId) {
        return p.getEquipoLocal().getId().equals(equipoId)
                || p.getEquipoVisitante().getId().equals(equipoId);
    }

    private List<String> generarAlertas(Long equipoId,
                                        List<PartidoDTO> proximos,
                                        List<PartidoDTO> resultados) {
        List<String> alertas = new ArrayList<>();

        // Alerta próximo partido
        if (!proximos.isEmpty()) {
            PartidoDTO siguiente = proximos.get(0);
            alertas.add("⚽ Próximo partido: " + siguiente.getEquipoLocal().getNombre()
                    + " vs " + siguiente.getEquipoVisitante().getNombre()
                    + " — " + siguiente.getFechaHora());
        } else {
            alertas.add("📅 No hay partidos programados próximamente.");
        }

        // Alerta último resultado
        if (!resultados.isEmpty()) {
            PartidoDTO ultimo = resultados.get(0);
            boolean ganoLocal = ultimo.getGolesLocal() > ultimo.getGolesVisitante();
            boolean esLocal = ultimo.getEquipoLocal().getId().equals(equipoId);
            boolean gano = (esLocal && ganoLocal) || (!esLocal && !ganoLocal
                    && !ultimo.getGolesLocal().equals(ultimo.getGolesVisitante()));
            boolean empato = ultimo.getGolesLocal().equals(ultimo.getGolesVisitante());

            if (empato) {
                alertas.add("🤝 Último partido: Empate "
                        + ultimo.getGolesLocal() + "-" + ultimo.getGolesVisitante());
            } else if (gano) {
                alertas.add("🏆 Último partido: ¡Victoria! "
                        + ultimo.getGolesLocal() + "-" + ultimo.getGolesVisitante());
            } else {
                alertas.add("😞 Último partido: Derrota "
                        + ultimo.getGolesLocal() + "-" + ultimo.getGolesVisitante());
            }
        }

        // Alerta racha
        long victorias = resultados.stream().filter(p -> {
            boolean esLocal = p.getEquipoLocal().getId().equals(equipoId);
            if (esLocal) return p.getGolesLocal() > p.getGolesVisitante();
            else return p.getGolesVisitante() > p.getGolesLocal();
        }).count();

        if (victorias >= 3) {
            alertas.add("🔥 ¡Tu equipo está en racha! " + victorias + " victorias seguidas.");
        } else if (victorias == 0 && resultados.size() >= 2) {
            alertas.add("💪 El equipo necesita mejorar — sin victorias en los últimos partidos.");
        }

        return alertas;
    }
}
