package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.Recipe;
import com.boxcorner.boxcorner.entity.dto.ColorRequest;
import com.boxcorner.boxcorner.entity.dto.ColorResponse;
import com.boxcorner.boxcorner.entity.dto.RecipeRequest;
import com.boxcorner.boxcorner.entity.dto.RecipeResponse;
import com.boxcorner.boxcorner.entity.Colors;
import com.boxcorner.boxcorner.repository.RecipeRepository;
import com.boxcorner.boxcorner.repository.ColorsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

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

    @PersistenceContext
    private EntityManager entityManager;

    public Page<Recipe> getAllRecipes(String recipeid, String jobid, String jobname, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("updatedate").descending());
        if (jobname != null && !jobname.isEmpty() || recipeid != null && !recipeid.isEmpty()
                || jobid != null && !jobid.isEmpty()) {
            return recipeRepository.findByFilters(recipeid, jobid, jobname, paging);
        } else {
            return recipeRepository.findAll(paging);
        }
    }

    @Transactional
    public RecipeResponse saveOrUpdateRecipe(RecipeRequest req, String currentUser) {
        Recipe recipe = new Recipe();
        if (req.getRecipeid() == null || req.getRecipeid().isEmpty()) {
            recipe.setRecipeid(generateNextRecipeId());
        } else {
            recipe = recipeRepository.findById(req.getRecipeid()).orElse(new Recipe());
            recipe.setRecipeid(req.getRecipeid());
        }

        recipe.setJobid(req.getJobid());
        recipe.setJobname(req.getJobname());
        recipe.setUpdatedate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyyHH:mm:ss")));
        recipe.setUpdateby(currentUser);
        recipe.setReqtotalweight(req.getReqtotalweight());
        recipe.setLightness(req.getLightness());
        recipe.setGreenred(req.getGreenred());
        recipe.setBlueyellow(req.getBlueyellow());
        recipeRepository.save(recipe);

        colorsRepository.deleteByRecipeid(req.getRecipeid());
        for (ColorRequest c : req.getColors()) {
            Colors color = new Colors();
            color.setColorid(generateNextColorId());
            color.setRecipeid(req.getRecipeid());
            color.setColorname(c.getColor());
            color.setWeight(c.getWeight());
            color.setLot(c.getLot());
            color.setUpdatedate(req.getUpdatedate());
            color.setUpdateby(req.getUpdateby());

            colorsRepository.save(color);
        }

        List<Colors> colorsList = colorsRepository.findByRecipeid(req.getRecipeid());
        RecipeResponse response = new RecipeResponse();
        response.setRecipeid(recipe.getRecipeid());
        response.setJobid(recipe.getJobid());
        response.setJobname(recipe.getJobname());
        response.setUpdatedate(recipe.getUpdatedate());
        response.setUpdateby(recipe.getUpdateby());
        response.setReqtotalweight(recipe.getReqtotalweight());
        response.setLightness(recipe.getLightness());
        response.setGreenred(recipe.getGreenred());
        response.setBlueyellow(recipe.getBlueyellow());

        List<ColorResponse> colorResponses = colorsList.stream().map(c -> {
            ColorResponse cr = new ColorResponse();
            cr.setColorid(c.getColorid());
            cr.setRecipeid(c.getRecipeid());
            cr.setColorname(c.getColorname());
            cr.setWeight(c.getWeight());
            cr.setLot(c.getLot());
            cr.setUpdatedate(c.getUpdatedate());
            cr.setUpdateby(c.getUpdateby());
            return cr;
        }).toList();

        response.setColors(colorResponses);

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

    public List<Recipe> getRecipeByJo(String jobId) {
        return recipeRepository.findByJobid(jobId);
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