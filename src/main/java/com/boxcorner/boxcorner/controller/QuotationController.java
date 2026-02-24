package com.boxcorner.boxcorner.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.Quotation;
import com.boxcorner.boxcorner.service.QuotationService;

@RestController
@RequestMapping("/api/quotations")
public class QuotationController {

    @Autowired
    private QuotationService quotationService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Quotation quotation) {
        try {
            return ResponseEntity.ok(quotationService.createQuotation(quotation));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/revise")
    public ResponseEntity<?> revise(@RequestParam("activityId") Long activityId, @RequestBody Quotation quotation) {
        try {
            return ResponseEntity.ok(quotationService.reviseQuotation(activityId, quotation));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/byActivity")
    public ResponseEntity<List<Quotation>> getByActivity(@RequestParam("activityId") Long activityId) {
        return ResponseEntity.ok(quotationService.getQuotationsByActivity(activityId));
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrent(@RequestParam("activityId") Long activityId) {
        return quotationService.getCurrentQuotation(activityId)
                .map(ResponseEntity::ok)
                .orElse(null);
    }

    @GetMapping("/revisionCount")
    public ResponseEntity<Integer> getRevisionCount(@RequestParam("activityId") Long activityId) {
        return ResponseEntity.ok(quotationService.getRevisionCount(activityId));
    }
}
