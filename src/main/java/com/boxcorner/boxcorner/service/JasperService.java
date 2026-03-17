package com.boxcorner.boxcorner.service;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.util.JRLoader;
import net.sf.jasperreports.pdf.JRPdfExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.util.Map;
import java.util.Collection;

@Service
public class JasperService {

    /**
     * Compile .jrxml to .jasper (optional if you want to do it at runtime)
     */
    public JasperReport compileReport(String jrxmlPath) throws JRException {
        try {
            InputStream reportStream = new ClassPathResource(jrxmlPath).getInputStream();
            return JasperCompileManager.compileReport(reportStream);
        } catch (Exception e) {
            throw new JRException("Error compiling jrxml: " + jrxmlPath, e);
        }
    }

    /**
     * Generate PDF from .jrxml or .jasper
     */
    public byte[] generatePdfReport(String reportPath, Map<String, Object> parameters, JRDataSource dataSource) throws JRException {
        try {
            JasperReport jasperReport;
            if (reportPath.endsWith(".jrxml")) {
                jasperReport = compileReport(reportPath);
            } else {
                InputStream jasperStream = new ClassPathResource(reportPath).getInputStream();
                jasperReport = (JasperReport) JRLoader.loadObject(jasperStream);
            }

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            JRPdfExporter exporter = new JRPdfExporter();
            exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(baos));
            exporter.exportReport();
            
            return baos.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            Throwable root = e;
            while (root.getCause() != null && root != root.getCause()) {
                root = root.getCause();
            }
            throw new JRException("Error generating PDF report: " + e.getMessage() + (root != e ? " (Root Cause: " + root.getMessage() + ")" : ""), e);
        }
    }

    /**
     * Generate PDF from a collection of data
     */
    public byte[] generatePdfReport(String reportPath, Map<String, Object> parameters, Collection<?> data) throws JRException {
        return generatePdfReport(reportPath, parameters, new JRBeanCollectionDataSource(data));
    }

    /**
     * Generate PDF without a data source (useful for parameter-only reports)
     */
    public byte[] generatePdfReport(String reportPath, Map<String, Object> parameters) throws JRException {
        return generatePdfReport(reportPath, parameters, new net.sf.jasperreports.engine.JREmptyDataSource(1));
    }
}
