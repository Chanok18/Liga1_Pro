package com.example.liga1pro.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Object credentials) {
        // Implementar login con JWT
        return ResponseEntity.ok("Login endpoint");
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Object usuario) {
        // Implementar registro de usuario
        return ResponseEntity.ok("Register endpoint");
    }
}
