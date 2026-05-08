package com.verduleria.catrinacio.controller;

import com.verduleria.catrinacio.dto.response.AlertaResponse;
import com.verduleria.catrinacio.dto.response.ApiResponse;
import com.verduleria.catrinacio.service.AlertaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alertas")
@RequiredArgsConstructor
@Tag(name = "Alertas", description = "Gestión de alertas del sistema")
public class AlertaController {

    private final AlertaService alertaService;

    @GetMapping
    @Operation(summary = "Listar todas las alertas")
    public ResponseEntity<ApiResponse<List<AlertaResponse>>> listar() {
        return ResponseEntity.ok(ApiResponse.ok(alertaService.listarTodas()));
    }

    @GetMapping("/no-leidas")
    @Operation(summary = "Listar alertas no leídas")
    public ResponseEntity<ApiResponse<List<AlertaResponse>>> noLeidas() {
        return ResponseEntity.ok(ApiResponse.ok(alertaService.listarNoLeidas()));
    }

    @PutMapping("/{id}/leer")
    @Operation(summary = "Marcar alerta como leída")
    public ResponseEntity<ApiResponse<AlertaResponse>> marcarLeida(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Alerta marcada como leída", alertaService.marcarComoLeida(id)));
    }
}
