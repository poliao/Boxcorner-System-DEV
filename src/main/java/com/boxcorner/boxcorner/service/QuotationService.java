package com.boxcorner.boxcorner.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boxcorner.boxcorner.entity.Quotation;
import com.boxcorner.boxcorner.repository.QuotationRepository;

@Service
public class QuotationService {

    @Autowired
    private QuotationRepository quotationRepository;

    @Transactional
    public Quotation createQuotation(Quotation quotation) {
        if (quotation.getRevision() == null) {
            quotation.setRevision(0);
        }
        quotation.setIsCurrent(true);
        return quotationRepository.save(quotation);
    }

    @Transactional
    public Quotation reviseQuotation(Long activityId, Quotation newQuotation) {
        Optional<Quotation> currentOpt = quotationRepository.findCurrentByActivityId(activityId);
        
        if (currentOpt.isPresent()) {
            Quotation current = currentOpt.get();
            current.setIsCurrent(false);
            quotationRepository.save(current);
            
            newQuotation.setRevision(current.getRevision() + 1);
        } else {
            newQuotation.setRevision(0);
        }
        
        newQuotation.setActivityId(activityId);
        newQuotation.setIsCurrent(true);
        return quotationRepository.save(newQuotation);
    }

    public List<Quotation> getQuotationsByActivity(Long activityId) {
        return quotationRepository.findByActivityIdOrderByRevisionDesc(activityId);
    }

    public Optional<Quotation> getCurrentQuotation(Long activityId) {
        return quotationRepository.findCurrentByActivityId(activityId);
    }

    public Integer getRevisionCount(Long activityId) {
        return quotationRepository.countByActivityId(activityId);
    }
}
