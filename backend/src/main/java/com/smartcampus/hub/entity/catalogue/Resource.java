package com.smartcampus.hub.entity.catalogue;

import com.smartcampus.hub.enums.catalogue.ResourceStatus;
import com.smartcampus.hub.enums.catalogue.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;
    
    private String name;
    private String description;
    private String location;
    private int capacity;
    private String availableFrom;
    private String availableTo;
    
    private ResourceType type;
    private ResourceStatus status;
    
    private String imageUrl;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
