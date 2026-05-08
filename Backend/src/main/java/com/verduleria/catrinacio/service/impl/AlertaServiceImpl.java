package com.verduleria.catrinacio.service.impl;

import com.verduleria.catrinacio.dto.response.AlertaResponse;
import com.verduleria.catrinacio.entity.Alerta;
import com.verduleria.catrinacio.entity.Producto;
import com.verduleria.catrinacio.exception.ResourceNotFoundException;
import com.verduleria.catrinacio.repository.AlertaRepository;
import com.verduleria.catrinacio.repository.ProductoRepository;
import com.verduleria.catrinacio.service.AlertaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertaServiceImpl implements AlertaService {

    private final AlertaRepository alertaRepository;
    private final ProductoRepository productoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AlertaResponse> listarTodas() {
        return alertaRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlertaResponse> listarNoLeidas() {
        return alertaRepository.findByLeidaFalseOrderByFechaDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AlertaResponse marcarComoLeida(Long id) {
        Alerta alerta = alertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta", "id", id));
        alerta.setLeida(true);
        alerta = alertaRepository.save(alerta);
        return toResponse(alerta);
    }

    @Override
    @Transactional
    public void verificarStockBajo(Long productoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", productoId));

        if (producto.getStockActual().compareTo(BigDecimal.ZERO) <= 0) {
            crearAlerta(producto, Alerta.TipoAlerta.SIN_STOCK,
                    String.format("¡Sin stock! El producto '%s' se ha quedado sin stock.", producto.getNombre()));
        } else if (producto.getStockActual().compareTo(producto.getStockMinimo()) <= 0) {
            crearAlerta(producto, Alerta.TipoAlerta.STOCK_BAJO,
                    String.format("Stock bajo: El producto '%s' tiene %s %s (mínimo: %s)",
                            producto.getNombre(), producto.getStockActual(),
                            producto.getUnidadMedida(), producto.getStockMinimo()));
        }
    }

    private void crearAlerta(Producto producto, Alerta.TipoAlerta tipo, String mensaje) {
        Alerta alerta = Alerta.builder()
                .producto(producto)
                .tipo(tipo)
                .mensaje(mensaje)
                .leida(false)
                .fecha(LocalDateTime.now())
                .build();
        alertaRepository.save(alerta);
        log.warn("Alerta creada: {}", mensaje);
    }

    private AlertaResponse toResponse(Alerta alerta) {
        return AlertaResponse.builder()
                .id(alerta.getId())
                .productoId(alerta.getProducto().getId())
                .productoNombre(alerta.getProducto().getNombre())
                .tipo(alerta.getTipo().name())
                .mensaje(alerta.getMensaje())
                .leida(alerta.getLeida())
                .fecha(alerta.getFecha())
                .build();
    }
}
