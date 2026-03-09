package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.PapProductionOrder;
import com.boxcorner.boxcorner.repository.PapProductionOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;

@Service
public class PapProductionOrderService {

    @Autowired
    private PapProductionOrderRepository repository;

    @Transactional
    @SuppressWarnings("unchecked")
    public PapProductionOrder saveFromMap(Map<String, Object> data) {
        if (data == null || data.isEmpty())
            return null;

        Map<String, Object> header = (Map<String, Object>) data.get("header");
        if (header == null)
            return null;

        String jobCode = (String) header.get("jobCode");
        PapProductionOrder entity = repository.findByJobCode(jobCode)
                .orElse(new PapProductionOrder());

        // Header
        entity.setJobCode((String) header.get("jobCode"));
        entity.setQuotation((String) header.get("quotation"));
        entity.setSale((String) header.get("sale"));
        entity.setJobName((String) header.get("jobName"));
        entity.setCustomerName((String) header.get("customerName"));
        entity.setCustomerId((String) header.get("customerId"));
        entity.setFinishedSize((String) header.get("finishedSize"));
        entity.setReceivedDate(parseDate(header.get("receivedDate"), "receivedDate"));
        entity.setTotalPrintQty(parseInt(header.get("totalPrintQty"), "totalPrintQty"));
        entity.setDeliveryDate(parseDate(header.get("deliveryDate"), "deliveryDate"));
        entity.setOrderedBy((String) header.get("orderedBy"));
        entity.setImageUrl((String) header.get("imageUrl"));

        // Platemaking
        Map<String, Object> plate = (Map<String, Object>) data.get("platemaking");
        if (plate != null) {
            entity.setPlateDate(parseDate(plate.get("date"), "plateDate"));
            entity.setPlateJobOrderId((String) plate.get("jobOrderId"));
            entity.setPlateColors((String) plate.get("colors"));
            entity.setPlateScreenDot((String) plate.get("screenDot"));
            entity.setPlateSize((String) plate.get("size"));
            entity.setPlateRound(parseInt(plate.get("round"), "plateRound"));
            entity.setPlateNote((String) plate.get("note"));
            entity.setPlateResponsible((String) plate.get("responsiblePerson"));
        }

        // Cutting
        Map<String, Object> cut = (Map<String, Object>) data.get("cutting");
        if (cut != null) {
            entity.setCutDate(parseDate(cut.get("date"), "cutDate"));
            entity.setCutPattern((String) cut.get("cutPattern"));
            entity.setCutResponsible((String) cut.get("responsiblePerson"));
            entity.setCutNote((String) cut.get("note"));

            Map<String, Object> paper = (Map<String, Object>) cut.get("paper");
            if (paper != null) {
                entity.setCutPaperType((String) paper.get("type"));
                entity.setCutPaperCut(parseInt(paper.get("cut"), "cutPaperCut"));
                entity.setCutPaperPrintSize((String) paper.get("printSize"));
                entity.setCutPaperPrintQty(parseInt(paper.get("printQty"), "cutPaperPrintQty"));
                entity.setCutPaperMachineSetup(parseInt(paper.get("machineSetup"), "cutPaperMachineSetup"));
            }
        }

        // Printing
        Map<String, Object> print = (Map<String, Object>) data.get("printing");
        if (print != null) {
            entity.setPrintMachine((String) print.get("machine"));
            entity.setPrintJobType((String) print.get("jobType"));
            entity.setPrintPattern((String) print.get("printPattern"));
            entity.setPrintLay(parseInt(print.get("lay"), "printLay"));
            entity.setPrintScheduledDate(parseDate(print.get("scheduledDate"), "printScheduledDate"));
            entity.setPrintConfirmedBy((String) print.get("confirmedBy"));
            entity.setPrintNote((String) print.get("note"));
        }

        // Coating
        Map<String, Object> coat = (Map<String, Object>) data.get("coating");
        if (coat != null) {
            entity.setCoatLocation((String) coat.get("location"));
            entity.setCoatPattern((String) coat.get("coatingPattern"));
            entity.setCoatScheduledDate(parseDate(coat.get("scheduledDate"), "coatScheduledDate"));
            entity.setCoatNote((String) coat.get("note"));
        }

        // Die Cutting
        Map<String, Object> die = (Map<String, Object>) data.get("dieCutting");
        if (die != null) {
            entity.setDieLocation((String) die.get("location"));
            entity.setDieFoilDeadline(parseDate(die.get("foilStampingDeadline"), "dieFoilDeadline"));
            entity.setDieEmbossDeadline(parseDate(die.get("embossingDeadline"), "dieEmbossDeadline"));
            entity.setDieCutDeadline(parseDate(die.get("dieCutDeadline"), "dieCutDeadline"));

            Map<String, Object> foil = (Map<String, Object>) die.get("foilStamping");
            if (foil != null) {
                entity.setDieFoilType((String) foil.get("type"));
                entity.setDieFoilBlock((String) foil.get("blockCode"));
                entity.setDieFoilNew((String) foil.get("isNew"));
            }

            Map<String, Object> emboss = (Map<String, Object>) die.get("embossing");
            if (emboss != null) {
                entity.setDieEmbossType((String) emboss.get("type"));
                entity.setDieEmbossBlock((String) emboss.get("blockCode"));
                entity.setDieEmbossNew((String) emboss.get("isNew"));
            }

            Map<String, Object> dCut = (Map<String, Object>) die.get("dieCut");
            if (dCut != null) {
                entity.setDieCutType((String) dCut.get("type"));
                entity.setDieCutBlock((String) dCut.get("blockCode"));
                entity.setDieCutNew((String) dCut.get("isNew"));
            }
        }

        // Gluing
        Map<String, Object> glue = (Map<String, Object>) data.get("gluing");
        if (glue != null) {
            entity.setGlueLocation((String) glue.get("location"));
            entity.setGluePattern((String) glue.get("pattern"));
            entity.setGlueScheduledDate(parseDate(glue.get("scheduledDate"), "glueScheduledDate"));
        }

        // QC
        Map<String, Object> qc = (Map<String, Object>) data.get("qcAndDelivery");
        if (qc != null) {
            entity.setQcRequiredQty((String) qc.get("requiredQty"));
            entity.setQcQa((String) qc.get("qa"));
            entity.setQcDetail((String) qc.get("detail"));
            entity.setQcBookletSt(parseInt(qc.get("bookletST"), "qcBookletSt"));
            entity.setQcScheduledDate(parseDate(qc.get("scheduledDate"), "qcScheduledDate"));
            entity.setDeliveryLocation((String) qc.get("deliveryLocation"));
            entity.setDeliveryPattern((String) qc.get("deliveryPattern"));
            entity.setDeliveryDateTime(parseDate(qc.get("deliveryDateTime"), "deliveryDateTime"));
        }

        return repository.save(entity);
    }

