package com.smartcampus.hub.entity.ticketing;

import com.smartcampus.hub.enums.ticketing.TicketPriority;
import com.smartcampus.hub.enums.ticketing.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;
    
    private String resourceId;
    private String reporterEmail;
    private String assigneeEmail;
    
    private String title;
    private String description;
    
    private TicketStatus status;
    private TicketPriority priority;
    
    private List<String> imageUrls;
    
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
