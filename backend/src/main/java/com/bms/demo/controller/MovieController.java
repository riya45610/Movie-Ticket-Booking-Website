
package com.bms.demo.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.bms.demo.repository.MovieRepository;
import com.bms.demo.model.Movie;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin("*")
public class MovieController{
    
    @Autowired
    private MovieRepository repo;

@GetMapping
public List<Movie> all(){
return repo.findAll();
}

@PostMapping
public Movie add(@RequestBody Movie m){
return repo.save(m);
}
}
