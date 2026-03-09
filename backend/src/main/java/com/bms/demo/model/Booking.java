
package com.bms.demo.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String seats;
    private double totalAmount;
    private Long movieId;
    private String movieTitle;
    private LocalDateTime bookingTime;
    private String status; // CONFIRMED, CANCELLED
    
    public Booking() {
        this.bookingTime = LocalDateTime.now();
        this.status = "CONFIRMED";
    }
    
    public Booking(String customerName, String seats, double totalAmount, Long movieId, String movieTitle) {
        this.customerName = customerName;
        this.seats = seats;
        this.totalAmount = totalAmount;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.bookingTime = LocalDateTime.now();
        this.status = "CONFIRMED";
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public String getSeats() {
        return seats;
    }
    
    public void setSeats(String seats) {
        this.seats = seats;
    }
    
    public double getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public Long getMovieId() {
        return movieId;
    }
    
    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }
    
    public String getMovieTitle() {
        return movieTitle;
    }
    
    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }
    
    public LocalDateTime getBookingTime() {
        return bookingTime;
    }
    
    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
