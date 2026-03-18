package com.boxcorner.boxcorner.service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.util.JRLoader;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.pdf.JRPdfExporter;

@Service
public class JasperService {

    @Autowired
    private DataSource dataSource;

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

    public byte[] generatePdfReport(String reportPath, Map<String, Object> parameters, Connection connection)
            throws JRException {
        try {
            JasperReport jasperReport;
            if (reportPath.endsWith(".jrxml")) {
                jasperReport = compileReport(reportPath);
            } else {
                InputStream jasperStream = new ClassPathResource(reportPath).getInputStream();
                jasperReport = (JasperReport) JRLoader.loadObject(jasperStream);
            }

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, connection);

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
            throw new JRException("Error generating PDF report with Connection: " + e.getMessage()
                    + (root != e ? " (Root Cause: " + root.getMessage() + ")" : ""), e);
        }
    }

    public byte[] generatePdfReportWithDbConnection(String reportPath, Map<String, Object> parameters)
            throws JRException {
        try (Connection connection = dataSource.getConnection()) {
            return generatePdfReport(reportPath, parameters, connection);
        } catch (Exception e) {
            throw new JRException("Error fetching database connection for Jasper report", e);
        }
    }
}
