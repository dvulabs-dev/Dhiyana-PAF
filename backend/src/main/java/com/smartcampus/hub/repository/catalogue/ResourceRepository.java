package com.smartcampus.hub.repository.catalogue;

import com.smartcampus.hub.entity.catalogue.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {
    
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    Page<Resource> findByNameRegex(String name, Pageable pageable);
    
    List<Resource> findByType(String type);
}
