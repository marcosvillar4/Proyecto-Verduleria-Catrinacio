package com.verduleria.catrinacio.repository;

import com.verduleria.catrinacio.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByActivaTrue();
    boolean existsByNombreIgnoreCase(String nombre);
}
