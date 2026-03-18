package com.boxcorner.boxcorner.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
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

    @Transactional
    public DesignOrders saveDesign(DesignOrders designOrder, String currentUser) {
        if (designOrder.getId() != null) {
            DesignOrders existing = repository.findById(designOrder.getId())
                    .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลสำหรับการอัปเดต ID: " + designOrder.getId()));

            if (designOrder.getRowVersion() != null && !existing.getRowVersion().equals(designOrder.getRowVersion())) {
                throw new RuntimeException("ข้อมูลถูกแก้ไขโดยผู้อื่นแล้ว กรุณาโหลดข้อมูลใหม่");
            }

            existing.setOrderDate(designOrder.getOrderDate());
            existing.setFolderName(designOrder.getFolderName());
            existing.setJobDetails(designOrder.getJobDetails());
            existing.setRemarks(designOrder.getRemarks());
            existing.setDeadlineDate(designOrder.getDeadlineDate());
            existing.setDeadlineTime(designOrder.getDeadlineTime());
            existing.setProcessStatus(designOrder.getProcessStatus());
            existing.setConfirmStatus(designOrder.getConfirmStatus());
            existing.setNoteEdit(designOrder.getNoteEdit());
            existing.setFileName(designOrder.getFileName());
            existing.setCustomerName(designOrder.getCustomerName());
            existing.setAssignee(designOrder.getAssignee());
            existing.setJobOwner(designOrder.getJobOwner());
            existing.setJoId(designOrder.getJoId());
            existing.setQtId(designOrder.getQtId());
            existing.setQpId(designOrder.getQpId());
            existing.setAssigneeFirst(designOrder.getAssigneeFirst());
            existing.setRemarkAdd(designOrder.getRemarkAdd());
            if ("กำลังดำเนินการ".equals(designOrder.getProcessStatus())) {
                if (existing.getStartDatetime() == null) {
                    existing.setStartDatetime(LocalDateTime.now(ZoneId.of("Asia/Bangkok")));
                }
            } else if (designOrder.getStartDatetime() != null) {
                existing.setStartDatetime(designOrder.getStartDatetime());
            }

            if ("เสร็จสิ้น".equals(designOrder.getProcessStatus())) {
                if (existing.getEndDatetime() == null) {
                    existing.setEndDatetime(LocalDateTime.now(ZoneId.of("Asia/Bangkok")));
                }
            } else if (designOrder.getEndDatetime() != null) {
                existing.setEndDatetime(designOrder.getEndDatetime());
            }

            return repository.save(existing);
        } else {
            designOrder.setJobOwner(currentUser);
            designOrder.setOrderTime(LocalTime.now(ZoneId.of("Asia/Bangkok")));
            return repository.save(designOrder);
        }
    }

    public void deleteDesign(Integer id) {
        repository.deleteById(id);
    }

    public Page<DesignOrders> getAllRecipes(String job_details, String job_owner, String process_status,
            String confirm_status, String assignee, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return repository.findByFilters(
                job_details, // 1. jobDetails
                job_owner, // 2. jobOwner
                assignee, // 3. assignee (สลับกลับมาตรงนี้)
                process_status, // 4. processStatus (สลับกลับมาตรงนี้)
                confirm_status, // 5. confirm
                startDate,
                endDate,
                paging);
    }

    public Page<DesignOrders> getAllRecipesDesign(String id, String folder_name, String job_details, String job_owner,
            String process_status, String confirm_status, String assignee, String jo_id, LocalDate startDate,
            LocalDate endDate,
            int page, int size, Boolean hasRemarkAdd, String remark_status) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return repository.findByAll(
                id,
                folder_name,
                job_details,
                job_owner,
                assignee,
                jo_id,
                process_status,
                confirm_status,
                startDate,
                endDate,
                hasRemarkAdd,
                remark_status,
                paging);
    }

    public Page<DesignOrders> getAllRecipesDesignSorted(String id, String folder_name, String job_details,
            String job_owner, String process_status, String confirm_status, String assignee, String jo_id,
            LocalDate startDate,
            LocalDate endDate, int page, int size, Boolean hasRemarkAdd, String remark_status) {
        Pageable paging = PageRequest.of(page, size);
        return repository.findByAllSorted(
                id,
                folder_name,
                job_details,
                job_owner,
                assignee,
                jo_id,
                process_status,
                confirm_status,
                startDate,
                endDate,
                hasRemarkAdd,
                remark_status,
                paging);
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

    public DesignOrders updateDesignComplete(int id) {
        DesignOrders existingOrder = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setProcessStatus("เสร็จสิ้น");
        existingOrder.setConfirmStatus("รอตรวจสอบ");
        existingOrder.setEndDatetime(LocalDateTime.now(ZoneId.of("Asia/Bangkok")));
        return repository.save(existingOrder);
    }

    public DesignOrders updateDesignCompleteWithFile(int id, String fileName) {
        DesignOrders existingOrder = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setProcessStatus("เสร็จสิ้น");
        existingOrder.setConfirmStatus("รอตรวจสอบ");
        existingOrder.setFileName(fileName);
        existingOrder.setEndDatetime(LocalDateTime.now(ZoneId.of("Asia/Bangkok")));
        return repository.save(existingOrder);
    }

    public DesignOrders updateDesignApprove(int id) {
        DesignOrders existingOrder = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setProcessStatus("เสร็จสิ้น");
        existingOrder.setConfirmStatus("ผ่าน");
        existingOrder.setConfirmDate(LocalDate.now());
        return repository.save(existingOrder);
    }

    public DesignOrders updateDesignEdit(int id) {
        DesignOrders existingOrder = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setProcessStatus("รอดำเนินการแก้ไข");
        existingOrder.setConfirmStatus("ไม่ผ่าน");
        return repository.save(existingOrder);
    }

    public Integer countBacklog() {
        return repository.countBacklog();
    }

    public Integer countBacklogPending(String assignee) {
        return repository.countBacklogPending(assignee);
    }

    public Integer countBacklogInProgress(String assignee) {
        return repository.countBacklogInProgress(assignee);
    }

    public Integer countBacklogCheck(String jobOwner) {
        return repository.countBacklogCheck(jobOwner);
    }

    public Integer countRequestDetails(String jobOwner) {
        return repository.countRequestDetails(jobOwner);
    }

    public Integer countBacklogCheckDe(String assignee) {
        return repository.countBacklogCheckDe(assignee);
    }

    public Integer countDetailsAdded(String assignee) {
        return repository.countDetailsAdded(assignee);
    }

    public Integer countBacklogEdit(String assignee) {
        return repository.countBacklogEdit(assignee);
    }

    public Integer countBacklogComplete() {
        return repository.countBacklogComplete();
    }
}
