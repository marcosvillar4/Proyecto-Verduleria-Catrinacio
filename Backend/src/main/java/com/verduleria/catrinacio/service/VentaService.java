package com.verduleria.catrinacio.service;

import com.verduleria.catrinacio.dto.request.VentaRequest;
import com.verduleria.catrinacio.dto.response.VentaResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VentaService {
    VentaResponse registrar(VentaRequest request, Long usuarioId);
    VentaResponse obtenerPorId(Long id);
    Page<VentaResponse> listar(Pageable pageable);
    VentaResponse anular(Long id);
}
