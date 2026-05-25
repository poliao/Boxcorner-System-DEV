package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "food_order_items")
@Data
@EqualsAndHashCode(callSuper = true)
public class FoodOrderItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    @Column(name = "username", nullable = false, length = 100)
    private String username;

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    @Column(name = "menu_name", nullable = false, length = 255)
    private String menuName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;
}
