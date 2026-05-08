package com.verduleria.catrinacio.service;

import com.verduleria.catrinacio.dto.request.ProductoRequest;
import com.verduleria.catrinacio.dto.response.ProductoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductoService {
    Page<ProductoResponse> listarActivos(Pageable pageable);
    Page<ProductoResponse> buscar(String busqueda, Pageable pageable);
    Page<ProductoResponse> listarPorCategoria(Long categoriaId, Pageable pageable);
    ProductoResponse obtenerPorId(Long id);
    ProductoResponse crear(ProductoRequest request);
    ProductoResponse actualizar(Long id, ProductoRequest request);
    void desactivar(Long id);
    List<ProductoResponse> obtenerBajoStock();
}
