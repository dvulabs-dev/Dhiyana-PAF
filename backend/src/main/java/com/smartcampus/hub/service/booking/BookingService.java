package com.smartcampus.hub.service.booking;

import com.smartcampus.hub.entity.notifications.Notification;
import com.smartcampus.hub.enums.booking.BookingStatus;
import com.smartcampus.hub.repository.booking.BookingRepository;
import com.smartcampus.hub.service.notifications.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public Booking createBooking(Booking booking) {
        // Conflict Detection
        List<Booking> overlaps = bookingRepository.findOverlappingBookings(
                booking.getResourceId(), 
                booking.getStartTime(), 
                booking.getEndTime()
        );

        if (!overlaps.isEmpty()) {
            throw new RuntimeException("Booking conflict detected! This resource is already booked for the selected time range.");
        }

        booking.setStatus(BookingStatus.PENDING);
        Booking saved = bookingRepository.save(booking);
        
        // Notify user about pending booking
        notificationService.sendToUser(saved.getUserEmail(), Notification.builder()
                .title("Booking Submitted")
                .message("Your booking for " + saved.getResourceName() + " is pending approval.")
                .type(Notification.NotificationType.BOOKING_APPROVED) // Mapping to broad category
                .relatedId(saved.getId())
                .build());
                
        return saved;
    }

    public List<Booking> getMyBookings(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateBookingStatus(String id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(status);
        Booking updated = bookingRepository.save(booking);
        
        // Notify user about status change
        notificationService.sendToUser(updated.getUserEmail(), Notification.builder()
                .title("Booking Status Updated")
                .message("Your booking for " + updated.getResourceName() + " has been " + status.name().toLowerCase())
                .type(status == BookingStatus.APPROVED ? Notification.NotificationType.BOOKING_APPROVED : Notification.NotificationType.BOOKING_REJECTED)
                .relatedId(updated.getId())
                .build());
                
        return updated;
    }

    public void cancelBooking(String id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }
        
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }
}
