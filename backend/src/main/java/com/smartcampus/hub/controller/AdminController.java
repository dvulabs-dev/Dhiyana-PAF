package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.AdminOverviewDto;
import com.smartcampus.hub.dto.AdminUserView;
import com.smartcampus.hub.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserView>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsersForAdmin());
    }

    @GetMapping("/overview")
    public ResponseEntity<AdminOverviewDto> getOverview() {
        return ResponseEntity.ok(adminService.getOverview());
    }
}
