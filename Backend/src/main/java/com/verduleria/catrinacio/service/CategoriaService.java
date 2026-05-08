package com.verduleria.catrinacio.service;

import com.verduleria.catrinacio.dto.request.CategoriaRequest;
import com.verduleria.catrinacio.dto.response.CategoriaResponse;
import java.util.List;

public interface CategoriaService {
    List<CategoriaResponse> listarActivas();
    CategoriaResponse obtenerPorId(Long id);
    CategoriaResponse crear(CategoriaRequest request);
    CategoriaResponse actualizar(Long id, CategoriaRequest request);
    void desactivar(Long id);
}
