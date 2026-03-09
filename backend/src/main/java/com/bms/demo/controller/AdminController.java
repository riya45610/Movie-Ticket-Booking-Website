package com.bms.demo.controller;

import com.bms.demo.model.Booking;
import com.bms.demo.model.Movie;
import com.bms.demo.model.Theater;
import com.bms.demo.repository.BookingRepository;
import com.bms.demo.repository.MovieRepository;
import com.bms.demo.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private MovieRepository movieRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private TheaterRepository theaterRepository;
    
    // Movie Management
    @GetMapping("/movies")
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }
    
    @PostMapping("/movies")
    public ResponseEntity<Movie> addMovie(@RequestBody Movie movie) {
        return ResponseEntity.ok(movieRepository.save(movie));
    }
    
    @PutMapping("/movies/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie movie) {
        try {
            movie.setId(id);
            Movie updated = movieRepository.save(movie);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/movies/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // Theater Management
    @GetMapping("/theaters")
    public List<Theater> getAllTheaters() {
        return theaterRepository.findAll();
    }
    
    @PostMapping("/theaters")
    public ResponseEntity<Theater> addTheater(@RequestBody Theater theater) {
        return ResponseEntity.ok(theaterRepository.save(theater));
    }
    
    @PutMapping("/theaters/{id}")
    public ResponseEntity<Theater> updateTheater(@PathVariable Long id, @RequestBody Theater theater) {
        try {
            theater.setId(id);
            Theater updated = theaterRepository.save(theater);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/theaters/{id}")
    public ResponseEntity<Void> deleteTheater(@PathVariable Long id) {
        theaterRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // Booking Management
    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    // Statistics
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalMovies = movieRepository.count();
        long totalBookings = bookingRepository.count();
        long totalTheaters = theaterRepository.count();
        
        // Calculate total revenue
        List<Booking> bookings = bookingRepository.findAll();
        double totalRevenue = bookings.stream()
            .mapToDouble(b -> b.getTotalAmount())
            .sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("movies", totalMovies);
        stats.put("theaters", totalTheaters);
        stats.put("bookings", totalBookings);
        stats.put("revenue", totalRevenue);
        
        return ResponseEntity.ok(stats);
    }
}
