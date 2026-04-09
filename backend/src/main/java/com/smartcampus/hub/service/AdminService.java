package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.AdminOverviewDto;
import com.smartcampus.hub.dto.AdminUserView;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.enums.Role;
import com.smartcampus.hub.enums.ticketing.TicketStatus;
import com.smartcampus.hub.repository.UserRepository;
import com.smartcampus.hub.repository.ticketing.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;

    public AdminService(UserRepository userRepository, TicketRepository ticketRepository) {
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
    }

    public List<AdminUserView> getAllUsersForAdmin() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(user -> new AdminUserView(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRoles() == null ? List.of() : user.getRoles().stream().map(Enum::name).sorted().collect(Collectors.toList()),
                        user.getCreatedAt(),
                        user.getUpdatedAt()
                ))
                .collect(Collectors.toList());
    }

    public AdminOverviewDto getOverview() {
        List<User> users = userRepository.findAll();
        long staffUsers = users.stream()
                .filter(user -> user.getRoles() != null && user.getRoles().stream().anyMatch(role -> role == Role.MANAGER || role == Role.TECHNICIAN || role == Role.ADMIN))
                .count();

        long totalTickets = ticketRepository.count();
        long openTickets = ticketRepository.findByStatus(TicketStatus.OPEN).size();
        long inProgressTickets = ticketRepository.findByStatus(TicketStatus.IN_PROGRESS).size();

        return new AdminOverviewDto(users.size(), staffUsers, totalTickets, openTickets, inProgressTickets);
    }
}
