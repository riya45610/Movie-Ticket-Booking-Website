
package com.bms.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bms.demo.model.Movie;

public interface MovieRepository extends JpaRepository<Movie,Long>{}
