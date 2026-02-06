package com.boxcorner.boxcorner.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.Recipe;
import com.boxcorner.boxcorner.entity.dto.RecipeRequest;
import com.boxcorner.boxcorner.entity.dto.RecipeResponse;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.RecipeService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/save")
    public ResponseEntity<?> saveRecipe(@RequestBody RecipeRequest req, HttpServletRequest httpRequest) {
        RecipeResponse res = recipeService.saveOrUpdateRecipe(req, tokenService.getCurrentUser(httpRequest));
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/list")
    public ResponseEntity<?> getAllRecipes(
            @RequestParam(value = "recipeid", required = false) String recipeid,
            @RequestParam(value = "jobid", required = false) String jobid,
            @RequestParam(value = "jobName", required = false) String jobName,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            Page<Recipe> pageRecipes = recipeService.getAllRecipes(recipeid, jobid, jobName, page, size);
            return ResponseEntity.ok(pageRecipes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getRecipeById(@RequestParam("recipeId") String recipeId) {
        try {
            Map<String, Object> recipe = recipeService.getRecipeById(recipeId);
            return ResponseEntity.ok(recipe);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/detailByJo")
    public ResponseEntity<?> getRecipeByJobId(@RequestParam("jobId") String jobId) {
        try {
            List<Recipe> recipe = recipeService.getRecipeByJo(jobId);
            return ResponseEntity.ok(recipe);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/dropdownrecipe")
    public ResponseEntity<List<String>> getUniqueRecipeIds(
            @RequestParam(value = "query", defaultValue = "") String query) {
        return ResponseEntity.ok(recipeService.findUniqueRecipeIds(query));
    }

    @GetMapping("/dropdownjobid")
    public ResponseEntity<List<String>> getfindUniqueJobIds(
            @RequestParam(value = "query", defaultValue = "") String query) {
        return ResponseEntity.ok(recipeService.findUniqueJobIds(query));
    }

}
