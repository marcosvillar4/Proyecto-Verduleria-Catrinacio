package com.verduleria.catrinacio.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngresoRequest {

    private Long proveedorId;

    private String observaciones;

    @NotEmpty(message = "El ingreso debe tener al menos un detalle")
    @Valid
    private List<DetalleIngresoRequest> detalles;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetalleIngresoRequest {

        @NotNull(message = "El producto es obligatorio")
        private Long productoId;

        @NotNull(message = "La cantidad es obligatoria")
        @DecimalMin(value = "0.01", message = "La cantidad debe ser mayor a 0")
        private BigDecimal cantidad;

        @NotNull(message = "El precio unitario es obligatorio")
        @DecimalMin(value = "0.0", message = "El precio unitario no puede ser negativo")
        private BigDecimal precioUnitario;
    }
}
