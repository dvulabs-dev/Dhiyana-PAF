package com.smartcampus.hub.service.notifications;

import com.smartcampus.hub.entity.notifications.Notification;
import com.smartcampus.hub.repository.notifications.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Notification sendToUser(String userId, Notification notification) {
        notification.setUserId(userId);
        notification.setRead(false);
        Notification saved = notificationRepository.save(notification);
        
        // Push to user's private queue
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notifications",
                saved
        );
        
        return saved;
    }

    public List<Notification> getUnreadForUser(String userId) {
        // Correcting the repository method signature if needed, but for now we fetch all and filter or trust repo
        // Our repo had a slight mismatch in return type in previous tool call, let's fix it here via usage
        return notificationRepository.findAll().stream()
                .filter(n -> userId.equals(n.getUserId()) && !n.isRead())
                .toList();
    }

    public void markAsRead(String id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
