package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.Recipe;

import com.boxcorner.boxcorner.entity.Colors;
import com.boxcorner.boxcorner.repository.RecipeRepository;
import com.boxcorner.boxcorner.repository.ColorsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecipeService {
    
    @Autowired
    private RecipeRepository recipeRepository;
    
    @Autowired
    private ColorsRepository colorsRepository;

    public Page<Recipe> getAllRecipes(String recipeid,String jobid,String jobname, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("updatedate").descending());
        if (jobname != null && !jobname.isEmpty() || recipeid != null && !recipeid.isEmpty() || jobid != null && !jobid.isEmpty()) {
            return recipeRepository.findByFilters( recipeid, jobid, jobname, paging);
        } else {
            return recipeRepository.findAll(paging);
        }
    }

    @Transactional
      public Map<String, Object> save(Recipe recipe, List<Colors> colors, String currentUser) {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));
        
        if (recipe.getRecipeid() == null || recipe.getRecipeid().isEmpty()) {
            recipe.setRecipeid(generateNextRecipeId());
        } else {
            colorsRepository.deleteByRecipeid(recipe.getRecipeid());
        }
        
        recipe.setUpdatedate(now);
        recipe.setUpdateby(currentUser);
        
        Recipe savedRecipe = recipeRepository.save(recipe);
        
        if (colors != null) {
            for (Colors color : colors) {
                color.setColorid(generateNextColorId());
                color.setRecipeid(savedRecipe.getRecipeid());
                color.setUpdatedate(now);
                color.setUpdateby(currentUser);
                colorsRepository.save(color);
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("recipeid", savedRecipe.getRecipeid());
        response.put("jobid", savedRecipe.getJobid());
        response.put("jobname", savedRecipe.getJobname());
        response.put("updatedate", savedRecipe.getUpdatedate());
        response.put("updateby", savedRecipe.getUpdateby());
        response.put("reqtotalweight", savedRecipe.getReqtotalweight());
        response.put("lightness", recipe.getLightness());
        response.put("greenred", recipe.getGreenred());
        response.put("blueyellow", recipe.getBlueyellow());
        
        response.put("colors", colors); 

        return response;
    }

    public Map<String, Object> getRecipeById(String recipeid) {
        List<Colors> colors = colorsRepository.findByRecipeid(recipeid);
        Recipe recipe = recipeRepository.findById(recipeid).orElse(null);

        Map<String, Object> response = new HashMap<>();
        if (recipe != null) {
            response.put("recipeid", recipe.getRecipeid());
            response.put("jobid", recipe.getJobid());
            response.put("jobname", recipe.getJobname());
            response.put("updatedate", recipe.getUpdatedate());
            response.put("updateby", recipe.getUpdateby());
            response.put("reqtotalweight", recipe.getReqtotalweight());
            response.put("lightness", recipe.getLightness());
            response.put("greenred", recipe.getGreenred());
            response.put("blueyellow", recipe.getBlueyellow());
            response.put("colors", colors);
        }

        return response;
    }

    @Transactional(readOnly = true)
    public List<String> findUniqueRecipeIds(String query) {
        String searchTerm = (query != null) ? query.trim() : "";
        return recipeRepository.findUniqueRecipeIds(searchTerm);
    }

    @Transactional(readOnly = true)
    public List<String> findUniqueJobIds(String query) {
        String searchTerm = (query != null) ? query.trim() : "";
        return recipeRepository.findUniqueJobIds(searchTerm);
    }
    
    private String generateNextRecipeId() {
        String lastId = recipeRepository.findTopByOrderByRecipeidDesc();
        if (lastId == null || !lastId.startsWith("BCA")) {
            return "BCA01";
        }
        
        int number = Integer.parseInt(lastId.substring(3));
        return String.format("BCA%06d", number + 1);
    }
    
    private String generateNextColorId() {
        String lastId = colorsRepository.findTopByOrderByColoridDesc();
        if (lastId == null || !lastId.startsWith("COL")) {
            return "COL01";
        }
        
        int number = Integer.parseInt(lastId.substring(3));
        return String.format("COL%06d", number + 1);
    }


}