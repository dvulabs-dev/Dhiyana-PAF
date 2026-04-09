package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.LoginRequest;
import com.smartcampus.hub.dto.RegisterRequest;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.enums.Role;
import com.smartcampus.hub.repository.UserRepository;
import com.smartcampus.hub.security.JwtService;
import com.smartcampus.hub.security.PrincipalUser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

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

    public String createStaff(RegisterRequest request) {
        String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        String name = request.getName() == null ? "" : request.getName().trim();
        String password = request.getPassword() == null ? "" : request.getPassword();
        String roleStr = request.getRole() == null ? "TECHNICIAN" : request.getRole().trim().toUpperCase();

        if (email.isBlank() || password.isBlank()) {
            throw new IllegalArgumentException("Email and password are required.");
        }
        if (password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        Role assignRole;
        try {
            assignRole = Role.valueOf(roleStr);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid role. Use TECHNICIAN or MANAGER.");
        }

        if (assignRole != Role.TECHNICIAN && assignRole != Role.MANAGER) {
            throw new IllegalArgumentException("Only staff roles TECHNICIAN or MANAGER are allowed.");
        }

        User user = User.builder()
                .name(name.isBlank() ? email : name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .roles(Set.of(assignRole))
                .build();

        userRepository.save(user);
        return "Account created successfully";
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

    public String loginWithGoogle(String googleToken) {
        Map<String, String> profile = extractGoogleProfile(googleToken);
        String email = profile.get("email");
        String name = profile.get("name");
        String picture = profile.get("picture");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(email)
                            .name((name == null || name.isBlank()) ? email.split("@")[0] : name)
                            .picture(picture)
                            .roles(Set.of(Role.USER))
                            .build();
                    return userRepository.save(newUser);
                });

        boolean changed = false;
        if ((user.getName() == null || user.getName().isBlank()) && name != null && !name.isBlank()) {
            user.setName(name);
            changed = true;
        }
        if ((user.getPicture() == null || user.getPicture().isBlank()) && picture != null && !picture.isBlank()) {
            user.setPicture(picture);
            changed = true;
        }
        if (changed) {
            user = userRepository.save(user);
        }

        return generateToken(user);
    }

    private Map<String, String> extractGoogleProfile(String googleToken) {
        try {
            String[] parts = googleToken.split("\\.");
            if (parts.length < 2) {
                throw new IllegalArgumentException("Invalid Google token format.");
            }

            byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
            String payloadJson = new String(decoded, StandardCharsets.UTF_8);
            JsonNode payload = OBJECT_MAPPER.readTree(payloadJson);

            String email = payload.path("email").asText("").trim().toLowerCase();
            String name = payload.path("name").asText("").trim();
            String picture = payload.path("picture").asText("").trim();

            if (email.isBlank()) {
                throw new IllegalArgumentException("Google token did not contain email.");
            }

            Map<String, String> profile = new HashMap<>();
            profile.put("email", email);
            profile.put("name", name);
            profile.put("picture", picture);
            return profile;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid Google token.");
        }
    }

    private String generateToken(User user) {
        PrincipalUser principalUser = new PrincipalUser(user);
        Map<String, Object> claims = new HashMap<>();
        // Important: Prefix roles with ROLE_ for Spring Security
        claims.put("roles", user.getRoles().stream()
                .map(role -> "ROLE_" + role.name())
                .collect(Collectors.toList()));
        return jwtService.generateToken(claims, principalUser);
    }
}
