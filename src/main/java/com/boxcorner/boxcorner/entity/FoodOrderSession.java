package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "food_order_sessions")
@Data
@EqualsAndHashCode(callSuper = true)
public class FoodOrderSession extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "restaurant_name", nullable = false, length = 255)
    private String restaurantName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private FoodOrderStatus status;

    @Column(name = "opened_by", nullable = false, length = 100)
    private String openedBy;

    public enum FoodOrderStatus {
        OPEN, SENT
    }
}
