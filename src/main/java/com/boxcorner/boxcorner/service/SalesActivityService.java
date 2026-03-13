package com.boxcorner.boxcorner.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boxcorner.boxcorner.entity.DailyRoute;
import com.boxcorner.boxcorner.entity.SalesActivity;
import com.boxcorner.boxcorner.entity.User;
import com.boxcorner.boxcorner.entity.dto.SalesSummaryDTO;
import com.boxcorner.boxcorner.repository.DailyRouteRepository;
import com.boxcorner.boxcorner.repository.SalesActivityRepository;
import com.boxcorner.boxcorner.repository.UserRepository;

@Service
public class SalesActivityService {

    @Autowired
    private SalesActivityRepository salesActivityRepository;

    @Autowired
    private DailyRouteRepository dailyRouteRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public SalesActivity saveOrUpdate(SalesActivity activity, String salesName) {
        if (activity.getActivityId() != null) {
            SalesActivity existing = salesActivityRepository.findById(activity.getActivityId())
                    .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล ID: " + activity.getActivityId()));

            if (activity.getRowVersion() != null && !existing.getRowVersion().equals(activity.getRowVersion())) {
                throw new RuntimeException("ข้อมูลถูกแก้ไขโดยผู้อื่นแล้ว กรุณาโหลดข้อมูลใหม่");
            }

            existing.setActivityDate(activity.getActivityDate());
            existing.setCustomerName(activity.getCustomerName());
            existing.setContactPerson(activity.getContactPerson());
            existing.setContactChannel(activity.getContactChannel());
            existing.setObjective(activity.getObjective());
            existing.setDiscussionResult(activity.getDiscussionResult());
            existing.setIsNewCustomer(activity.getIsNewCustomer());
            existing.setNextStep(activity.getNextStep());
            existing.setContact(activity.getContact());
            existing.setQuotation(activity.getQuotation());
            existing.setSalesName(activity.getSalesName());
            existing.setNextDate(activity.getNextDate());
            existing.setNextTime(activity.getNextTime());
            existing.setCompanyName(activity.getCompanyName());
            existing.setActivitiesStatus(activity.getActivitiesStatus());
            existing.setLossReasons(activity.getLossReasons());
            existing.setProvince(activity.getProvince());
            existing.setProbability(activity.getProbability());

            return salesActivityRepository.save(existing);
        } else {
            activity.setSalesName(salesName);

            // Auto-link daily_route_id จาก DailyRoute ของวันนี้
            try {
                User user = userRepository.findByUsername(salesName).orElse(null);
                if (user != null) {
                    LocalDate today = LocalDate.now(ZoneId.of("Asia/Bangkok"));
                    Optional<DailyRoute> todayRoute = dailyRouteRepository.findByEmployeeIdAndWorkDate(user.getId(),
                            today);
                    todayRoute.ifPresent(activity::setDailyRoute);
                }
            } catch (Exception ignored) {
                // ถ้าหา DailyRoute ไม่เจอ ก็สร้าง activity ได้เลยโดยไม่มี FK
            }

            return salesActivityRepository.save(activity);
        }
    }

    @Transactional
    public Page<SalesActivity> search(
            Long activityId,
            String salesName,
            String customerName,
            String contactPerson,
            Boolean isNewCustomer,
            LocalDate startDate,
            LocalDate endDate,
            LocalDate startDateMain,
            LocalDate endDateMain,
            int page,
            int size) {
        Pageable paging = PageRequest.of(page, size);
        LocalDateTime startDateStart = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime endDateNextDay = endDate != null ? endDate.atStartOfDay().plusDays(1) : null;
        return salesActivityRepository.findByFilters(
                activityId,
                salesName,
                customerName,
                contactPerson,
                isNewCustomer,
                startDateStart,
                endDateNextDay,
                startDateMain,
                endDateMain,
                paging);
    }

    @Transactional
    public Page<SalesActivity> searchAdmin(
            Long activityId,
            String salesName,
            String customerName,
            String contactPerson,
            Boolean isNewCustomer,
            LocalDate startDate,
            LocalDate endDate,
            LocalDate startDateMain,
            LocalDate endDateMain,
            int page,
            int size) {
        Pageable paging = PageRequest.of(page, size);
        LocalDateTime startDateStart = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime endDateNextDay = endDate != null ? endDate.atStartOfDay().plusDays(1) : null;
        return salesActivityRepository.findByFiltersAdmin(
                activityId,
                salesName,
                customerName,
                contactPerson,
                isNewCustomer,
                startDateStart,
                endDateNextDay,
                startDateMain,
                endDateMain,
                paging);
    }

    public Optional<SalesActivity> getById(Long id) {
        return salesActivityRepository.findById(id);
    }

    @Transactional
    public void delete(Long id) {
        salesActivityRepository.deleteById(id);
    }

    @Transactional
    public void checkIn(Long activityId, BigDecimal checkInLat, BigDecimal checkInLng, String salesName) {
        SalesActivity activity = salesActivityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล ID: " + activityId));
        activity.setCheckInLat(checkInLat);
        activity.setCheckInLng(checkInLng);
        activity.setCheckInTime(LocalDateTime.now());

        // Link daily_route_id ถ้ายังไม่มี (ตรวจ FK โดยตรง ไม่ใช้ LAZY proxy)
        if (activity.getDailyRouteId() == null && salesName != null) {
            try {
                User user = userRepository.findByUsername(salesName).orElse(null);
                if (user != null) {
                    LocalDate today = LocalDate.now(ZoneId.of("Asia/Bangkok"));
                    Optional<DailyRoute> todayRoute = dailyRouteRepository.findByEmployeeIdAndWorkDate(user.getId(),
                            today);
                    todayRoute.ifPresent(activity::setDailyRoute);
                }
            } catch (Exception ignored) {
            }
        }
        salesActivityRepository.save(activity);
    }

    @Transactional
    public List<SalesSummaryDTO> getSummaryReport(LocalDate startDate, LocalDate endDate) {
        if (startDate == null)
            startDate = LocalDate.now().minusMonths(1);
        if (endDate == null)
            endDate = LocalDate.now();
        return salesActivityRepository.getSummaryReport(startDate, endDate);
    }
}
