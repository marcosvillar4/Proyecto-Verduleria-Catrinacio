package com.verduleria.catrinacio.controller;

import com.verduleria.catrinacio.dto.request.ProductoRequest;
import com.verduleria.catrinacio.dto.response.ApiResponse;
import com.verduleria.catrinacio.dto.response.ProductoResponse;
import com.verduleria.catrinacio.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
@Tag(name = "Productos", description = "Gestión de productos y stock")
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    @Operation(summary = "Listar productos activos con paginación")
    public ResponseEntity<ApiResponse<Page<ProductoResponse>>> listar(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(productoService.listarActivos(pageable)));
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar productos por nombre o descripción")
    public ResponseEntity<ApiResponse<Page<ProductoResponse>>> buscar(
            @RequestParam String q,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(productoService.buscar(q, pageable)));
    }

    @GetMapping("/categoria/{categoriaId}")
    @Operation(summary = "Listar productos por categoría")
    public ResponseEntity<ApiResponse<Page<ProductoResponse>>> listarPorCategoria(
            @PathVariable Long categoriaId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(productoService.listarPorCategoria(categoriaId, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID")
    public ResponseEntity<ApiResponse<ProductoResponse>> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productoService.obtenerPorId(id)));
    }

    @GetMapping("/bajo-stock")
    @Operation(summary = "Listar productos con stock bajo")
    public ResponseEntity<ApiResponse<List<ProductoResponse>>> bajoStock() {
        return ResponseEntity.ok(ApiResponse.ok(productoService.obtenerBajoStock()));
    }

    @PostMapping
    @Operation(summary = "Crear producto")
    public ResponseEntity<ApiResponse<ProductoResponse>> crear(@Valid @RequestBody ProductoRequest request) {
        ProductoResponse response = productoService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Producto creado", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar producto")
    public ResponseEntity<ApiResponse<ProductoResponse>> actualizar(@PathVariable Long id,
                                                                     @Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Producto actualizado", productoService.actualizar(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar producto")
    public ResponseEntity<ApiResponse<Void>> desactivar(@PathVariable Long id) {
        productoService.desactivar(id);
        return ResponseEntity.ok(ApiResponse.ok("Producto desactivado", null));
    }
}
