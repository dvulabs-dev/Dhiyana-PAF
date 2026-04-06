package com.smartcampus.hub.service.booking;

import com.smartcampus.hub.entity.booking.Booking;
import com.smartcampus.hub.enums.booking.BookingStatus;
import com.smartcampus.hub.repository.booking.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

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
        return bookingRepository.save(booking);
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
        return bookingRepository.save(booking);
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
