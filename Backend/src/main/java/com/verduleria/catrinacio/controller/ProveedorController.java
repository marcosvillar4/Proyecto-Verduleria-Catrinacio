package com.verduleria.catrinacio.controller;

import com.verduleria.catrinacio.dto.request.ProveedorRequest;
import com.verduleria.catrinacio.dto.response.ApiResponse;
import com.verduleria.catrinacio.dto.response.ProveedorResponse;
import com.verduleria.catrinacio.entity.Proveedor;
import com.verduleria.catrinacio.exception.ResourceNotFoundException;
import com.verduleria.catrinacio.repository.ProveedorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/proveedores")
@RequiredArgsConstructor
@Tag(name = "Proveedores", description = "Gestión de proveedores")
public class ProveedorController {

    private final ProveedorRepository proveedorRepository;

    @GetMapping
    @Operation(summary = "Listar proveedores activos")
    public ResponseEntity<ApiResponse<List<ProveedorResponse>>> listar() {
        List<ProveedorResponse> proveedores = proveedorRepository.findByActivoTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(proveedores));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener proveedor por ID")
    public ResponseEntity<ApiResponse<ProveedorResponse>> obtener(@PathVariable Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", "id", id));
        return ResponseEntity.ok(ApiResponse.ok(toResponse(proveedor)));
    }

    @PostMapping
    @Operation(summary = "Crear proveedor")
    public ResponseEntity<ApiResponse<ProveedorResponse>> crear(@Valid @RequestBody ProveedorRequest request) {
        Proveedor proveedor = Proveedor.builder()
                .nombre(request.getNombre())
                .contacto(request.getContacto())
                .telefono(request.getTelefono())
                .email(request.getEmail())
                .direccion(request.getDireccion())
                .activo(true)
                .build();
        proveedor = proveedorRepository.save(proveedor);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Proveedor creado", toResponse(proveedor)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar proveedor")
    public ResponseEntity<ApiResponse<ProveedorResponse>> actualizar(@PathVariable Long id,
                                                                      @Valid @RequestBody ProveedorRequest request) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", "id", id));
        proveedor.setNombre(request.getNombre());
        proveedor.setContacto(request.getContacto());
        proveedor.setTelefono(request.getTelefono());
        proveedor.setEmail(request.getEmail());
        proveedor.setDireccion(request.getDireccion());
        proveedor = proveedorRepository.save(proveedor);
        return ResponseEntity.ok(ApiResponse.ok("Proveedor actualizado", toResponse(proveedor)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar proveedor")
    public ResponseEntity<ApiResponse<Void>> desactivar(@PathVariable Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", "id", id));
        proveedor.setActivo(false);
        proveedorRepository.save(proveedor);
        return ResponseEntity.ok(ApiResponse.ok("Proveedor desactivado", null));
    }

    private ProveedorResponse toResponse(Proveedor proveedor) {
        return ProveedorResponse.builder()
                .id(proveedor.getId())
                .nombre(proveedor.getNombre())
                .contacto(proveedor.getContacto())
                .telefono(proveedor.getTelefono())
                .email(proveedor.getEmail())
                .direccion(proveedor.getDireccion())
                .activo(proveedor.getActivo())
                .createdAt(proveedor.getCreatedAt())
                .build();
    }
}
