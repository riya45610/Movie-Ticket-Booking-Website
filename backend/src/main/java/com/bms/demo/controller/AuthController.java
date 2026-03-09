package com.bms.demo.controller;

import com.bms.demo.config.JwtUtil;
import com.bms.demo.model.User;
import com.bms.demo.model.dto.AuthRequest;
import com.bms.demo.model.dto.AuthResponse;
import com.bms.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().build();
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "ROLE_USER");
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        
        userRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getFullName());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole(), user.getFullName()));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);
        
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).build();
        }
        
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getFullName());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole(), user.getFullName()));
    }
}
