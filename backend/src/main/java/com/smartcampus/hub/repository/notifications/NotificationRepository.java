package com.smartcampus.hub.repository.notifications;

import com.smartcampus.hub.entity.notifications.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<String> findByUserIdAndReadOrderByCreatedAtDesc(String userId, boolean read);
    Page<Notification> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    long countByUserIdAndRead(String userId, boolean read);
}
