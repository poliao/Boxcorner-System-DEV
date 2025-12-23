package com.boxcorner.boxcorner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.boxcorner.boxcorner.entity.SampleOrder;
import com.boxcorner.boxcorner.repository.SampleOrderRepository;

@Service
public class SampleOrderService {

    @Autowired
    private SampleOrderRepository sampleOrderRepository;

    @Transactional
    public SampleOrder saveOrUpdateOrder(SampleOrder order) {
        if (order.getId() != null) {
            return sampleOrderRepository.findById(order.getId())
                .map(existingOrder -> {
                    existingOrder.setOrderDate(order.getOrderDate());
                    existingOrder.setFolderName(order.getFolderName());
                    existingOrder.setDetails(order.getDetails());
                    existingOrder.setJobOwner(order.getJobOwner());
                    existingOrder.setDeliveryDate(order.getDeliveryDate());
                    existingOrder.setDeliveryTime(order.getDeliveryTime());
                    existingOrder.setResponsiblePerson(order.getResponsiblePerson());
                    existingOrder.setQuantity(order.getQuantity());
                    existingOrder.setUnit(order.getUnit());
                    existingOrder.setIsCreateSample(order.getIsCreateSample());
                    existingOrder.setStatus(order.getStatus());
                    existingOrder.setNote(order.getNote());
                    
                    return sampleOrderRepository.save(existingOrder);
                })
                .orElseGet(() -> {
                    return sampleOrderRepository.save(order);
                });
        }
        return sampleOrderRepository.save(order);
    }
}