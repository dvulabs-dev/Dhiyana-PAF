package com.smartcampus.hub.service.catalogue;

import com.smartcampus.hub.entity.catalogue.Resource;
import com.smartcampus.hub.repository.catalogue.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public Page<Resource> getAllResources(String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return resourceRepository.findByNameRegex(search, pageable);
        }
        return resourceRepository.findAll(pageable);
    }

    public Optional<Resource> getResourceById(String id) {
        return resourceRepository.findById(id);
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(String id, Resource resourceDetails) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
        
        resource.setName(resourceDetails.getName());
        resource.setDescription(resourceDetails.getDescription());
        resource.setLocation(resourceDetails.getLocation());
        resource.setCapacity(resourceDetails.getCapacity());
        resource.setType(resourceDetails.getType());
        resource.setStatus(resourceDetails.getStatus());
        resource.setImageUrl(resourceDetails.getImageUrl());
        
        return resourceRepository.save(resource);
    }

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }
}
