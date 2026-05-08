package com.verduleria.catrinacio.repository;

import com.verduleria.catrinacio.entity.IngresoMercaderia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface IngresoMercaderiaRepository extends JpaRepository<IngresoMercaderia, Long> {
    Page<IngresoMercaderia> findByFechaBetween(LocalDateTime desde, LocalDateTime hasta, Pageable pageable);
}
