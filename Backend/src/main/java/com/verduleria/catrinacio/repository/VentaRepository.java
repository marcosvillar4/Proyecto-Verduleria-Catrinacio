package com.verduleria.catrinacio.repository;

import com.verduleria.catrinacio.entity.Venta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    Page<Venta> findByFechaBetween(LocalDateTime desde, LocalDateTime hasta, Pageable pageable);

    @Query("SELECT v FROM Venta v WHERE v.fecha >= :desde AND v.fecha <= :hasta AND v.estado = 'COMPLETADA'")
    List<Venta> findVentasCompletadasEnPeriodo(@Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);

    @Query("SELECT COALESCE(SUM(v.total), 0) FROM Venta v WHERE v.fecha >= :desde AND v.fecha <= :hasta AND v.estado = 'COMPLETADA'")
    java.math.BigDecimal sumTotalVentasEnPeriodo(@Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);
}
