package com.boxcorner.boxcorner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.boxcorner.boxcorner.entity.PrintJob;
import com.boxcorner.boxcorner.repository.PrintJobRepository;

@ExtendWith(MockitoExtension.class)
public class PrintJobServiceTest {

    @Mock
    private PrintJobRepository repository;

    @InjectMocks
    private PrintJobService service;

    private PrintJob existingJob;
    private PrintJob updatedJob;

    @BeforeEach
    void setUp() {
        existingJob = new PrintJob();
        existingJob.setId(1L);
        existingJob.setRowVersion(1L);
        existingJob.setJobId("OLD-123");

        updatedJob = new PrintJob();
        updatedJob.setId(1L);
        updatedJob.setRowVersion(1L);
        updatedJob.setJobId("NEW-123");
        updatedJob.setSampleJobType("Sample Type");
        updatedJob.setSamplePrintingSystem("Digital");
        updatedJob.setSamplePrintingStyle("Full Color");
        updatedJob.setSamplePrintingColor("CMYK");
        updatedJob.setSamplePaperSize("A4");
        updatedJob.setSamplePaperGrammage("250g");
        updatedJob.setSampleCoatingStyle("Glossy");
        updatedJob.setSampleDiecutStyle("Standard");
        updatedJob.setSampleSpecialInstructions("Handle with care");
        updatedJob.setSampleDeliveryTimestamp(LocalDateTime.of(2026, 3, 26, 13, 0));
    }

    @Test
    void testSave_UpdatesSampleFields() {
        when(repository.findById(1L)).thenReturn(Optional.of(existingJob));
        when(repository.save(any(PrintJob.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PrintJob savedJob = service.save(updatedJob);

        assertEquals("NEW-123", savedJob.getJobId());
        assertEquals("Sample Type", savedJob.getSampleJobType());
        assertEquals("Digital", savedJob.getSamplePrintingSystem());
        assertEquals("Full Color", savedJob.getSamplePrintingStyle());
        assertEquals("CMYK", savedJob.getSamplePrintingColor());
        assertEquals("A4", savedJob.getSamplePaperSize());
        assertEquals("250g", savedJob.getSamplePaperGrammage());
        assertEquals("Glossy", savedJob.getSampleCoatingStyle());
        assertEquals("Standard", savedJob.getSampleDiecutStyle());
        assertEquals("Handle with care", savedJob.getSampleSpecialInstructions());
        assertEquals(LocalDateTime.of(2026, 3, 26, 13, 0), savedJob.getSampleDeliveryTimestamp());
    }
}
