package com.verduleria.catrinacio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertaResponse {
    private Long id;
    private Long productoId;
    private String productoNombre;
    private String tipo;
    private String mensaje;
    private Boolean leida;
    private LocalDateTime fecha;
}
