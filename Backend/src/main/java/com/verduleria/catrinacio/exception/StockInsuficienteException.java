package com.verduleria.catrinacio.exception;

public class StockInsuficienteException extends RuntimeException {
    public StockInsuficienteException(String productoNombre, java.math.BigDecimal stockActual, java.math.BigDecimal cantidadSolicitada) {
        super(String.format("Stock insuficiente para '%s'. Stock actual: %s, cantidad solicitada: %s",
                productoNombre, stockActual, cantidadSolicitada));
    }
}
