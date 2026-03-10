package com.boxcorner.boxcorner.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.SampleOrder;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.SampleOrderService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/sampleOrders")
public class SampleOrderController {

    @Autowired
    private SampleOrderService sampleOrderService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody SampleOrder sampleOrder, HttpServletRequest httpRequest) {
        try {
            return ResponseEntity
                    .ok(sampleOrderService.saveOrUpdateOrder(sampleOrder, tokenService.getCurrentUser(httpRequest)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<SampleOrder>> searchOrders(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "folderName", required = false) String folderName,
            @RequestParam(value = "jobOwner", required = false) String jobOwner,
            @RequestParam(value = "responsiblePerson", required = false) String responsiblePerson,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "jobId", required = false) String jobId,

            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,

            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortByDeadline", required = false) Boolean sortByDeadline) {
        Page<SampleOrder> result;
        if (Boolean.TRUE.equals(sortByDeadline)) {
            result = sampleOrderService.getAllSort(
                    id,
                    folderName,
                    jobOwner,
                    responsiblePerson,
                    status,
                    jobId,
                    startDate,
                    endDate,
                    page,
                    size);
        } else {
            result = sampleOrderService.getAll(
                    id,
                    folderName,
                    jobOwner,
                    responsiblePerson,
                    status,
                    jobId,
                    startDate,
                    endDate,
                    page,
                    size);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/searchDetail")
    public ResponseEntity<Page<SampleOrder>> searchOrdersDetail(
            // เพิ่ม value = "..." ให้ครบทุกตัวครับ
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "folderName", required = false) String folderName,
            @RequestParam(value = "jobOwner", required = false) String jobOwner,
            @RequestParam(value = "responsiblePerson", required = false) String responsiblePerson,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "jobId", required = false) String jobId,

            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,

            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortByDeadline", required = false) Boolean sortByDeadline) {
        Page<SampleOrder> result;
        if (Boolean.TRUE.equals(sortByDeadline)) {
            result = sampleOrderService.getAllDetailSort(
                    id,
                    folderName,
                    jobOwner,
                    responsiblePerson,
                    status,
                    jobId,
                    startDate,
                    endDate,
                    page,
                    size);
        } else {
            result = sampleOrderService.getAllDetail(
                    id,
                    folderName,
                    jobOwner,
                    responsiblePerson,
                    status,
                    jobId,
                    startDate,
                    endDate,
                    page,
                    size);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/searchDetailBack")
    public ResponseEntity<Page<SampleOrder>> searchOrdersDetailBack(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "folderName", required = false) String folderName,
            @RequestParam(value = "jobOwner", required = false) String jobOwner,
            @RequestParam(value = "responsiblePerson", required = false) String responsiblePerson,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "jobId", required = false) String jobId,

            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,

            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortByDeadline", required = false) Boolean sortByDeadline) {
        Page<SampleOrder> result;
        if (Boolean.TRUE.equals(sortByDeadline)) {
            result = sampleOrderService.getAllDetailBackSort(
                    id,
                    folderName,
                    jobOwner,
                    responsiblePerson,
                    status,
                    jobId,
                    startDate,
                    endDate,
                    page,
                    size);
        } else {
            result = sampleOrderService.getAllDetailBack(
                    id,
                    folderName,
                    jobOwner,
                    responsiblePerson,
                    status,
                    jobId,
                    startDate,
                    endDate,
                    page,
                    size);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/searchVerify")
    public ResponseEntity<Page<SampleOrder>> getAllVerify(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "folderName", required = false) String folderName,
            @RequestParam(value = "jobOwner", required = false) String jobOwner,
            @RequestParam(value = "responsiblePerson", required = false) String responsiblePerson,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "jobId", required = false) String jobId,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortByDeadline", required = false) Boolean sortByDeadline) {

        Page<SampleOrder> result;
        if (Boolean.TRUE.equals(sortByDeadline)) {
            result = sampleOrderService.getAllVerifySort(
                    id,
                    folderName,
                    jobOwner,
                    responsiblePerson,
                    status,
                    jobId,
                    startDate,
                    endDate,
                    page,
                    size);
        } else {
            result = sampleOrderService.getAllVerify(
                    id,
                    folderName,
                    jobOwner,
                    responsiblePerson,
                    status,
                    jobId,
                    startDate,
                    endDate,
                    page,
                    size);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/getById")
    public ResponseEntity<SampleOrder> getById(@RequestParam("id") Integer id) {
        return sampleOrderService.getSampleOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/countBacklog")
    public ResponseEntity<Integer> getUniqueStatus() {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("รอผู้รับผิดชอบอนุมัติ", null));
    }

    @GetMapping("/countBacklogWaitProcess")
    public ResponseEntity<Integer> getUniqueStatusWaitProcess(HttpServletRequest httpRequest) {
        return ResponseEntity
                .ok(sampleOrderService.countBacklogStatus("งานภายใน", tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogShif")
    public ResponseEntity<Integer> getUniqueStatusShif(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                sampleOrderService.countBacklogSalesStatus("ขอเลื่อนวันส่ง", tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogApproveShif")
    public ResponseEntity<Integer> getUniqueStatusCheck(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                sampleOrderService.countBacklogStatus("อนุมัติขอเลื่อนส่ง", tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogApproveShifAdmin")
    public ResponseEntity<Integer> getUniqueStatusCheckAdmin(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                sampleOrderService.countBacklogStatusAdmin("อนุมัติขอเลื่อนส่ง",
                        tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogNotApproveShif")
    public ResponseEntity<Integer> countBacklogNotApproveShif(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                sampleOrderService.countBacklogStatus("ไม่อนุมัติเลื่อนส่ง", tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogClearFile")
    public ResponseEntity<Integer> countBacklogClearFile(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("จัดส่งได้ รอเคลียร์ไฟล์",
                tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogInClearFile")
    public ResponseEntity<Integer> countBacklogInClearFile(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                sampleOrderService.countBacklogStatus("กำลังเคลียร์ไฟล์", tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogCheckFile")
    public ResponseEntity<Integer> countBacklogCheckFile(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("ไฟล์เสร็จ รอตรวจสอบไฟล์",
                tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countCheckFile")
    public ResponseEntity<Integer> countCheckFile() {
        return ResponseEntity.ok(sampleOrderService.countStatus("ไฟล์เสร็จ รอตรวจสอบไฟล์"));
    }

    @GetMapping("/countBacklogWaitSample")
    public ResponseEntity<Integer> countBacklogWaitSample(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("ไฟล์ถูกต้อง รอขึ้นตัวอย่าง",
                tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogSendBackSample")
    public ResponseEntity<Integer> countBacklogSendBackSample(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                sampleOrderService.countBacklogStatus("ขึ้นตัวอย่างแล้ว", tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogSendBackSampleBack")
    public ResponseEntity<Integer> countBacklogSendBackSampleBack() {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("ขึ้นตัวอย่างแล้ว", null));
    }

    @GetMapping("/countBacklogSendBack")
    public ResponseEntity<Integer> countBacklogSendBack(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("ไฟล์ถูกต้อง ไม่ต้องขึ้นตัวอย่าง",
                tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogApproveSample")
    public ResponseEntity<Integer> countBacklogApproveSample(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("สำเร็จ รออนุมัติไปตารางรอผลิต",
                tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogApproveSampleAdmin")
    public ResponseEntity<Integer> countBacklogApproveSampleAdmin(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatusAdmin("สำเร็จ รออนุมัติไปตารางรอผลิต",
                tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogSampleCheck")
    public ResponseEntity<Integer> countBacklogSampleCheck(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                sampleOrderService.countBacklogStatus("รอเจ้าของงานตรวจสอบ", tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogSampleCheckAdmin")
    public ResponseEntity<Integer> countBacklogSampleCheckAdmin(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                sampleOrderService.countBacklogStatusAdmin("รอเจ้าของงานตรวจสอบ",
                        tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countSupplierReturnedAdmin")
    public ResponseEntity<Integer> countSupplierReturnedAdmin(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                sampleOrderService.countBacklogStatusAdmin("งาน Supplier ส่งกลับแล้ว",
                        tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countEditSample")
    public ResponseEntity<Integer> countEditSample(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                sampleOrderService.countBacklogStatus("รอเคลียร์ไฟล์ใหม่", tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogSendSupplier")
    public ResponseEntity<Integer> countBacklogSendSupplier(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                sampleOrderService.countBacklogStatus("ส่ง Supplier", tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogWaitReturn")
    public ResponseEntity<Integer> countBacklogWaitReturn(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                sampleOrderService.countBacklogStatus("รับงานแล้วรอส่งกลับ", tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countWaitPending")
    public ResponseEntity<Integer> countWaitPending(HttpServletRequest httpRequest) {
        return ResponseEntity
                .ok(sampleOrderService.countBacklogStatus("รอดำเนินการ", tokenService.getCurrentUser(httpRequest)));
    }
}