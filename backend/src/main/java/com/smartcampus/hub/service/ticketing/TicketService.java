package com.smartcampus.hub.service.ticketing;

import com.smartcampus.hub.entity.notifications.Notification;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.entity.ticketing.Comment;
import com.smartcampus.hub.entity.ticketing.Ticket;
import com.smartcampus.hub.enums.Role;
import com.smartcampus.hub.enums.ticketing.TicketStatus;
import com.smartcampus.hub.repository.UserRepository;
import com.smartcampus.hub.repository.ticketing.TicketRepository;
import com.smartcampus.hub.service.notifications.NotificationService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository, NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Ticket createTicket(Ticket ticket) {
        if (ticket.getDepartment() == null || ticket.getDepartment().isBlank()) {
            throw new IllegalArgumentException("Department is required when creating a ticket.");
        }
        ticket.setDepartment(ticket.getDepartment().trim().toUpperCase());
        ticket.setStatus(TicketStatus.PENDING);
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getMyTickets(String email) {
        return ticketRepository.findByReporterEmail(email);
    }

    public List<Ticket> getAssignedTickets(String email) {
        User requester = getRequiredUser(email);
        if (hasRole(requester, Role.ADMIN)) {
            return ticketRepository.findAll();
        }
        if (hasRole(requester, Role.MANAGER)) {
            if (requester.getDepartment() == null || requester.getDepartment().isBlank()) {
                return List.of();
            }
            return ticketRepository.findByDepartmentIgnoreCase(requester.getDepartment());
        }
        return ticketRepository.findByAssigneeEmail(email);
    }

    public List<Ticket> getAllTickets(String email) {
        User requester = getRequiredUser(email);
        if (hasRole(requester, Role.ADMIN)) {
            return ticketRepository.findAll();
        }
        if (hasRole(requester, Role.MANAGER)) {
            if (requester.getDepartment() == null || requester.getDepartment().isBlank()) {
                return List.of();
            }
            return ticketRepository.findByDepartmentIgnoreCase(requester.getDepartment());
        }
        throw new AccessDeniedException("Only admins or managers can view all tickets.");
    }

    public Ticket getTicketById(String id, String requesterEmail) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User requester = getRequiredUser(requesterEmail);
        if (hasRole(requester, Role.ADMIN)) {
            return ticket;
        }
        if (requesterEmail.equalsIgnoreCase(ticket.getReporterEmail())) {
            return ticket;
        }
        if (ticket.getAssigneeEmail() != null && requesterEmail.equalsIgnoreCase(ticket.getAssigneeEmail())) {
            return ticket;
        }
        if (hasRole(requester, Role.MANAGER)) {
            String managerDepartment = normalize(requester.getDepartment());
            String ticketDepartment = normalize(ticket.getDepartment());
            if (!managerDepartment.isBlank() && managerDepartment.equals(ticketDepartment)) {
                return ticket;
            }
            throw new AccessDeniedException("Managers can only access tickets in their own department.");
        }

        throw new AccessDeniedException("You are not allowed to view this ticket.");
    }

    public Ticket updateTicketStatus(String id, TicketStatus status, String requesterEmail) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User requester = getRequiredUser(requesterEmail);
        if (hasRole(requester, Role.MANAGER) && !hasRole(requester, Role.ADMIN)) {
            String managerDepartment = normalize(requester.getDepartment());
            String ticketDepartment = normalize(ticket.getDepartment());
            if (managerDepartment.isBlank() || !managerDepartment.equals(ticketDepartment)) {
                throw new AccessDeniedException("Managers can only update status for their own department tickets.");
            }
            if (status != TicketStatus.OPEN && status != TicketStatus.CLOSED) {
                throw new AccessDeniedException("Managers can only set status to OPEN or CLOSED.");
            }
            if (ticket.getStatus() == TicketStatus.CLOSED) {
                throw new IllegalArgumentException("Closed tickets cannot be reopened or modified.");
            }
            if (status == TicketStatus.OPEN && ticket.getStatus() != TicketStatus.PENDING) {
                throw new IllegalArgumentException("Managers can open only pending tickets.");
            }
        }

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
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
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

    public Ticket addComment(String id, Comment comment, String commenterEmail) {
        Ticket ticket = getTicketById(id, commenterEmail);
        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw new IllegalArgumentException("Cannot add messages to a closed ticket.");
        }
        User commenter = getRequiredUser(commenterEmail);

        if (hasRole(commenter, Role.MANAGER)) {
            if (commenterEmail.equalsIgnoreCase(ticket.getReporterEmail())) {
                comment.setCreatedAt(LocalDateTime.now());
                ticket.getComments().add(comment);
                Ticket updated = ticketRepository.save(ticket);

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

            String managerDepartment = normalize(commenter.getDepartment());
            String ticketDepartment = normalize(ticket.getDepartment());
            if (managerDepartment.isBlank() || !managerDepartment.equals(ticketDepartment)) {
                throw new AccessDeniedException("Managers can only reply to tickets in their own department.");
            }
        }

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

    private User getRequiredUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("Authenticated user was not found."));
    }

    private boolean hasRole(User user, Role role) {
        return user.getRoles() != null && user.getRoles().contains(role);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toUpperCase();
    }
}
