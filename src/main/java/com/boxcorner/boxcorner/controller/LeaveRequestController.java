package com.boxcorner.boxcorner.controller;

import java.time.LocalDate;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.boxcorner.boxcorner.entity.HrEmployee;
import com.boxcorner.boxcorner.entity.HrLeaveRequest;
import com.boxcorner.boxcorner.entity.HrPosition;
import com.boxcorner.boxcorner.entity.dto.LeaveReportRow;
import com.boxcorner.boxcorner.repository.HrEmployeeRepository;
import com.boxcorner.boxcorner.repository.HrLeaveRequestRepository;
import com.boxcorner.boxcorner.repository.HrPositionRepository;
import com.boxcorner.boxcorner.service.JasperService;

@RestController
@RequestMapping("/api/leave-request")
public class LeaveRequestController {

    private static final String TOPIC = "/topic/leave-requests";

    @Autowired
    private HrLeaveRequestRepository leaveRequestRepository;
    @Autowired
    private HrEmployeeRepository employeeRepository;
    @Autowired
    private HrPositionRepository positionRepository;
    @Autowired
    private JasperService jasperService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping
    public ResponseEntity<List<HrLeaveRequest>> getAll() {
        return ResponseEntity.ok(leaveRequestRepository.findAll(Sort.by(Sort.Direction.DESC, "id")));
    }

