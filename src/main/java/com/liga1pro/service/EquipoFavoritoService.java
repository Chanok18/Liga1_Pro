package com.liga1pro.service;

import com.liga1pro.model.Equipo;
import com.liga1pro.model.EquipoFavorito;
import com.liga1pro.model.Usuario;
import com.liga1pro.repository.EquipoFavoritoRepository;
import com.liga1pro.repository.EquipoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class EquipoFavoritoService {

    private final EquipoFavoritoRepository equipoFavoritoRepository;
    private final EquipoRepository equipoRepository;
    private final UsuarioService usuarioService;
    private final ApiFootballService apiFootballService;

    @Transactional(readOnly = true)
    public Optional<Equipo> obtenerFavorito(Long usuarioId) {
        return equipoFavoritoRepository.findByUsuarioId(usuarioId)
                .stream()
                .findFirst()
                .map(EquipoFavorito::getEquipo)
                .map(this::sincronizarEquipoConApiSiExiste);
    }

    public Equipo marcarFavorito(Long usuarioId, Long equipoId) {
        // Eliminar favorito anterior (solo permitimos 1 equipo favorito por usuario)
        List<EquipoFavorito> actuales = equipoFavoritoRepository.findByUsuarioId(usuarioId);
        equipoFavoritoRepository.deleteAll(actuales);

        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseGet(() -> {
                    Equipo remoto = apiFootballService.buscarEquipoPorId(equipoId);
                    Equipo existentePorNombre = equipoRepository.findByNombre(remoto.getNombre());
                    if (existentePorNombre != null) {
                        return sincronizarCamposEquipo(existentePorNombre, remoto);
                    }

                    Equipo nuevoEquipo = Equipo.builder()
                            .nombre(remoto.getNombre())
                            .ciudad(remoto.getCiudad())
                            .escudo(remoto.getEscudo())
                            .estadio(remoto.getEstadio())
                            .fundacion(remoto.getFundacion())
                            .entrenador(remoto.getEntrenador())
                            .build();
                    return equipoRepository.save(nuevoEquipo);
                });

        equipo = sincronizarEquipoConApiSiExiste(equipo);

        EquipoFavorito favorito = EquipoFavorito.builder()
                .usuario(usuario)
                .equipo(equipo)
                .build();

        equipoFavoritoRepository.save(favorito);
        return equipo;
    }

    public void quitarFavorito(Long usuarioId) {
        List<EquipoFavorito> actuales = equipoFavoritoRepository.findByUsuarioId(usuarioId);
        equipoFavoritoRepository.deleteAll(actuales);
    }

    private Equipo sincronizarEquipoConApiSiExiste(Equipo equipo) {
        try {
            Equipo remoto = apiFootballService.buscarEquipoPorNombre(equipo.getNombre());

            if (remoto == null || !nombresCoinciden(remoto.getNombre(), equipo.getNombre())) {
                return equipo;
            }

            return sincronizarCamposEquipo(equipo, remoto);
        } catch (Exception ignored) {
            return equipo;
        }
    }

    private Equipo sincronizarCamposEquipo(Equipo destino, Equipo origen) {
        boolean changed = false;

        if (origen.getNombre() != null && !Objects.equals(destino.getNombre(), origen.getNombre())) {
            destino.setNombre(origen.getNombre());
            changed = true;
        }
        if (origen.getCiudad() != null && !Objects.equals(destino.getCiudad(), origen.getCiudad())) {
            destino.setCiudad(origen.getCiudad());
            changed = true;
        }
        if (origen.getEscudo() != null && !Objects.equals(destino.getEscudo(), origen.getEscudo())) {
            destino.setEscudo(origen.getEscudo());
            changed = true;
        }
        if (origen.getEstadio() != null && !Objects.equals(destino.getEstadio(), origen.getEstadio())) {
            destino.setEstadio(origen.getEstadio());
            changed = true;
        }
        if (origen.getFundacion() != null && !Objects.equals(destino.getFundacion(), origen.getFundacion())) {
            destino.setFundacion(origen.getFundacion());
            changed = true;
        }
        if (origen.getEntrenador() != null && !Objects.equals(destino.getEntrenador(), origen.getEntrenador())) {
            destino.setEntrenador(origen.getEntrenador());
            changed = true;
        }

        return changed ? equipoRepository.save(destino) : destino;
    }

    private boolean nombresCoinciden(String left, String right) {
        if (left == null || right == null) {
            return false;
        }

        String normalizedLeft = normalize(left);
        String normalizedRight = normalize(right);

        return normalizedLeft.equals(normalizedRight)
                || normalizedLeft.contains(normalizedRight)
                || normalizedRight.contains(normalizedLeft);
    }

    private String normalize(String value) {
        return value.toLowerCase()
                .replace("á", "a")
                .replace("é", "e")
                .replace("í", "i")
                .replace("ó", "o")
                .replace("ú", "u")
                .replaceAll("[^a-z0-9]+", " ")
                .trim();
    }
}
