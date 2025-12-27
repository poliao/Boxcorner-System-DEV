package com.boxcorner.boxcorner.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.dto.MenuResponse;

@Repository
public class MenuRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<MenuResponse> findMenusByUsername(String username) {
        String sql = "SELECT m.id, m.parent_id, m.title, m.type, m.icon, m.url, " +
                     "m.classes, m.target, m.external, m.breadcrumbs " +
                     "FROM menus m " +
                     "JOIN department_permissions dp ON m.id = dp.menu_id " +
                     "JOIN users u ON dp.dept_id = u.role " + 
                     "WHERE u.username = ? " +
                     "AND u.enabled = true " + 
                     "AND dp.can_view = true " +
                     "ORDER BY m.id ASC"; 

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            MenuResponse menu = new MenuResponse();
            menu.setId(rs.getString("id"));
            menu.setParentId(rs.getString("parent_id"));
            menu.setTitle(rs.getString("title"));
            menu.setType(rs.getString("type"));
            menu.setIcon(rs.getString("icon"));
            menu.setUrl(rs.getString("url"));
            menu.setClasses(rs.getString("classes"));
            menu.setTarget(rs.getBoolean("target"));
            menu.setExternal(rs.getBoolean("external"));
            
            Object bc = rs.getObject("breadcrumbs");
            menu.setBreadcrumbs(bc != null ? (Boolean) bc : null);
            
            return menu;
        }, username);
    }

   
}