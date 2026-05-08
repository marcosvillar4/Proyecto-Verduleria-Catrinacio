package com.verduleria.catrinacio.service.impl;

import com.verduleria.catrinacio.dto.request.ProductoRequest;
import com.verduleria.catrinacio.dto.response.ProductoResponse;
import com.verduleria.catrinacio.entity.Categoria;
import com.verduleria.catrinacio.entity.Producto;
import com.verduleria.catrinacio.exception.ResourceNotFoundException;
import com.verduleria.catrinacio.repository.CategoriaRepository;
import com.verduleria.catrinacio.repository.ProductoRepository;
import com.verduleria.catrinacio.service.AlertaService;
import com.verduleria.catrinacio.service.ProductoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final AlertaService alertaService;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoResponse> listarActivos(Pageable pageable) {
        return productoRepository.findByActivoTrue(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoResponse> buscar(String busqueda, Pageable pageable) {
        return productoRepository.buscarPorNombreODescripcion(busqueda, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoResponse> listarPorCategoria(Long categoriaId, Pageable pageable) {
        return productoRepository.findByActivoTrueAndCategoriaId(categoriaId, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoResponse obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        return toResponse(producto);
    }

    @Override
    @Transactional
    public ProductoResponse crear(ProductoRequest request) {
        Categoria categoria = null;
        if (request.getCategoriaId() != null) {
            categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", request.getCategoriaId()));
        }

        Producto producto = Producto.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .unidadMedida(request.getUnidadMedida())
                .precioCompra(request.getPrecioCompra())
                .precioVenta(request.getPrecioVenta())
                .stockMinimo(request.getStockMinimo() != null ? request.getStockMinimo() : java.math.BigDecimal.ZERO)
                .stockActual(java.math.BigDecimal.ZERO)
                .categoria(categoria)
                .activo(true)
                .build();

        producto = productoRepository.save(producto);
        log.info("Producto creado: {} (ID: {})", producto.getNombre(), producto.getId());
        return toResponse(producto);
    }

    @Override
    @Transactional
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));

        Categoria categoria = null;
        if (request.getCategoriaId() != null) {
            categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", request.getCategoriaId()));
        }

        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setUnidadMedida(request.getUnidadMedida());
        producto.setPrecioCompra(request.getPrecioCompra());
        producto.setPrecioVenta(request.getPrecioVenta());
        if (request.getStockMinimo() != null) {
            producto.setStockMinimo(request.getStockMinimo());
        }
        producto.setCategoria(categoria);

        producto = productoRepository.save(producto);
        // Verificar si el stock quedó por debajo del mínimo
        alertaService.verificarStockBajo(producto.getId());

        log.info("Producto actualizado: {} (ID: {})", producto.getNombre(), producto.getId());
        return toResponse(producto);
    }

    @Override
    @Transactional
    public void desactivar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        producto.setActivo(false);
        productoRepository.save(producto);
        log.info("Producto desactivado: {} (ID: {})", producto.getNombre(), producto.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponse> obtenerBajoStock() {
        return productoRepository.findProductosBajoStock().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ProductoResponse toResponse(Producto producto) {
        return ProductoResponse.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .unidadMedida(producto.getUnidadMedida())
                .precioCompra(producto.getPrecioCompra())
                .precioVenta(producto.getPrecioVenta())
                .stockActual(producto.getStockActual())
                .stockMinimo(producto.getStockMinimo())
                .categoriaId(producto.getCategoria() != null ? producto.getCategoria().getId() : null)
                .categoriaNombre(producto.getCategoria() != null ? producto.getCategoria().getNombre() : null)
                .activo(producto.getActivo())
                .createdAt(producto.getCreatedAt())
                .updatedAt(producto.getUpdatedAt())
                .build();
    }
}
