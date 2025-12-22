package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.Recipe;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.entity.Colors;
import com.boxcorner.boxcorner.service.RecipeService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    
    @Autowired
    private RecipeService recipeService;

    @Autowired
    private TokenService tokenService;
    
    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Map<String, Object> request ,HttpServletRequest httpRequest) {
        try {
            Recipe recipe = new Recipe();
            recipe.setRecipeid((String) request.get("recipeid"));
            recipe.setJobid((String) request.get("jobid"));
            recipe.setJobname((String) request.get("jobname"));
            recipe.setReqtotalweight(request.get("reqtotalweight") != null ? new BigDecimal(request.get("reqtotalweight").toString()) : null);
            recipe.setLightness(request.get("lightness") != null ? new BigDecimal(request.get("lightness").toString()) : null);
            recipe.setGreenred(request.get("greenred") != null ? new BigDecimal(request.get("greenred").toString()) : null);
            recipe.setBlueyellow(request.get("blueyellow") != null ? new BigDecimal(request.get("blueyellow").toString()) : null);
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> colorData = (List<Map<String, Object>>) request.get("colors");
            List<Colors> colors = colorData.stream().map(colorMap -> {
                Colors color = new Colors();
                color.setColorname((String) colorMap.get("color"));
                color.setWeight(colorMap.get("weight") != null ? new BigDecimal(colorMap.get("weight").toString()) : null);
                color.setLot((String) colorMap.get("lot"));
                return color;
            }).toList();
            
            String currentUser = tokenService.getCurrentUser(httpRequest);
            Map<String, Object> savedRecipe = recipeService.save(recipe, colors, currentUser);
            
            return ResponseEntity.ok(savedRecipe);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getAllRecipes(
            @RequestParam(required = false) String recipeid,
            @RequestParam(required = false) String jobid,
            @RequestParam(required = false) String jobName, // คำค้นหา (Optional)
            @RequestParam(defaultValue = "0") int page,     // หน้าที่ต้องการ (เริ่มที่ 0)
            @RequestParam(defaultValue = "10") int size     // จำนวนต่อหน้า
    ) {
        try {
            Page<Recipe> pageRecipes = recipeService.getAllRecipes(recipeid, jobid, jobName, page, size);
            return ResponseEntity.ok(pageRecipes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    

    @GetMapping("/detail")
    public ResponseEntity<?> getRecipeById(@RequestParam String recipeId) {
        try {
            Map<String, Object> recipe = recipeService.getRecipeById(recipeId);
            return ResponseEntity.ok(recipe);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/dropdownrecipe")
    public ResponseEntity<List<String>> getUniqueRecipeIds(@RequestParam(defaultValue = "") String query){
        return ResponseEntity.ok(recipeService.findUniqueRecipeIds(query));
    }

    @GetMapping("/dropdownjobid")
    public ResponseEntity<List<String>> getfindUniqueJobIds(@RequestParam(defaultValue = "") String query){
        return ResponseEntity.ok(recipeService.findUniqueJobIds(query));
    }
}
