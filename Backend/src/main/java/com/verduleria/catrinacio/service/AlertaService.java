package com.verduleria.catrinacio.service;

import com.verduleria.catrinacio.dto.response.AlertaResponse;
import java.util.List;

public interface AlertaService {
    List<AlertaResponse> listarTodas();
    List<AlertaResponse> listarNoLeidas();
    AlertaResponse marcarComoLeida(Long id);
    void verificarStockBajo(Long productoId);
}
