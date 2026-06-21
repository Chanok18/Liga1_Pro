package com.liga1pro.service;

import com.liga1pro.dto.MensajeChatDTO;
import com.liga1pro.model.Equipo;
import com.liga1pro.model.EquipoFavorito;
import com.liga1pro.model.EstadoPartido;
import com.liga1pro.model.GrupoChat;
import com.liga1pro.model.MensajeChat;
import com.liga1pro.model.MiembroGrupo;
import com.liga1pro.model.Partido;
import com.liga1pro.model.RolMiembro;
import com.liga1pro.model.TipoChat;
import com.liga1pro.model.Usuario;
import com.liga1pro.repository.EquipoFavoritoRepository;
import com.liga1pro.repository.GrupoChatRepository;
import com.liga1pro.repository.MensajeChatRepository;
import com.liga1pro.repository.MiembroGrupoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {

    private final MensajeChatRepository mensajeChatRepository;
    private final UsuarioService usuarioService;
    private final PartidoService partidoService;
    private final ApiFootballService apiFootballService;
    private final EquipoFavoritoRepository equipoFavoritoRepository;
    private final EquipoFavoritoService equipoFavoritoService;
    private final GrupoChatRepository grupoChatRepository;
    private final MiembroGrupoRepository miembroGrupoRepository;

    public MensajeChat guardarMensaje(MensajeChatDTO dto) {
        Usuario usuario = usuarioService.buscarPorId(dto.getUsuarioId());
        String contenido = Optional.ofNullable(dto.getContenido()).orElse("").trim();
        if (contenido.isBlank()) {
            throw new RuntimeException("El mensaje no puede estar vacio");
        }

        Partido partido = null;
        Long partidoChatId = null;
        if (dto.getPartidoId() != null) {
            partidoChatId = dto.getPartidoId();
            Partido partidoActual = buscarPartidoActual(dto.getPartidoId());
            if (partidoActual.getEstado() != EstadoPartido.EN_VIVO) {
                throw new RuntimeException("El chat del partido solo esta disponible mientras el partido esta en vivo");
            }
            partido = buscarPartidoLocal(dto.getPartidoId()).orElse(null);
        }

        Equipo equipo = null;
        if (dto.getEquipoId() != null) {
            Equipo favorito = obtenerEquipoFavoritoObligatorio(usuario.getId());
            if (!favorito.getId().equals(dto.getEquipoId())) {
                throw new RuntimeException("Solo puedes escribir en el chat de tu equipo favorito");
            }
            equipo = favorito;
        }

        GrupoChat grupoChat = null;
        if (dto.getGrupoChatId() != null) {
            grupoChat = grupoChatRepository.findById(dto.getGrupoChatId())
                    .orElseThrow(() -> new RuntimeException("GrupoChat no encontrado con id: " + dto.getGrupoChatId()));
        }

        MensajeChat mensaje = MensajeChat.builder()
                .contenido(contenido)
                .usuario(usuario)
                .partido(partido)
                .partidoChatId(partidoChatId)
                .equipo(equipo)
                .grupoChat(grupoChat)
                .tipo(dto.getTipo())
                .build();

        return mensajeChatRepository.save(mensaje);
    }

    @Transactional(readOnly = true)
    public List<MensajeChat> obtenerMensajesPartido(Long partidoId) {
        return mensajeChatRepository.findByPartidoChatIdOrderByTimestampAsc(partidoId);
    }

    @Transactional(readOnly = true)
    public List<MensajeChat> obtenerMensajesGrupo(Long grupoChatId) {
        return mensajeChatRepository.findByGrupoChatIdOrderByTimestampAsc(grupoChatId);
    }

    @Transactional(readOnly = true)
    public List<GrupoChat> obtenerGrupos() {
        return grupoChatRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> obtenerChatEquipoFavorito(Long usuarioId) {
        Equipo equipo = obtenerEquipoFavoritoObligatorio(usuarioId);
        List<MensajeChat> mensajes = mensajeChatRepository.findByEquipoIdAndTipoAndTimestampAfterOrderByTimestampAsc(
                equipo.getId(),
                TipoChat.EQUIPO,
                LocalDateTime.now().minusHours(24)
        );
        return Map.of(
                "equipo", equipo,
                "mensajes", mensajes
        );
    }

    @Transactional(readOnly = true)
    public List<Partido> obtenerPartidosEnVivo() {
        try {
            return apiFootballService.listarPartidosPorEstado(EstadoPartido.EN_VIVO);
        } catch (Exception ignored) {
            return partidoService.listarPorEstado(EstadoPartido.EN_VIVO);
        }
    }

    @Transactional(readOnly = true)
    public boolean esMiembro(Long grupoId, Long usuarioId) {
        return miembroGrupoRepository.findByGrupoIdAndUsuarioId(grupoId, usuarioId).isPresent();
    }

    @Transactional(readOnly = true)
    public long contarMiembros(Long grupoId) {
        return miembroGrupoRepository.countByGrupoId(grupoId);
    }

    public MiembroGrupo unirseAGrupo(Long grupoId, Long usuarioId) {
        if (esMiembro(grupoId, usuarioId)) {
            return miembroGrupoRepository.findByGrupoIdAndUsuarioId(grupoId, usuarioId).get();
        }
        GrupoChat grupo = grupoChatRepository.findById(grupoId)
                .orElseThrow(() -> new RuntimeException("Grupo no encontrado"));
        Usuario usuario = usuarioService.buscarPorId(usuarioId);

        MiembroGrupo miembro = MiembroGrupo.builder()
                .grupo(grupo)
                .usuario(usuario)
                .rol(RolMiembro.MIEMBRO)
                .build();
        return miembroGrupoRepository.save(miembro);
    }

    @Transactional
    public void salirDeGrupo(Long grupoId, Long usuarioId) {
        miembroGrupoRepository.deleteByGrupoIdAndUsuarioId(grupoId, usuarioId);
    }

    private Equipo obtenerEquipoFavoritoObligatorio(Long usuarioId) {
        return equipoFavoritoService.obtenerFavorito(usuarioId)
                .orElseThrow(() -> new RuntimeException("Selecciona un equipo favorito para usar el chat"));
    }

    private Partido buscarPartidoActual(Long partidoId) {
        try {
            return apiFootballService.buscarPartidoPorId(partidoId);
        } catch (Exception ignored) {
            return partidoService.buscarPorId(partidoId);
        }
    }

    private Optional<Partido> buscarPartidoLocal(Long partidoId) {
        try {
            return Optional.of(partidoService.buscarPorId(partidoId));
        } catch (Exception ignored) {
            return Optional.empty();
        }
    }
}
