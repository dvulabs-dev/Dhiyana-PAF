package com.smartcampus.hub.service.ticketing;

import com.smartcampus.hub.entity.notifications.Notification;
import com.smartcampus.hub.entity.ticketing.Comment;
import com.smartcampus.hub.entity.ticketing.Ticket;
import com.smartcampus.hub.enums.ticketing.TicketStatus;
import com.smartcampus.hub.repository.ticketing.TicketRepository;
import com.smartcampus.hub.service.notifications.NotificationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    public TicketService(TicketRepository ticketRepository, NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.notificationService = notificationService;
    }

    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus(TicketStatus.OPEN);
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getMyTickets(String email) {
        return ticketRepository.findByReporterEmail(email);
    }

    public List<Ticket> getAssignedTickets(String email) {
        return ticketRepository.findByAssigneeEmail(email);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public Ticket updateTicketStatus(String id, TicketStatus status) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus(status);
        Ticket updated = ticketRepository.save(ticket);
        
        notificationService.sendToUser(updated.getReporterEmail(), Notification.builder()
                .title("Ticket Status Updated")
                .message("Your ticket #" + updated.getId() + " is now " + status.name().toLowerCase())
                .type(Notification.NotificationType.TICKET_UPDATE)
                .relatedId(updated.getId())
                .build());
                
        return updated;
    }

    public Ticket assignTicket(String id, String technicianEmail) {
        Ticket ticket = getTicketById(id);
        ticket.setAssigneeEmail(technicianEmail);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        Ticket updated = ticketRepository.save(ticket);
        
        // Notify technician
        notificationService.sendToUser(technicianEmail, Notification.builder()
                .title("New Ticket Assigned")
                .message("You have been assigned to ticket #" + updated.getId())
                .type(Notification.NotificationType.TICKET_UPDATE)
                .relatedId(updated.getId())
                .build());
                
        return updated;
    }

    public Ticket addComment(String id, Comment comment) {
        Ticket ticket = getTicketById(id);
        comment.setCreatedAt(LocalDateTime.now());
        ticket.getComments().add(comment);
        Ticket updated = ticketRepository.save(ticket);
        
        // Notify reporter if comment is from someone else
        if (!comment.getUserEmail().equals(updated.getReporterEmail())) {
            notificationService.sendToUser(updated.getReporterEmail(), Notification.builder()
                    .title("New Comment on Ticket")
                    .message("There's a new update on your ticket #" + updated.getId())
                    .type(Notification.NotificationType.COMMENT_ADDED)
                    .relatedId(updated.getId())
                    .build());
        }
        
        return updated;
    }
}