    @PostMapping
    public ResponseEntity<HrLeaveRequest> create(@RequestBody HrLeaveRequest req) {
        req.setId(null);
        if (req.getStatus() == null || req.getStatus().isBlank()) {
            req.setStatus("pending");
        }
        HrLeaveRequest saved = leaveRequestRepository.save(req);
        broadcastRefresh();
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<HrLeaveRequest> approve(@PathVariable("id") Long id, @RequestBody(required = false) Map<String, String> body) {
        return updateStatus(id, "approved", body);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<HrLeaveRequest> reject(@PathVariable("id") Long id, @RequestBody(required = false) Map<String, String> body) {
        return updateStatus(id, "rejected", body);
    }

    private ResponseEntity<HrLeaveRequest> updateStatus(Long id, String status, Map<String, String> body) {
        return leaveRequestRepository.findById(id).map(r -> {
            r.setStatus(status);
            if (body != null && body.get("approvedBy") != null) {
                r.setApprovedBy(body.get("approvedBy"));
            }
            HrLeaveRequest saved = leaveRequestRepository.save(r);
            broadcastRefresh();
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    private void broadcastRefresh() {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "refresh");
        messagingTemplate.convertAndSend(TOPIC, message);
    }

    // ============ รายงาน "แบบบันทึกการลา" (HR FM-01) รายคน ============
    @GetMapping("/report")
    public ResponseEntity<byte[]> report(@RequestParam("employeeId") Long employeeId,
            @RequestParam(value = "year", required = false) Integer year) {
        HrEmployee emp = employeeRepository.findById(employeeId).orElse(null);
        if (emp == null) return ResponseEntity.notFound().build();
        int y = (year != null) ? year : Year.now().getValue();

        String positionName = "-";
        if (emp.getPositionId() != null) {
            HrPosition p = positionRepository.findById(emp.getPositionId()).orElse(null);
            if (p != null) positionName = p.getNameTh();
        }

        // ใบลา "อนุมัติแล้ว" ของพนักงานคนนี้ ในปี y
        List<HrLeaveRequest> leaves = new ArrayList<>();
        for (HrLeaveRequest r : leaveRequestRepository.findAll(Sort.by(Sort.Direction.ASC, "dateFrom"))) {
            if (employeeId.equals(r.getEmployeeId())
                    && "approved".equalsIgnoreCase(r.getStatus())
                    && r.getDateFrom() != null && r.getDateFrom().getYear() == y) {
                leaves.add(r);
            }
        }

        double usedSick = 0, usedVac = 0, usedPer = 0;
        List<LeaveReportRow> rows = new ArrayList<>();
        int seq = 1;
        for (HrLeaveRequest r : leaves) {
            double h = durationHours(r);
            String type = r.getLeaveType() == null ? "" : r.getLeaveType();
            String sick = "", vac = "", per = "";
            if (type.contains("ป่วย")) { usedSick += h; sick = hoursShort(h); }
            else if (type.contains("พักร้อน")) { usedVac += h; vac = hoursShort(h); }
            else { usedPer += h; per = hoursShort(h); }
            String reason = (r.getReason() == null || r.getReason().isBlank()) ? type : type + " - " + r.getReason();
            rows.add(new LeaveReportRow(seq++, reason, fmtDate(r.getDateFrom()), fmtDate(r.getDateTo()),
                    timeRange(r.getTimeFrom(), r.getTimeTo()), sick, vac, per,
                    r.getApprovedBy() == null ? "-" : r.getApprovedBy()));
        }

        double entVac = entHours(emp.getVacationLeaveDays(), emp.getVacationLeaveHours());
        double entPer = entHours(emp.getPersonalLeaveDays(), emp.getPersonalLeaveHours());
        double entSick = entHours(emp.getSickLeaveDays(), emp.getSickLeaveHours());

        Map<String, Object> params = new HashMap<>();
        params.put("pYearBE", String.valueOf(y + 543));
        params.put("pCode", emp.getCode());
        params.put("pName", (nz(emp.getFirstName()) + " " + nz(emp.getLastName())).trim());
        params.put("pPosition", positionName);
        params.put("pDepartment", null); // เว้นให้กรอกมือ
        params.put("pVacCarryLine", "ลาพักร้อนสะสมยกมา : สิทธิ์ 0 | ใช้ไป 0 | คงเหลือ 0");
        params.put("pVacLine", line("ลาพักร้อน (ปีนี้)", entVac, usedVac));
        params.put("pPerLine", line("ลากิจ", entPer, usedPer));
        params.put("pSickLine", line("ลาป่วย", entSick, usedSick));
        double totalUsed = usedSick + usedVac + usedPer;
        double totalRemain = Math.max(0, (entVac + entPer + entSick) - totalUsed);
        params.put("pTotalLine", "รวมลาที่อนุมัติปี " + (y + 543) + " : " + hoursToText(totalUsed)
                + "   |   คงเหลือรวม : " + hoursToText(totalRemain) + " (" + roundDays(totalRemain) + " วัน)");

        try {
            byte[] pdf = jasperService.generatePdfReportWithBeans("reports/LeaveRecordReport.jrxml", params, rows);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=leave-" + emp.getCode() + "-" + y + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(("report error: " + e.getMessage()).getBytes());
        }
    }

    // ---- helpers ----
    private static String nz(String s) { return s == null ? "" : s; }

    private static double entHours(Integer d, Integer h) {
        return (d == null ? 0 : d) * 8.0 + (h == null ? 0 : h);
    }

    private double durationHours(HrLeaveRequest r) {
        if (r.getDateFrom() == null || r.getDateTo() == null) return 0;
        long days = ChronoUnit.DAYS.between(r.getDateFrom(), r.getDateTo()) + 1;
        if (days <= 0) return 0;
        if (days == 1 && notBlank(r.getTimeFrom()) && notBlank(r.getTimeTo())) {
            int mins = toMin(r.getTimeTo()) - toMin(r.getTimeFrom());
            return mins > 0 ? mins / 60.0 : 0;
        }
        return days * 8.0;
    }

    private static boolean notBlank(String s) { return s != null && !s.isBlank(); }

    private static int toMin(String t) {
        try {
            String[] p = t.split(":");
            return Integer.parseInt(p[0].trim()) * 60 + (p.length > 1 ? Integer.parseInt(p[1].trim()) : 0);
        } catch (Exception e) {
            return 0;
        }
    }

    private static String fmtDate(LocalDate d) {
        return d == null ? "" : d.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    private static String timeRange(String f, String t) {
        if (!notBlank(f) && !notBlank(t)) return "ทั้งวัน";
        return (notBlank(f) ? f : "-") + "-" + (notBlank(t) ? t : "-");
    }

    private String hoursToText(double h) {
        int days = (int) Math.floor(h / 8);
        double hrs = Math.round((h - days * 8) * 10) / 10.0;
        StringBuilder sb = new StringBuilder();
        if (days > 0) sb.append(days).append(" วัน");
        if (hrs > 0) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(trimNum(hrs)).append(" ชม.");
        }
        return sb.length() > 0 ? sb.toString() : "0";
    }

    private static String hoursShort(double h) {
        return trimNum(Math.round(h * 10) / 10.0);
    }

    private static String roundDays(double h) {
        return trimNum(Math.round((h / 8) * 10) / 10.0);
    }

    private static String trimNum(double v) {
        if (v == Math.floor(v)) return String.valueOf((long) v);
        return String.valueOf(v);
    }

    private String line(String label, double ent, double used) {
        return label + " : สิทธิ์ " + hoursToText(ent) + " | ใช้ไป " + hoursToText(used)
                + " | คงเหลือ " + hoursToText(Math.max(0, ent - used));
    }
}
