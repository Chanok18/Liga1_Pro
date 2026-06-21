package com.liga1pro.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticiaFeedDTO {
    private List<String> equipos;
    private List<String> ligas;
    private List<NoticiaDTO> noticias;
}
