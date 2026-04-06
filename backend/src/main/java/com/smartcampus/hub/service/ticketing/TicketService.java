package com.smartcampus.hub.service.ticketing;

import com.smartcampus.hub.entity.ticketing.Comment;
import com.smartcampus.hub.entity.ticketing.Ticket;
import com.smartcampus.hub.enums.ticketing.TicketStatus;
import com.smartcampus.hub.repository.ticketing.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

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
        return ticketRepository.save(ticket);
    }

    public Ticket assignTicket(String id, String technicianEmail) {
        Ticket ticket = getTicketById(id);
        ticket.setAssigneeEmail(technicianEmail);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        return ticketRepository.save(ticket);
    }

    public Ticket addComment(String id, Comment comment) {
        Ticket ticket = getTicketById(id);
        comment.setCreatedAt(LocalDateTime.now());
        ticket.getComments().add(comment);
        return ticketRepository.save(ticket);
    }
}
