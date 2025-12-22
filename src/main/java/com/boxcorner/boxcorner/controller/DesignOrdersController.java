package com.boxcorner.boxcorner.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
    public ResponseEntity<DesignOrders> getById(@RequestParam Integer id) {
        return service.getDesignById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/save")
    public ResponseEntity<DesignOrders> save(@RequestBody DesignOrders designOrder,HttpServletRequest httpRequest) {
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
            @RequestParam(required = false) String job_details,
            @RequestParam(required = false) String job_owner,
            @RequestParam(required = false) String process_status,
            @RequestParam(required = false) String confirm_status,
            @RequestParam(required = false) String assignee,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Page<DesignOrders> pageDesignOrders = service.getAllRecipes(job_details, job_owner, process_status, confirm_status, assignee, startDate, endDate, page, size);
            return ResponseEntity.ok(pageDesignOrders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/dropdownjobdetails")
    public ResponseEntity<List<String>> getUniqueJobDetails(@RequestParam(defaultValue = "") String query){
        return ResponseEntity.ok(service.findUniqueJobDetails(query));
    }

    @GetMapping("/dropdownjobowner")
    public ResponseEntity<List<String>> getUniqueJobOwner(@RequestParam(defaultValue = "") String query){
        return ResponseEntity.ok(service.findUniqueJobOwner(query));
    }

    @GetMapping("/dropdownassignee")
    public ResponseEntity<List<String>> getUniqueAssignee(@RequestParam(defaultValue = "") String query){
        return ResponseEntity.ok(service.findUniqueAssignee(query));
    }

    @GetMapping("/dropdownprocess")
    public ResponseEntity<List<String>> getUniqueProcess(@RequestParam(defaultValue = "") String query){
        return ResponseEntity.ok(service.findUniqueProcess(query));
    }

    @GetMapping("/dropdownconfirm")
    public ResponseEntity<List<String>> getUniqueConfirm(@RequestParam(defaultValue = "") String query){
        return ResponseEntity.ok(service.findUniqueConfirm(query));
    }
}
