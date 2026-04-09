package com.smartcampus.hub.controller.booking;

import com.smartcampus.hub.entity.booking.Booking;
import com.smartcampus.hub.enums.booking.BookingStatus;
import com.smartcampus.hub.security.PrincipalUser;
import com.smartcampus.hub.service.booking.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody Booking booking,
            @AuthenticationPrincipal PrincipalUser principalUser
    ) {
        try {
            booking.setUserEmail(principalUser.getUsername());
            return ResponseEntity.ok(bookingService.createBooking(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(@AuthenticationPrincipal PrincipalUser principalUser) {
        return ResponseEntity.ok(bookingService.getMyBookings(principalUser.getUsername()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable String id,
            @RequestParam BookingStatus status
    ) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable String id,
            @AuthenticationPrincipal PrincipalUser principalUser
    ) {
        bookingService.cancelBooking(id, principalUser.getUsername());
        return ResponseEntity.noContent().build();
    }
}
