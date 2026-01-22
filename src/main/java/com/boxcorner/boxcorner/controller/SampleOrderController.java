package com.boxcorner.boxcorner.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.SampleOrder;
import com.boxcorner.boxcorner.entity.dto.SampleReqDTO;
import com.boxcorner.boxcorner.repository.SampleOrderRepository;
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

    @Autowired
    private SampleOrderRepository sampleOrderRepository;;

    @PostMapping("/create")
    public ResponseEntity<SampleOrder> createOrder(@RequestBody SampleOrder sampleOrder,
            HttpServletRequest httpRequest) {
        SampleOrder newOrder = sampleOrderService.saveOrUpdateOrder(sampleOrder,
                tokenService.getCurrentUser(httpRequest));
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<SampleOrder>> searchOrders(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "folderName", required = false) String folderName,
            @RequestParam(value = "jobOwner", required = false) String jobOwner,
            @RequestParam(value = "responsiblePerson", required = false) String responsiblePerson,
            @RequestParam(value = "status", required = false) String status,

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
                    startDate,
                    endDate,
                    page,
                    size);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/searchDetailBack")
    public ResponseEntity<Page<SampleOrder>> searchOrdersDetailBack(
            // เพิ่ม value = "..." ให้ครบทุกตัวครับ
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "folderName", required = false) String folderName,
            @RequestParam(value = "jobOwner", required = false) String jobOwner,
            @RequestParam(value = "responsiblePerson", required = false) String responsiblePerson,
            @RequestParam(value = "status", required = false) String status,

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
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortByDeadline", required = false) Boolean sortByDeadline) {


        Page<SampleOrder> result ;
        if (Boolean.TRUE.equals(sortByDeadline)) {
            result= sampleOrderService.getAllVerifySort(
                id,
                folderName,
                jobOwner,
                responsiblePerson,
                status,
                startDate,
                endDate,
                page,
                size);
        }else{
            result= sampleOrderService.getAllVerify(
                id,
                folderName,
                jobOwner,
                responsiblePerson,
                status,
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
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("รอผู้รับผิดชอบอนุมัติ",null));
    }

    @PutMapping("/updateAssign")
    public ResponseEntity<SampleOrder> updateAssign(@RequestParam("id") Integer id, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "รอดำเนินการ",
                tokenService.getCurrentUser(httpRequest)));
    }

    @PutMapping("/updateStatusDeliver")
    public ResponseEntity<SampleOrder> updateDeliver(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "จัดส่งได้ รอเคลียร์ไฟล์", null));
    }

    @PutMapping("/updateStatusNotDeliver")
    public ResponseEntity<SampleOrder> updateNotDeliver(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "จัดส่งไม่ทัน ขอเลื่อนเวลา", null));
    }

    @PutMapping("/updateStatusClearFile")
    public ResponseEntity<SampleOrder> updateClearFile(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "กำลังเคลียร์ไฟล์", null));
    }

    @PutMapping("/updateStatusInspection")
    public ResponseEntity<SampleOrder> updateInspection(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "ไฟล์เสร็จ รอตรวจสอบไฟล์", null));
    }

    @PutMapping("/updateStatusSamples")
    public ResponseEntity<SampleOrder> updateSamples(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "ขึ้นตัวอย่างแล้ว", null));
    }

    @PutMapping("/updateStatusSucsess")
    public ResponseEntity<SampleOrder> updateSucsess(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "สำเร็จ รออนุมัติไปตารางรอผลิต", null));
    }

    @PutMapping("/updateStatusCancel")
    public ResponseEntity<SampleOrder> updateCancel(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "ยกเลิก", null));
    }

    @PutMapping("/updateFileChecked")
    public ResponseEntity<SampleOrder> updateFileChecked(@RequestParam("id") Integer id) {
        String status = null;
        SampleOrder sampleOrder = sampleOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        if (sampleOrder.getIsCreateSample() == true) {
            status = "ไฟล์ถูกต้อง รอขึ้นตัวอย่าง";
        } else {
            status = "ไฟล์ถูกต้อง ไม่ต้องขึ้นตัวอย่าง";
        }
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, status, null));
    }

    @PutMapping("/updateEditFile")
    public ResponseEntity<SampleOrder> updateEditFile(@RequestBody SampleReqDTO jsonBody) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(jsonBody.getId(), "รอเจ้าของงานตรวจสอบ", null));
    }

    @PutMapping("/updateConfirmSample")
    public ResponseEntity<SampleOrder> updateConfirmSample(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "ผ่าน", null));
    }

    @PutMapping("/updateEditConfirmSample")
    public ResponseEntity<SampleOrder> updateEditConfirmSample(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "แก้ไข", null));
    }

    @GetMapping("/countBacklogWaitProcess")
    public ResponseEntity<Integer> getUniqueStatusWaitProcess(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("รอดำเนินการ",tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogShif")
    public ResponseEntity<Integer> getUniqueStatusShif(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogSalesStatus("ขอเลื่อนวันส่ง",tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogApproveShif")
    public ResponseEntity<Integer> getUniqueStatusCheck(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("อนุมัติเลื่อนวันส่ง",tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogNotApproveShif")
    public ResponseEntity<Integer> countBacklogNotApproveShif(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("ไม่อนุมัติเลื่อนส่ง",tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogClearFile")
    public ResponseEntity<Integer> countBacklogClearFile(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("จัดส่งได้ รอเคลียร์ไฟล์",tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogInClearFile")
    public ResponseEntity<Integer> countBacklogInClearFile(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("กำลังเคลียร์ไฟล์",tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogCheckFile")
    public ResponseEntity<Integer> countBacklogCheckFile(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("ไฟล์เสร็จ รอตรวจสอบไฟล์",tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countCheckFile")
    public ResponseEntity<Integer> countCheckFile() {
        return ResponseEntity.ok(sampleOrderService.countStatus("ไฟล์เสร็จ รอตรวจสอบไฟล์"));
    }

    @GetMapping("/countBacklogWaitSample")
    public ResponseEntity<Integer> countBacklogWaitSample(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("ไฟล์ถูกต้อง รอขึ้นตัวอย่าง",tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogSendBackSample")
    public ResponseEntity<Integer> countBacklogSendBackSample(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("ขึ้นตัวอย่างแล้ว",tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogSendBackSampleBack")
    public ResponseEntity<Integer> countBacklogSendBackSampleBack() {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("ขึ้นตัวอย่างแล้ว",null));
    }
    

    @GetMapping("/countBacklogSendBack")
    public ResponseEntity<Integer> countBacklogSendBack(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("ไฟล์ถูกต้อง ไม่ต้องขึ้นตัวอย่าง",tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogApproveSample")
    public ResponseEntity<Integer> countBacklogApproveSample(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("สำเร็จ รออนุมัติไปตารางรอผลิต",tokenService.getCurrentUser(httpRequest)));
    }
}