package com.boxcorner.boxcorner.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug-dump")
public class DebugDumpController {

    private final JdbcTemplate jdbcTemplate;

    public DebugDumpController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> dumpInventory() {
        return jdbcTemplate.queryForList(
                "SELECT pi.inventory_id, pi.unit_stock_id, pi.current_major_qty, pi.current_minor_qty, us.major_quantity as us_major_quantity, us.item_name "
                        +
                        "FROM paper_inventory pi " +
                        "LEFT JOIN unit_stock us ON pi.unit_stock_id = us.id " +
                        "ORDER BY pi.last_updated DESC LIMIT 10");
    }

    @GetMapping("/logs")
    public List<Map<String, Object>> dumpLogs() {
        return jdbcTemplate.queryForList(
                "SELECT id, meter_color_start, meter_color_end, meter_bw_start, meter_bw_end, paper_req_end " +
                        "FROM print_log ORDER BY ended_at DESC NULLS LAST LIMIT 10");
    }
}
