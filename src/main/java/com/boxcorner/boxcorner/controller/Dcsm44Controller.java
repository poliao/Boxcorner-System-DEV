package com.boxcorner.boxcorner.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.boxcorner.boxcorner.entity.HrEmployee;
import com.boxcorner.boxcorner.repository.HrEmployeeRepository;

@RestController
@RequestMapping("/api/dcsm44")
public class Dcsm44Controller {

    @Autowired
    private HrEmployeeRepository employeeRepository;

    @GetMapping("/employees")
    public ResponseEntity<List<HrEmployee>> getEmployees() {
        return ResponseEntity.ok(employeeRepository.findAll(Sort.by(Sort.Direction.ASC, "id")));
    }

    @PostMapping("/employees")
    public ResponseEntity<HrEmployee> createEmployee(@RequestBody HrEmployee emp) {
        emp.setId(null);
        HrEmployee saved = employeeRepository.save(emp);
        // สร้างรหัสพนักงานอัตโนมัติจาก id เช่น EMP-0001
        if (saved.getCode() == null || saved.getCode().isBlank()) {
            saved.setCode(String.format("EMP-%04d", saved.getId()));
            saved = employeeRepository.save(saved);
        }
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<HrEmployee> updateEmployee(@PathVariable("id") Long id, @RequestBody HrEmployee emp) {
        return employeeRepository.findById(id).map(ex -> {
            // รหัสพนักงานกรอกเอง (อัปเดตได้ ถ้าไม่ว่าง)
            if (emp.getCode() != null && !emp.getCode().isBlank()) {
                ex.setCode(emp.getCode());
            }
            ex.setFirstName(emp.getFirstName());
            ex.setLastName(emp.getLastName());
            ex.setPositionId(emp.getPositionId());
            ex.setUsername(emp.getUsername());
            ex.setMonthlySalary(emp.getMonthlySalary());
            ex.setPersonalLeaveDays(emp.getPersonalLeaveDays());
            ex.setPersonalLeaveHours(emp.getPersonalLeaveHours());
            ex.setSickLeaveDays(emp.getSickLeaveDays());
            ex.setSickLeaveHours(emp.getSickLeaveHours());
            ex.setVacationLeaveDays(emp.getVacationLeaveDays());
            ex.setVacationLeaveHours(emp.getVacationLeaveHours());
            ex.setMaternityLeaveDays(emp.getMaternityLeaveDays());
            ex.setMaternityLeaveHours(emp.getMaternityLeaveHours());
            ex.setOrdinationLeaveDays(emp.getOrdinationLeaveDays());
            ex.setOrdinationLeaveHours(emp.getOrdinationLeaveHours());
            return ResponseEntity.ok(employeeRepository.save(ex));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable("id") Long id) {
        employeeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
