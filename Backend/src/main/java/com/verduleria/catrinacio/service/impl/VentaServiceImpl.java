package com.verduleria.catrinacio.service.impl;

import com.verduleria.catrinacio.dto.request.VentaRequest;
import com.verduleria.catrinacio.dto.response.VentaResponse;
import com.verduleria.catrinacio.entity.*;
import com.verduleria.catrinacio.exception.BadRequestException;
import com.verduleria.catrinacio.exception.ResourceNotFoundException;
import com.verduleria.catrinacio.exception.StockInsuficienteException;
import com.verduleria.catrinacio.repository.ProductoRepository;
import com.verduleria.catrinacio.repository.UsuarioRepository;
import com.verduleria.catrinacio.repository.VentaRepository;
import com.verduleria.catrinacio.service.AlertaService;
import com.verduleria.catrinacio.service.VentaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VentaServiceImpl implements VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AlertaService alertaService;

    @Override
    @Transactional
    public VentaResponse registrar(VentaRequest request, Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", usuarioId));

        Venta venta = Venta.builder()
                .usuario(usuario)
                .fecha(LocalDateTime.now())
                .metodoPago(Venta.MetodoPago.valueOf(request.getMetodoPago()))
                .estado(Venta.EstadoVenta.COMPLETADA)
                .numeroTicket(request.getNumeroTicket() != null ? request.getNumeroTicket() : generarNumeroTicket())
                .detalles(new ArrayList<>())
                .build();

        BigDecimal totalVenta = BigDecimal.ZERO;

        for (VentaRequest.DetalleVentaRequest detalleReq : request.getDetalles()) {
            Producto producto = productoRepository.findById(detalleReq.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", detalleReq.getProductoId()));

            // Verificar stock
            if (producto.getStockActual().compareTo(detalleReq.getCantidad()) < 0) {
                throw new StockInsuficienteException(producto.getNombre(), producto.getStockActual(), detalleReq.getCantidad());
            }

            BigDecimal subtotal = producto.getPrecioVenta().multiply(detalleReq.getCantidad());

            DetalleVenta detalle = DetalleVenta.builder()
                    .venta(venta)
                    .producto(producto)
                    .cantidad(detalleReq.getCantidad())
                    .precioUnitario(producto.getPrecioVenta())
                    .subtotal(subtotal)
                    .build();

            venta.getDetalles().add(detalle);
            totalVenta = totalVenta.add(subtotal);

            // Descontar stock
            producto.setStockActual(producto.getStockActual().subtract(detalleReq.getCantidad()));
            productoRepository.save(producto);

            // Verificar alertas de stock
            alertaService.verificarStockBajo(producto.getId());
        }

        venta.setTotal(totalVenta);
        venta = ventaRepository.save(venta);

        log.info("Venta registrada - Ticket: {}, Total: ${}", venta.getNumeroTicket(), venta.getTotal());
        return toResponse(venta);
    }

    @Override
    @Transactional(readOnly = true)
    public VentaResponse obtenerPorId(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta", "id", id));
        return toResponse(venta);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VentaResponse> listar(Pageable pageable) {
        return ventaRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Transactional
    public VentaResponse anular(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta", "id", id));

        if (venta.getEstado() == Venta.EstadoVenta.ANULADA) {
            throw new BadRequestException("La venta ya está anulada");
        }

        // Restaurar stock
        for (DetalleVenta detalle : venta.getDetalles()) {
            Producto producto = detalle.getProducto();
            producto.setStockActual(producto.getStockActual().add(detalle.getCantidad()));
            productoRepository.save(producto);
        }

        venta.setEstado(Venta.EstadoVenta.ANULADA);
        venta = ventaRepository.save(venta);

        log.info("Venta anulada - Ticket: {}", venta.getNumeroTicket());
        return toResponse(venta);
    }

    private String generarNumeroTicket() {
        return "TK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private VentaResponse toResponse(Venta venta) {
        List<VentaResponse.DetalleVentaResponse> detallesResp = venta.getDetalles().stream()
                .map(d -> VentaResponse.DetalleVentaResponse.builder()
                        .id(d.getId())
                        .productoId(d.getProducto().getId())
                        .productoNombre(d.getProducto().getNombre())
                        .cantidad(d.getCantidad())
                        .precioUnitario(d.getPrecioUnitario())
                        .subtotal(d.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return VentaResponse.builder()
                .id(venta.getId())
                .usuarioNombre(venta.getUsuario().getNombre() + " " + venta.getUsuario().getApellido())
                .fecha(venta.getFecha())
                .total(venta.getTotal())
                .metodoPago(venta.getMetodoPago().name())
                .estado(venta.getEstado().name())
                .numeroTicket(venta.getNumeroTicket())
                .detalles(detallesResp)
                .build();
    }
}
