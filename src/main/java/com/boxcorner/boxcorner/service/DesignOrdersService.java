package com.boxcorner.boxcorner.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boxcorner.boxcorner.entity.DesignOrders;
import com.boxcorner.boxcorner.repository.DesignOrdersRepository;

@Service
public class DesignOrdersService {
    @Autowired
    private DesignOrdersRepository repository;

    

    public List<DesignOrders> getAllDesigns() {
        return repository.findAll();
    }

    public Optional<DesignOrders> getDesignById(Integer id) {
        return repository.findById(id);
    }

     public DesignOrders saveDesign(DesignOrders designOrder, String currentUser) {
        designOrder.setJobOwner(currentUser);
        if (designOrder.getId() != null) {
            Optional<DesignOrders> existing = repository.findById(designOrder.getId());
            if (existing.isPresent()) {
                return repository.save(designOrder);
            } else {
                throw new RuntimeException("Design order not found for update");
            }
        } else {
            
            return repository.save(designOrder);
        }
    }

    public void deleteDesign(Integer id) {
        repository.deleteById(id);
    }

     public Page<DesignOrders> getAllRecipes(String job_details,String job_owner,String process_status, String confirm_status, String assignee, LocalDate startDate, LocalDate endDate,int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        if (job_details != null && !job_details.isEmpty() || job_owner != null && !job_owner.isEmpty() || process_status != null && !process_status.isEmpty() || assignee != null && !assignee.isEmpty()) {
            return repository.findByFilters( job_details, job_owner, process_status, confirm_status, assignee,startDate,endDate, paging);
        } else {
            return repository.findAll(paging);
        }
    }

    @Transactional(readOnly = true)
    public List<String> findUniqueJobDetails(String query) {
        String searchTerm = (query != null) ? query.trim() : "";
        return repository.JobDetailsNative(searchTerm);
    }

    @Transactional(readOnly = true)
    public List<String> findUniqueJobOwner(String query) {
        String searchTerm = (query != null) ? query.trim() : "";
        return repository.JobOwnerNative(searchTerm);
    }

    @Transactional(readOnly = true)
    public List<String> findUniqueAssignee(String query) {
        String searchTerm = (query != null) ? query.trim() : "";
        return repository.AssigneeNative(searchTerm);
    }

    @Transactional(readOnly = true)
    public List<String> findUniqueProcess(String query) {
        String searchTerm = (query != null) ? query.trim() : "";
        return repository.ProcessNative(searchTerm);
    }

    @Transactional(readOnly = true)
    public List<String> findUniqueConfirm(String query) {
        String searchTerm = (query != null) ? query.trim() : "";
        return repository.ConfirmNative(searchTerm);
    }
}
