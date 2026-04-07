package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.LoginRequest;
import com.smartcampus.hub.dto.RegisterRequest;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.enums.Role;
import com.smartcampus.hub.repository.UserRepository;
import com.smartcampus.hub.security.JwtService;
import com.smartcampus.hub.security.PrincipalUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public String register(RegisterRequest request) {
        String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        String name = request.getName() == null ? "" : request.getName().trim();
        String password = request.getPassword() == null ? "" : request.getPassword();

        if (email.isBlank() || password.isBlank()) {
            throw new IllegalArgumentException("Email and password are required.");
        }
        if (password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        User user = User.builder()
                .name(name.isBlank() ? email : name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .roles(Set.of(Role.USER))
                .build();

        userRepository.save(user);
        return generateToken(user);
    }

    public String login(LoginRequest request) {
        String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        String password = request.getPassword() == null ? "" : request.getPassword();

        if (email.isBlank() || password.isBlank()) {
            throw new IllegalArgumentException("Email and password are required.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (user.getPassword() == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return generateToken(user);
    }

    private String generateToken(User user) {
        PrincipalUser principalUser = new PrincipalUser(user);
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles());
        return jwtService.generateToken(claims, principalUser);
    }
}
