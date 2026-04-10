package com.smartcampus.hub.service.booking;

import com.smartcampus.hub.entity.booking.Booking;
import com.smartcampus.hub.entity.catalogue.Resource;
import com.smartcampus.hub.entity.notifications.Notification;
import com.smartcampus.hub.enums.booking.BookingStatus;
import com.smartcampus.hub.repository.booking.BookingRepository;
import com.smartcampus.hub.repository.catalogue.ResourceRepository;
import com.smartcampus.hub.service.notifications.NotificationService;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository,
                          ResourceRepository resourceRepository,
                          NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.notificationService = notificationService;
    }

    public Booking createBooking(Booking booking) {
        // Load and validate resource
        Resource resource = resourceRepository.findById(booking.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        if (resource.getStatus() != null && !"ACTIVE".equals(resource.getStatus().name())) {
            throw new RuntimeException("Resource is not available for booking.");
        }

        // Validate duration constraint (maxBookingHours)
        if (resource.getMaxBookingHours() > 0) {
            long hours = Duration.between(booking.getStartTime(), booking.getEndTime()).toHours();
            if (hours > resource.getMaxBookingHours()) {
                throw new RuntimeException(
                    "Maximum booking duration for this resource is " + resource.getMaxBookingHours() + " hour(s).");
            }
        }

        // Validate end time is after start time
        if (!booking.getEndTime().isAfter(booking.getStartTime())) {
            throw new RuntimeException("End time must be after start time.");
        }

        // Validate attendee constraints
        int attendees = booking.getExpectedAttendees();
        if (resource.getMinAttendees() > 0 && attendees < resource.getMinAttendees()) {
            throw new RuntimeException(
                "This resource requires a minimum of " + resource.getMinAttendees() + " attendees.");
        }
        if (resource.getMaxAttendees() > 0 && attendees > resource.getMaxAttendees()) {
            throw new RuntimeException(
                "This resource allows a maximum of " + resource.getMaxAttendees() + " attendees.");
        }
        if (resource.getCapacity() > 0 && attendees > resource.getCapacity()) {
            throw new RuntimeException(
                "Expected attendees exceed resource capacity of " + resource.getCapacity() + ".");
        }

        // Conflict Detection (vs APPROVED bookings)
        List<Booking> overlaps = bookingRepository.findOverlappingBookings(
                booking.getResourceId(),
                booking.getStartTime(),
                booking.getEndTime()
        );
        if (!overlaps.isEmpty()) {
            throw new RuntimeException("Booking conflict! This resource is already booked for the selected time slot.");
        }

        booking.setStatus(BookingStatus.PENDING);
        Booking saved = bookingRepository.save(booking);

        // Notify user
        notificationService.sendToUser(saved.getUserEmail(), Notification.builder()
                .title("Booking Submitted")
                .message("Your booking for \"" + resource.getName() + "\" is pending approval.")
                .type(Notification.NotificationType.BOOKING_APPROVED)
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

    /** Returns booked slots (APPROVED + PENDING) for a resource on a given date */
    public List<Booking> getBookedSlots(String resourceId, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();
        return bookingRepository.findByResourceIdAndTimeRange(resourceId, start, end);
    }

    public Booking updateBookingStatus(String id, BookingStatus status, String rejectionReason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);
        if (status == BookingStatus.REJECTED && rejectionReason != null && !rejectionReason.isBlank()) {
            booking.setRejectionReason(rejectionReason);
        }
        Booking updated = bookingRepository.save(booking);

        String message = "Your booking for resource \"" + updated.getResourceId() + "\" has been " + status.name().toLowerCase();
        if (status == BookingStatus.REJECTED && rejectionReason != null && !rejectionReason.isBlank()) {
            message += ". Reason: " + rejectionReason;
        }
        notificationService.sendToUser(updated.getUserEmail(), Notification.builder()
                .title("Booking Status Updated")
                .message(message)
                .type(status == BookingStatus.APPROVED
                        ? Notification.NotificationType.BOOKING_APPROVED
                        : Notification.NotificationType.BOOKING_REJECTED)
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
