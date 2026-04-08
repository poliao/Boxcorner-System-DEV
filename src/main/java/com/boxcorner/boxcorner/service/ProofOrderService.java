package com.boxcorner.boxcorner.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boxcorner.boxcorner.entity.ProofOrder;
import com.boxcorner.boxcorner.repository.ProofOrderRepository;

@Service
public class ProofOrderService {

    @Autowired
    private ProofOrderRepository proofOrderRepository;

    public Optional<ProofOrder> findByProductionOrderId(Integer productionOrderId) {
        return proofOrderRepository.findByProductionOrderId(productionOrderId);
    }

    @Transactional
    public ProofOrder save(ProofOrder proofOrder) {
        if (proofOrder.getProductionOrderId() == null) {
            throw new IllegalArgumentException("Production Order ID cannot be null");
        }

        Optional<ProofOrder> existing = proofOrderRepository.findByProductionOrderId(proofOrder.getProductionOrderId());
        if (existing.isPresent()) {
            ProofOrder current = existing.get();
            // Update fields manually or use a mapper
            updateFields(current, proofOrder);
            return proofOrderRepository.save(current);
        } else {
            return proofOrderRepository.save(proofOrder);
        }
    }

    private void updateFields(ProofOrder target, ProofOrder source) {
        target.setReceivedDate(source.getReceivedDate());
        target.setDeliveryDate(source.getDeliveryDate());
        target.setJobCode(source.getJobCode());
        target.setCustomerName(source.getCustomerName());
        target.setJobName(source.getJobName());
        target.setOrderedBy(source.getOrderedBy());
        target.setPlateLocation(source.getPlateLocation());
        target.setPlateColorCount(source.getPlateColorCount());
        target.setPlateScreenMesh(source.getPlateScreenMesh());
        target.setPlateOtherDetails(source.getPlateOtherDetails());
        target.setPaperType(source.getPaperType());
        target.setPaperCut(source.getPaperCut());
        target.setPaperPrintSize(source.getPaperPrintSize());
        target.setPaperPrintQty(source.getPaperPrintQty());
        target.setPaperCutterName(source.getPaperCutterName());
        target.setPaperSpecialInstructions(source.getPaperSpecialInstructions());
        target.setPrintScheduleDate(source.getPrintScheduleDate());
        target.setPrintDeliveryDate(source.getPrintDeliveryDate());
        target.setPrintLocation(source.getPrintLocation());
        target.setPrintCharacteristics(source.getPrintCharacteristics());
        target.setPrintColorCount(source.getPrintColorCount());
        target.setPrintOperatorName(source.getPrintOperatorName());
        target.setPrintQtyObtained(source.getPrintQtyObtained());
        target.setPrintSpecialInstructions(source.getPrintSpecialInstructions());
        target.setCoatScheduleDate(source.getCoatScheduleDate());
        target.setCoatLocation(source.getCoatLocation());
        target.setCoatType(source.getCoatType());
        target.setCoatOperatorName(source.getCoatOperatorName());
        target.setCoatQtyObtained(source.getCoatQtyObtained());
        target.setCoatSpecialInstructions(source.getCoatSpecialInstructions());
        target.setDiecutScheduleDate(source.getDiecutScheduleDate());
        target.setDiecutLocation(source.getDiecutLocation());
        target.setDiecutType(source.getDiecutType());
        target.setDiecutOperatorName(source.getDiecutOperatorName());
        target.setDiecutQtyObtained(source.getDiecutQtyObtained());
        target.setDiecutSpecialInstructions(source.getDiecutSpecialInstructions());
        target.setImageUrl(source.getImageUrl());
    }
}
