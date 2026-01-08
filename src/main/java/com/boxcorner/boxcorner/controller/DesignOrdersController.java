package com.boxcorner.boxcorner.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.DesignOrders;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.DesignOrdersService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/designs")
public class DesignOrdersController {

    @Autowired
    private DesignOrdersService service;

    @Autowired
    private TokenService tokenService;

    @GetMapping("/getById")
    public ResponseEntity<DesignOrders> getById(@RequestParam("id") Integer id) {
        return service.getDesignById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/save")
    public ResponseEntity<DesignOrders> save(@RequestBody DesignOrders designOrder, HttpServletRequest httpRequest) {
        String currentUser = tokenService.getCurrentUser(httpRequest);
        return ResponseEntity.ok(service.saveDesign(designOrder,currentUser));
    }

    @DeleteMapping("/deleteByid")
    public ResponseEntity<Void> delete(@RequestBody Integer id) {
        service.deleteDesign(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/list")
    public ResponseEntity<?> getAllRecipes(
            @RequestParam(value = "job_details", required = false) String job_details,
            @RequestParam(value = "job_owner", required = false) String job_owner,
            @RequestParam(value = "process_status", required = false) String process_status,
            @RequestParam(value = "confirm_status", required = false) String confirm_status,
            @RequestParam(value = "assignee", required = false) String assignee,
            @RequestParam(value = "startDate", required = false) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) LocalDate endDate,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        try {
            Page<DesignOrders> pageDesignOrders = service.getAllRecipes(job_details, job_owner, process_status, confirm_status, assignee, startDate, endDate, page, size);
            return ResponseEntity.ok(pageDesignOrders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/listDesign")
    public ResponseEntity<?> getAllDesign(
            @RequestParam(value = "job_details", required = false) String job_details,
            @RequestParam(value = "job_owner", required = false) String job_owner,
            @RequestParam(value = "process_status", required = false) String process_status,
            @RequestParam(value = "confirm_status", required = false) String confirm_status,
            @RequestParam(value = "assignee", required = false) String assignee,
            @RequestParam(value = "startDate", required = false) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) LocalDate endDate,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        try {
            Page<DesignOrders> pageDesignOrders = service.getAllRecipesDesign(job_details, job_owner, process_status, confirm_status, assignee, startDate, endDate, page, size);
            return ResponseEntity.ok(pageDesignOrders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/dropdownjobdetails")
    public ResponseEntity<List<String>> getUniqueJobDetails(@RequestParam(value = "query", defaultValue = "") String query){
        return ResponseEntity.ok(service.findUniqueJobDetails(query));
    }

    @GetMapping("/dropdownjobowner")
    public ResponseEntity<List<String>> getUniqueJobOwner(@RequestParam(value = "query", defaultValue = "") String query){
        return ResponseEntity.ok(service.findUniqueJobOwner(query));
    }

    @GetMapping("/dropdownassignee")
    public ResponseEntity<List<String>> getUniqueAssignee(@RequestParam(value = "query", defaultValue = "") String query){
        return ResponseEntity.ok(service.findUniqueAssignee(query));
    }

    @GetMapping("/dropdownprocess")
    public ResponseEntity<List<String>> getUniqueProcess(@RequestParam(value = "query", defaultValue = "") String query){
        return ResponseEntity.ok(service.findUniqueProcess(query));
    }

    @GetMapping("/dropdownconfirm")
    public ResponseEntity<List<String>> getUniqueConfirm(@RequestParam(value = "query", defaultValue = "") String query){
        return ResponseEntity.ok(service.findUniqueConfirm(query));
    }

    @PutMapping("/updateStatus")
    public ResponseEntity<DesignOrders> update(@RequestParam("id") Integer id, HttpServletRequest httpRequest) {
        String currentUser = tokenService.getCurrentUser(httpRequest);
        return ResponseEntity.ok(service.updateDesign(id,currentUser));
    }

    @PutMapping("/updateStatusWork")
    public ResponseEntity<DesignOrders> updateWork(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(service.updateDesignWork(id));
    }

    @PutMapping("/updateStatusComplete")
    public ResponseEntity<DesignOrders> updateComplete(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(service.updateDesignComplete(id));
    }

    @PutMapping("/updateStatusApprove")
    public ResponseEntity<DesignOrders> updateApprove(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(service.updateDesignApprove(id));
    }

    @PutMapping("/updateStatusEdit")
    public ResponseEntity<DesignOrders> updateEdit(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(service.updateDesignEdit(id));
    }

    @GetMapping("/countBacklog")
    public ResponseEntity<Integer> getUniqueStatus(){
        return ResponseEntity.ok(service.countBacklog());
    } 

    @GetMapping("/countBacklogPending")
    public ResponseEntity<Integer> countBacklogPending(){
        return ResponseEntity.ok(service.countBacklogPending());
    } 

    @GetMapping("/countBacklogInProgress")
    public ResponseEntity<Integer> countBacklogInProgress(){
        return ResponseEntity.ok(service.countBacklogInProgress());
    }

    @GetMapping("/countBacklogCheck")
    public ResponseEntity<Integer> countBacklogCheck(){
        return ResponseEntity.ok(service.countBacklogCheck());
    }

    @GetMapping("/countBacklogEdit")
    public ResponseEntity<Integer> countBacklogEdit(){
        return ResponseEntity.ok(service.countBacklogEdit());
    }

    @GetMapping("/countBacklogComplete")
    public ResponseEntity<Integer> countBacklogComplete(){
        return ResponseEntity.ok(service.countBacklogComplete());
    }
}
