package com.smartcampus.hub.controller.notifications;

import com.smartcampus.hub.entity.notifications.Notification;
import com.smartcampus.hub.service.notifications.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        // userDetails.getUsername() is the email in our implementation
        // We might need to fetch user by email first to get ID, or use email as ID if that's what we mapped
        // For simplicity, let's assume we fetch by username/email
        return ResponseEntity.ok(notificationService.getUnreadForUser(userDetails.getUsername()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }
}
