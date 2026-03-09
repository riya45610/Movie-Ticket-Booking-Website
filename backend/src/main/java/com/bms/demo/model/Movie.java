
package com.bms.demo.model;
import jakarta.persistence.*;

@Entity
public class Movie{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String language;
    private String genre;
    private int duration;
    private String posterUrl;
    private String status; // NOW_SHOWING, COMING_SOON
    
    public Movie() {
        this.status = "NOW_SHOWING";
    }
    
    public Movie(String title, String language, String genre, int duration, String posterUrl) {
        this.title = title;
        this.language = language;
        this.genre = genre;
        this.duration = duration;
        this.posterUrl = posterUrl;
        this.status = "NOW_SHOWING";
    }
    
    public Movie(String title, String language, String genre, int duration, String posterUrl, String status) {
        this.title = title;
        this.language = language;
        this.genre = genre;
        this.duration = duration;
        this.posterUrl = posterUrl;
        this.status = status;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
    
    public String getGenre() {
        return genre;
    }
    
    public void setGenre(String genre) {
        this.genre = genre;
    }
    
    public int getDuration() {
        return duration;
    }
    
    public void setDuration(int duration) {
        this.duration = duration;
    }
    
    public String getPosterUrl() {
        return posterUrl;
    }
    
    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
