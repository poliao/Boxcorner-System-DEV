package com.boxcorner.boxcorner.entity.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MenuResponse {
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
    
    private List<MenuResponse> children;
}