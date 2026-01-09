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
    public ResponseEntity<SampleOrder> createOrder(@RequestBody SampleOrder sampleOrder , HttpServletRequest httpRequest) {
        SampleOrder newOrder = sampleOrderService.saveOrUpdateOrder(sampleOrder,tokenService.getCurrentUser(httpRequest));
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<SampleOrder>> searchOrders(
            @RequestParam(value = "folderName", required = false) String folderName,
            @RequestParam(value = "jobOwner", required = false) String jobOwner,
            @RequestParam(value = "responsiblePerson", required = false) String responsiblePerson,
            @RequestParam(value = "status", required = false) String status,

            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,

            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Page<SampleOrder> result = sampleOrderService.getAll(
                folderName,
                jobOwner,
                responsiblePerson,
                status,
                startDate,
                endDate,
                page,
                size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/searchDetail")
    public ResponseEntity<Page<SampleOrder>> searchOrdersDetail(
            // เพิ่ม value = "..." ให้ครบทุกตัวครับ
            @RequestParam(value = "folderName", required = false) String folderName,
            @RequestParam(value = "jobOwner", required = false) String jobOwner,
            @RequestParam(value = "responsiblePerson", required = false) String responsiblePerson,
            @RequestParam(value = "status", required = false) String status,

            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,

            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Page<SampleOrder> result = sampleOrderService.getAllDetail(
                folderName,
                jobOwner,
                responsiblePerson,
                status,
                startDate,
                endDate,
                page,
                size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/getById")
    public ResponseEntity<SampleOrder> getById(@RequestParam("id") Integer id) {
        return sampleOrderService.getSampleOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/countBacklog")
    public ResponseEntity<Integer> getUniqueStatus(){
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("รอผู้รับผิดชอบอนุมัติ"));
    }

    @PutMapping("/updateAssign")
    public ResponseEntity<SampleOrder> updateAssign(@RequestParam("id") Integer id, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "รอดำเนินการ",tokenService.getCurrentUser(httpRequest)));
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
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "สำเร็จ ส่งตรวจสอบ", null));
    }

    @PutMapping("/updateFileChecked")
    public ResponseEntity<SampleOrder> updateFileChecked(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "ไฟล์ถูกต้อง", null));
    }

    @PutMapping("/updateEditFile")
    public ResponseEntity<SampleOrder> updateEditFile(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "แก้ไขไฟล์", null));
    }

    @PutMapping("/updateConfirmSample")
    public ResponseEntity<SampleOrder> updateConfirmSample(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "ผ่าน", null));
    }

    @PutMapping("/updateEditConfirmSample")
    public ResponseEntity<SampleOrder> updateEditConfirmSample(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(sampleOrderService.updatesampleOrderStatus(id, "แก้ไข", null));
    }

    @GetMapping("/countBacklogShif")
    public ResponseEntity<Integer> getUniqueStatusShif(){
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("ขอเลื่อนวันส่ง"));
    }

    @GetMapping("/countBacklogApproveShif")
    public ResponseEntity<Integer> getUniqueStatusCheck(){
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("อนุมัติเลื่อนวันส่ง"));
    }

    @GetMapping("/countBacklogNotApproveShif")
    public ResponseEntity<Integer> countBacklogNotApproveShif(){
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("ไม่อนุมัติเลื่อนส่ง"));
    }

    @GetMapping("/countBacklogClearFile")
    public ResponseEntity<Integer> countBacklogClearFile(){
        return ResponseEntity.ok(sampleOrderService.countBacklogStatus("จัดส่งได้ รอเคลียร์ไฟล์"));
    }


}