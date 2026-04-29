package com.boxcorner.boxcorner.controller;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

import com.boxcorner.boxcorner.entity.ProductionOrder;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.ProductionOrderService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/production")
public class ProductionOrderController {

    @Autowired
    private ProductionOrderService productionOrderService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody ProductionOrder productionOrder, HttpServletRequest httpRequest) {
        try {
            ProductionOrder savedData = productionOrderService.save(productionOrder,tokenService.getCurrentUser(httpRequest));
            return ResponseEntity.ok(savedData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getById(@RequestParam("id") Integer id) {
        try {
            ProductionOrder data = productionOrderService.findById(id);
            if (data != null) {
                return ResponseEntity.ok(data);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving data: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductionOrder>> search(
            @RequestParam(required = false, name = "id") Integer id,
            @RequestParam(required = false, name = "jobId") String jobId,
            @RequestParam(required = false, name = "folderName") String folderName,
            @RequestParam(required = false, name = "jobOwner") String jobOwner,
            @RequestParam(required = false, name = "startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false, name = "endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, name = "deadlineTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime deadlineTime,
            @RequestParam(required = false, name = "jobStatus") String jobStatus,
            @RequestParam(required = false, name = "processStatus") String processStatus,
            @RequestParam(required = false, name = "operatorName") String operatorName,
            @RequestParam(required = false, name = "moldStatus") String moldStatus,
            @RequestParam(required = false, name = "jobType") String jobType,
            @RequestParam(required = false, name = "postpone") String postpone,
            @RequestParam(defaultValue = "0", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size,
            @RequestParam(value = "sortByDeadline", required = false) Boolean sortByDeadline) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductionOrder> result;
        if (Boolean.TRUE.equals(sortByDeadline)) {
            result = productionOrderService.findByFiltersSort(
                    id, jobId, folderName, jobOwner, startDate, endDate, deadlineTime,
                    jobStatus, processStatus, operatorName, moldStatus, jobType, postpone, pageable);
        } else {
            result = productionOrderService.findByFilters(
                    id, jobId, folderName, jobOwner, startDate, endDate, deadlineTime,
                    jobStatus, processStatus, operatorName, moldStatus, jobType, postpone, pageable);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/searchProduct")
    public ResponseEntity<Page<ProductionOrder>> searchProduct(
            @RequestParam(required = false, name = "id") Integer id,
            @RequestParam(required = false, name = "jobId") String jobId,
            @RequestParam(required = false, name = "folderName") String folderName,
            @RequestParam(required = false, name = "jobOwner") String jobOwner,
            @RequestParam(required = false, name = "startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false, name = "endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, name = "deadlineTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime deadlineTime,
            @RequestParam(required = false, name = "jobStatus") String jobStatus,
            @RequestParam(required = false, name = "processStatus") String processStatus,
            @RequestParam(required = false, name = "operatorName") String operatorName,
            @RequestParam(required = false, name = "moldStatus") String moldStatus,
            @RequestParam(required = false, name = "jobType") String jobType,
            @RequestParam(defaultValue = "0", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size,
            @RequestParam(value = "sortByDeadline", required = false) Boolean sortByDeadline) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductionOrder> result;
        if (Boolean.TRUE.equals(sortByDeadline)) {
            result = productionOrderService.findByProductionFiltersSort(
                    id, jobId, folderName, jobOwner, startDate, endDate, deadlineTime,
                    jobStatus, processStatus, operatorName, moldStatus, jobType, pageable);
        } else {
            result = productionOrderService.findByProductionFilters(
                    id, jobId, folderName, jobOwner, startDate, endDate, deadlineTime,
                    jobStatus, processStatus, operatorName, moldStatus, jobType, pageable);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/searchProductCheck")
    public ResponseEntity<Page<ProductionOrder>> searchProductCheck(
            @RequestParam(required = false, name = "id") Integer id,
            @RequestParam(required = false, name = "jobId") String jobId,
            @RequestParam(required = false, name = "folderName") String folderName,
            @RequestParam(required = false, name = "jobOwner") String jobOwner,
            @RequestParam(required = false, name = "startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false, name = "endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, name = "deadlineTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime deadlineTime,
            @RequestParam(required = false, name = "jobStatus") String jobStatus,
            @RequestParam(required = false, name = "processStatus") String processStatus,
            @RequestParam(required = false, name = "operatorName") String operatorName,
            @RequestParam(required = false, name = "moldStatus") String moldStatus,
            @RequestParam(required = false, name = "jobType") String jobType,
            @RequestParam(required = false, name = "inspector") String inspector,
            @RequestParam(required = false, name = "dalivery") Boolean dalivery,
            @RequestParam(defaultValue = "0", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size,
            @RequestParam(value = "sortByDeadline", required = false) Boolean sortByDeadline) {
        Pageable pageable = PageRequest.of(page, size);

        Page<ProductionOrder> result;
        if (Boolean.TRUE.equals(sortByDeadline)) {
            result = productionOrderService.findByProductionCheckSort(
                    id,jobId, folderName, jobOwner, startDate, endDate, deadlineTime,
                    jobStatus, processStatus, operatorName, moldStatus, jobType, inspector, pageable);
            return ResponseEntity.ok(result);
        } else {
            result = productionOrderService.findByProductionCheck(
                    id,jobId, folderName, jobOwner, startDate, endDate, deadlineTime,
                    jobStatus, processStatus, operatorName, moldStatus, jobType, inspector, dalivery, pageable);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/countBacklog")
    public ResponseEntity<Integer> getUniqueStatus(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(productionOrderService.countBacklog(tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogHPlanning")
    public ResponseEntity<Integer> getUniqueStatusHPlanning() {
        return ResponseEntity.ok(productionOrderService.countBacklogHPlanning());
    }

    @GetMapping("/countBacklogCheck")
    public ResponseEntity<Integer> getUniqueStatusCheck() {
        return ResponseEntity.ok(productionOrderService.countBacklogCheck());
    }

    @GetMapping("/countBacklogMold")
    public ResponseEntity<Integer> getUniqueStatusMold() {
        return ResponseEntity.ok(productionOrderService.countBacklogMold());
    }

    @GetMapping("/countProcessStatus")
    public ResponseEntity<Integer> countBacklogProcessStatus(@RequestParam("processStatus") String processStatus,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(productionOrderService.countBacklogProcessStatus(processStatus,
                tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countProcessStatusAll")
    public ResponseEntity<Integer> countBacklogProcessStatus(@RequestParam("processStatus") String processStatus) {
        return ResponseEntity.ok(productionOrderService.countBacklogProcessStatus(processStatus));
    }

    @GetMapping("/countBacklogDelivery")
    public ResponseEntity<Integer> countBacklogDelivery() {
        return ResponseEntity.ok(productionOrderService.countBacklogDelivery());
    }

    @GetMapping("/countBacklogMoldStatus")
    public ResponseEntity<Integer> countBacklogMoldStatus(@RequestParam("moldStatus") String moldStatus) {
        return ResponseEntity.ok(productionOrderService.countBacklogMoldStatus(moldStatus));
    }

    @GetMapping("/countBacklogSupplier")
    public ResponseEntity<Integer> countBacklogSupplier(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(productionOrderService.countBacklogSupplier(tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogKeepSupplier")
    public ResponseEntity<Integer> countBacklogKeepSupplier(HttpServletRequest httpRequest) {
        return ResponseEntity
                .ok(productionOrderService.countBacklogKeepSupplier(tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/countBacklogMachine")
    public ResponseEntity<Integer> countBacklogMachine() {
        return ResponseEntity.ok(productionOrderService.countBacklogMachine());
    }

    @GetMapping("/countBacklogPostpone")
    public ResponseEntity<Integer> countBacklogPostpone(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(productionOrderService.countBacklogPostpone(tokenService.getCurrentUser(httpRequest)));
    }

    @GetMapping("/searchSample")
    public ResponseEntity<Page<ProductionOrder>> searchSample(
            @RequestParam(required = false, name = "id") Integer id,
            @RequestParam(required = false, name = "folderName") String folderName,
            @RequestParam(required = false, name = "jobOwner") String jobOwner,
            @RequestParam(required = false, name = "startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false, name = "endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, name = "deadlineTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime deadlineTime,
            @RequestParam(required = false, name = "jobStatus") String jobStatus,
            @RequestParam(required = false, name = "processStatus") String processStatus,
            @RequestParam(required = false, name = "operatorName") String operatorName,
            @RequestParam(required = false, name = "moldStatus") String moldStatus,
            @RequestParam(required = false, name = "jobType") String jobType,
            @RequestParam(required = false, name = "postpone") String postpone,
            @RequestParam(defaultValue = "0", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size,
            @RequestParam(value = "sortByDeadline", required = false) Boolean sortByDeadline) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductionOrder> result;
        result = productionOrderService.findByFiltersSample(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, postpone, pageable);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/updateDataDalivery")
    public ResponseEntity<ProductionOrder> updateDataDalivery(@RequestParam("id") Integer id,
            @RequestParam("dataDalivery") Boolean dataDalivery) {
        return ResponseEntity.ok(productionOrderService.updateDataDalivery(id, dataDalivery));
    }

}