package com.verduleria.catrinacio.controller;

import com.verduleria.catrinacio.dto.request.VentaRequest;
import com.verduleria.catrinacio.dto.response.ApiResponse;
import com.verduleria.catrinacio.dto.response.VentaResponse;
import com.verduleria.catrinacio.security.UserPrincipal;
import com.verduleria.catrinacio.service.VentaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ventas")
@RequiredArgsConstructor
@Tag(name = "Ventas", description = "Registro y gestión de ventas")
public class VentaController {

    private final VentaService ventaService;

    @GetMapping
    @Operation(summary = "Listar ventas con paginación")
    public ResponseEntity<ApiResponse<Page<VentaResponse>>> listar(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(ventaService.listar(pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener venta por ID")
    public ResponseEntity<ApiResponse<VentaResponse>> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(ventaService.obtenerPorId(id)));
    }

    @PostMapping
    @Operation(summary = "Registrar venta", description = "Registra una venta, descuenta stock y genera alertas si es necesario")
    public ResponseEntity<ApiResponse<VentaResponse>> registrar(
            @Valid @RequestBody VentaRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        VentaResponse response = ventaService.registrar(request, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Venta registrada exitosamente", response));
    }

    @PutMapping("/{id}/anular")
    @Operation(summary = "Anular venta", description = "Anula la venta y restaura el stock de los productos")
    public ResponseEntity<ApiResponse<VentaResponse>> anular(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Venta anulada", ventaService.anular(id)));
    }
}
