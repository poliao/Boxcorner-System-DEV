package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lalamove_close_request")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LalamoveCloseRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_no", nullable = false, unique = true)
    private String jobNo;

    @Column(name = "job_owner")
    private String jobOwner;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "requested_by", nullable = false)
    private String requestedBy;

    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt;

    @Column(nullable = false)
    private String status;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
}
