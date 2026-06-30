package com.liga1pro.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticiaDTO {
    private String id;
    private String titulo;
    private String descripcion;
    private String url;
    private String imagen;
    private String fuente;
    private String fechaPublicacion;
    private String equipo;
    private String liga;
}
