package com.boxcorner.boxcorner.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import com.boxcorner.boxcorner.entity.dto.MenuResponse;

@Service
public class MenuService {

    public List<MenuResponse> buildHierarchy(List<MenuResponse> menus) {
        Map<String, MenuResponse> map = new HashMap<>();
        List<MenuResponse> roots = new ArrayList<>();

        for (MenuResponse m : menus) {
            m.setChildren(new ArrayList<>()); 
            map.put(m.getId(), m);
        }

        for (MenuResponse m : menus) {
            if (m.getParentId() == null || m.getParentId().isEmpty()) {
                roots.add(m);
            } else {
                MenuResponse parent = map.get(m.getParentId());
                if (parent != null) {
                    parent.getChildren().add(m);
                }
            }
        }

        cleanEmptyChildren(roots);

        return roots;
    }

    private void cleanEmptyChildren(List<MenuResponse> nodes) {
        for (MenuResponse node : nodes) {
            if (node.getChildren().isEmpty()) {
                node.setChildren(null);
            } else {
                cleanEmptyChildren(node.getChildren());
            }
        }
    }
}
