package com.bms.demo.config;

import com.bms.demo.model.User;
import com.bms.demo.model.Movie;
import com.bms.demo.model.Theater;
import com.bms.demo.repository.UserRepository;
import com.bms.demo.repository.MovieRepository;
import com.bms.demo.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TheaterRepository theaterRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize admin user if not exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            admin.setEmail("admin@bookmyshow.com");
            admin.setFullName("System Admin");
            userRepository.save(admin);
            System.out.println("Admin user created: admin/admin123");
        }

        // Initialize sample user if not exists
        if (userRepository.findByUsername("user").isEmpty()) {
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole("ROLE_USER");
            user.setEmail("user@example.com");
            user.setFullName("Sample User");
            userRepository.save(user);
            System.out.println("Sample user created: user/user123");
        }

        // Initialize sample movies if none exist
        if (movieRepository.count() == 0) {
            Movie movie1 = new Movie("Leo", "Tamil", "Action", 150, "https://m.media-amazon.com/images/M/MV5BN2JhODQ4NGItZjI0ZS00NjAyLWFmMDEtYjI5MzJkMzQyMzdmXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg", "NOW_SHOWING");
            Movie movie2 = new Movie("Jawan", "Hindi", "Action", 169, "https://m.media-amazon.com/images/M/MV5BOWI5YTlkNGYtMzcwNC00MmQzLWExN2UtOGY5ZWZkNDJiNWQzXkEyXkFqcGdeQXVyMTUzNTgzNzM0._V1_.jpg", "NOW_SHOWING");
            Movie movie3 = new Movie("Oppenheimer", "English", "Biography", 180, "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg", "NOW_SHOWING");
            Movie movie4 = new Movie("Barbie", "English", "Comedy", 114, "https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzUtMzc2MC00NjZmLWFlZjAtYTM4ZDZmYTMyZjA2XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg", "COMING_SOON");
            Movie movie5 = new Movie("Killers of the Flower Moon", "English", "Drama", 206, "https://m.media-amazon.com/images/M/MV5BN2I1YTBiNDUtZDc1YS00ZGZhLWI0NzAtZWM0OWYyYjI4MDc5XkEyXkFqcGdeQXVyMTAxMzYwODc1._V1_.jpg", "COMING_SOON");

            movieRepository.save(movie1);
            movieRepository.save(movie2);
            movieRepository.save(movie3);
            movieRepository.save(movie4);
            movieRepository.save(movie5);
            System.out.println("Sample movies created");
        }

        // Initialize sample theaters if none exist
        if (theaterRepository.count() == 0) {
            Theater theater1 = new Theater("PVR Cinemas", "Mumbai", 200, "2D");
            Theater theater2 = new Theater("INOX", "Delhi", 150, "3D");
            Theater theater3 = new Theater("Cinepolis", "Bangalore", 180, "IMAX");

            theaterRepository.save(theater1);
            theaterRepository.save(theater2);
            theaterRepository.save(theater3);
            System.out.println("Sample theaters created");
        }
    }
}