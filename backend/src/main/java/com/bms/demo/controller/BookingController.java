
package com.bms.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import com.bms.demo.repository.BookingRepository;
import com.bms.demo.repository.MovieRepository;
import com.bms.demo.model.Booking;
import com.bms.demo.model.Movie;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController{

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private MovieRepository movieRepo;

    @PostMapping
    public ResponseEntity<?> book(@RequestBody Booking booking) {
        try {
            // Validate movie exists
            Optional<Movie> movieOpt = movieRepo.findById(booking.getMovieId());
            if (!movieOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Movie not found");
            }

            // Check if seats are already booked for this movie
            List<Booking> existingBookings = bookingRepo.findAll();
            for (Booking existing : existingBookings) {
                if (existing.getMovieId().equals(booking.getMovieId()) &&
                    existing.getStatus().equals("CONFIRMED")) {
                    // Check if any of the requested seats are already booked
                    String[] requestedSeats = booking.getSeats().split(",");
                    String[] existingSeats = existing.getSeats().split(",");
                    for (String reqSeat : requestedSeats) {
                        for (String existSeat : existingSeats) {
                            if (reqSeat.trim().equals(existSeat.trim())) {
                                return ResponseEntity.badRequest()
                                    .body("Seat " + reqSeat.trim() + " is already booked for this movie");
                            }
                        }
                    }
                }
            }

            Movie movie = movieOpt.get();
            booking.setMovieTitle(movie.getTitle());

            Booking saved = bookingRepo.save(booking);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing booking: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Booking> all(){
        return bookingRepo.findAll();
    }

    @GetMapping("/movie/{movieId}")
    public List<Booking> getBookingsByMovie(@PathVariable Long movieId) {
        return bookingRepo.findAll().stream()
            .filter(b -> b.getMovieId() != null && b.getMovieId().equals(movieId) && "CONFIRMED".equals(b.getStatus()))
            .toList();
    }
}
