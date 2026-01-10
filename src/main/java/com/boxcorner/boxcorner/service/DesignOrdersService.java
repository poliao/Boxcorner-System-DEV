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
            designOrder.setAssignee("รอผู้รับผิดชอบยืนยัน");
            return repository.save(designOrder);
        }
    }

    public void deleteDesign(Integer id) {
        repository.deleteById(id);
    }

    public Page<DesignOrders> getAllRecipes(String job_details, String job_owner, String process_status, String confirm_status, String assignee, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return repository.findByFilters(
            job_details,    // 1. jobDetails
            job_owner,      // 2. jobOwner
            assignee,       // 3. assignee (สลับกลับมาตรงนี้)
            process_status, // 4. processStatus (สลับกลับมาตรงนี้)
            confirm_status, // 5. confirm
            startDate,      // 6. startDate
            endDate,        // 7. endDate
            paging
        );
    }

    public Page<DesignOrders> getAllRecipesDesign(String id, String job_details, String job_owner, String process_status, String confirm_status, String assignee, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return repository.findByAll(
            id,             // 1. id
            job_details,    // 2. jobDetails
            job_owner,      // 3. jobOwner
            assignee,       // 4. assignee
            process_status, // 5. processStatus
            confirm_status, // 6. confirm
            startDate,      // 7. startDate
            endDate,        
            paging
        );
    }

    public Page<DesignOrders> getAllRecipesDesignSorted(String id, String job_details, String job_owner, String process_status, String confirm_status, String assignee, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable paging = PageRequest.of(page, size);
        return repository.findByAllSorted(
            id,             // 1. id
            job_details,    // 2. jobDetails
            job_owner,      // 3. jobOwner
            assignee,       // 4. assignee
            process_status, // 5. processStatus
            confirm_status, // 6. confirm
            startDate,      // 7. startDate
            endDate,        // 8. endDate
            paging
        );
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

   public DesignOrders updateDesign(int id, String currentUser) {

        DesignOrders existingOrder = repository.findById(id).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));

        if (currentUser != null && !currentUser.isEmpty()) {
            existingOrder.setAssignee(currentUser);
        }

        existingOrder.setProcessStatus("รอดำเนินการ");
        existingOrder.setConfirmStatus("รอดำเนินการ");
        return repository.save(existingOrder);
    }

    public DesignOrders updateDesignWork(int id) {
        DesignOrders existingOrder = repository.findById(id).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setProcessStatus("กำลังดำเนินการ");
        existingOrder.setConfirmStatus("กำลังดำเนินการ");
        return repository.save(existingOrder);
    }

    public DesignOrders updateDesignComplete(int id) {
        DesignOrders existingOrder = repository.findById(id).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setProcessStatus("เสร็จสิ้น");
        existingOrder.setConfirmStatus("รอตรวจสอบ");
        return repository.save(existingOrder);
    }

    public DesignOrders updateDesignApprove(int id) {
        DesignOrders existingOrder = repository.findById(id).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setProcessStatus("เสร็จสิ้น");
        existingOrder.setConfirmStatus("ผ่าน");
        existingOrder.setConfirmDate(LocalDate.now());
        return repository.save(existingOrder);
    }

    public DesignOrders updateDesignEdit(int id) {
        DesignOrders existingOrder = repository.findById(id).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setProcessStatus("รอดำเนินการแก้ไข");
        existingOrder.setConfirmStatus("ไม่ผ่าน");
        return repository.save(existingOrder);
    }

    public Integer countBacklog() {
        return repository.countBacklog();
    }

    public Integer countBacklogPending(){
        return repository.countBacklogPending();
    }

    public Integer countBacklogInProgress() {
        return repository.countBacklogInProgress();
    }

    public Integer countBacklogCheck(){
        return repository.countBacklogCheck();
    }
    
    public Integer countBacklogEdit(){
        return repository.countBacklogEdit();
    }

    public Integer countBacklogComplete(){
        return repository.countBacklogComplete();
    }
}