    private Integer parseInt(Object val, String fieldName) {
        if (val == null || val.toString().trim().isEmpty() || "-".equals(val.toString().trim()))
            return null;
        try {
            // Remove commas and extract first numeric sequence if needed
            String s = val.toString().replaceAll(",", "").trim();
            return Integer.parseInt(s);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Field [" + fieldName + "] ได้ประเภทไม่ตรง: " + val);
        }
    }

    private LocalDate parseDate(Object val, String fieldName) {
        if (val == null || val.toString().trim().isEmpty() || "-".equals(val.toString().trim())
                || val.toString().contains("แจ้งอีกที"))
            return null;

        String s = val.toString().trim();
        try {
            // Handle Case: dd/MM/yyyy (Thai Buddhist or Standard)
            if (s.matches("\\d{1,2}/\\d{1,2}/\\d{4}")) {
                String[] p = s.split("/");
                int day = Integer.parseInt(p[0]);
                int month = Integer.parseInt(p[1]);
                int year = Integer.parseInt(p[2]);

                // Convert Buddhist Era (BE) to Anno Domini (AD)
                if (year > 2500)
                    year -= 543;

                return LocalDate.of(year, month, day);
            }
            // Handle Case: yyyy-MM-dd
            if (s.matches("\\d{4}-\\d{2}-\\d{2}")) {
                return LocalDate.parse(s);
            }

            return null;
        } catch (Exception e) {
            throw new IllegalArgumentException("Field [" + fieldName + "] ได้ประเภทไม่ตรง (Date): " + val);
        }
    }
}
