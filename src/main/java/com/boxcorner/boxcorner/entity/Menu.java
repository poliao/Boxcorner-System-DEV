package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data 
@Table(name = "menus")
public class Menu extends BaseEntity {

    @Id
    private String id;
    private String parentId;
    private String title;
    private String type;
    private String icon;
    private String url;
    private String classes;
    private Boolean target;
    private Boolean external;
    private Boolean breadcrumbs;
    private Integer sortOrder;
}