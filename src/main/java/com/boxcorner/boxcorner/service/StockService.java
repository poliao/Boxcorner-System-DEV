package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.*;
import com.boxcorner.boxcorner.entity.dto.InventoryDTO;
import com.boxcorner.boxcorner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockService {

    private final UomRepository uomRepository;
    private final SupplierRepository supplierRepository;
    private final BrandRepository brandRepository;
    private final MaterialRepository materialRepository;
    private final MaterialConversionRepository materialConversionRepository;
    private final LotRepository lotRepository;
    private final MaterialTypeRepository materialTypeRepository;

    // --- UOM ---
    public List<Uom> getAllUoms() { return uomRepository.findAll(); }
    public Uom getUomById(Integer id) { return uomRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Uom not found")); }
    @Transactional public Uom saveUom(Uom uom) { 
        Uom existing;
        if (uom.getId() != null) {
            existing = uomRepository.findById(uom.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Uom not found"));
            existing.setName(uom.getName());
        } else {
            existing = uom;
        }
        return uomRepository.save(existing); 
    }
    @Transactional public void deleteUom(Integer id) { uomRepository.deleteById(id); }

    // --- Supplier ---
    public List<Supplier> getAllSuppliers() { return supplierRepository.findAll(); }
    public Supplier getSupplierById(Integer id) { return supplierRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Supplier not found")); }
    @Transactional public Supplier saveSupplier(Supplier supplier) { 
        Supplier existing;
        if (supplier.getId() != null) {
            existing = supplierRepository.findById(supplier.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));
            existing.setName(supplier.getName());
        } else {
            existing = supplier;
        }
        return supplierRepository.save(existing); 
    }
    @Transactional public void deleteSupplier(Integer id) { supplierRepository.deleteById(id); }

    // --- Brand ---
    public List<Brand> getAllBrands() { return brandRepository.findAll(); }
    public Brand getBrandById(Integer id) { return brandRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Brand not found")); }
    @Transactional public Brand saveBrand(Brand brand) { 
        Brand existing;
        if (brand.getId() != null) {
            existing = brandRepository.findById(brand.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Brand not found"));
            existing.setName(brand.getName());
        } else {
            existing = brand;
        }
        return brandRepository.save(existing); 
    }
    @Transactional public void deleteBrand(Integer id) { brandRepository.deleteById(id); }

    // --- Material Type ---
    public List<MaterialType> getAllMaterialTypes() { return materialTypeRepository.findAll(); }
    public MaterialType getMaterialTypeById(Integer id) { return materialTypeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Material Type not found")); }
    @Transactional public MaterialType saveMaterialType(MaterialType type) { 
        MaterialType existing;
        if (type.getId() != null) {
            existing = materialTypeRepository.findById(type.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Material Type not found"));
            existing.setName(type.getName());
        } else {
            existing = type;
        }
        return materialTypeRepository.save(existing); 
    }
    @Transactional public void deleteMaterialType(Integer id) { materialTypeRepository.deleteById(id); }

    // --- Material ---
    public List<Material> getAllMaterials() { return materialRepository.findAll(); }
    public Material getMaterialById(Integer id) { return materialRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Material not found")); }
    @Transactional public Material saveMaterial(Material material) { 
        Material existing;
        if (material.getId() != null) {
            existing = materialRepository.findById(material.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Material not found"));
            existing.setCode(material.getCode());
            existing.setName(material.getName());
        } else {
            existing = material;
        }

        if (material.getBaseUom() != null && material.getBaseUom().getId() != null) {
            existing.setBaseUom(uomRepository.getReferenceById(material.getBaseUom().getId()));
        } else {
            existing.setBaseUom(null);
        }

        if (material.getMaterialType() != null && material.getMaterialType().getId() != null) {
            existing.setMaterialType(materialTypeRepository.getReferenceById(material.getMaterialType().getId()));
        } else {
            existing.setMaterialType(null);
        }

        return materialRepository.save(existing); 
    }
    @Transactional public void deleteMaterial(Integer id) { materialRepository.deleteById(id); }

    // --- Material Conversion ---
    public List<MaterialConversion> getAllMaterialConversions() { return materialConversionRepository.findAll(); }
    public List<MaterialConversion> getMaterialConversionsByMaterialId(Integer materialId) { return materialConversionRepository.findByMaterialId(materialId); }
    public MaterialConversion getMaterialConversionById(Integer id) { return materialConversionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Conversion not found")); }
    @Transactional public MaterialConversion saveMaterialConversion(MaterialConversion conversion) { 
        MaterialConversion existing;
        if (conversion.getId() != null) {
            existing = materialConversionRepository.findById(conversion.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Conversion not found"));
            existing.setMultiplier(conversion.getMultiplier());
        } else {
            existing = conversion;
        }

        if (conversion.getMaterial() != null && conversion.getMaterial().getId() != null) {
            existing.setMaterial(materialRepository.getReferenceById(conversion.getMaterial().getId()));
        }
        if (conversion.getLargeUom() != null && conversion.getLargeUom().getId() != null) {
            existing.setLargeUom(uomRepository.getReferenceById(conversion.getLargeUom().getId()));
        }
        if (conversion.getSmallUom() != null && conversion.getSmallUom().getId() != null) {
            existing.setSmallUom(uomRepository.getReferenceById(conversion.getSmallUom().getId()));
        }
        return materialConversionRepository.save(existing); 
    }
    @Transactional public void deleteMaterialConversion(Integer id) { materialConversionRepository.deleteById(id); }

    // --- Lot ---
    public List<Lot> getAllLots() { return lotRepository.findAll(); }
    public List<Lot> getLotsByMaterialId(Integer materialId) { return lotRepository.findByMaterialId(materialId); }
    public Lot getLotById(Integer id) { return lotRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Lot not found")); }
    @Transactional public Lot saveLot(Lot lot) { 
        Lot existing;
        if (lot.getId() != null) {
            existing = lotRepository.findById(lot.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Lot not found"));
            existing.setLotNumber(lot.getLotNumber());
            existing.setReceiveQty(lot.getReceiveQty());
            existing.setBaseQty(lot.getBaseQty());
        } else {
            existing = lot;
        }

        if (lot.getMaterial() != null && lot.getMaterial().getId() != null) {
            existing.setMaterial(materialRepository.getReferenceById(lot.getMaterial().getId()));
        }
        if (lot.getSupplier() != null && lot.getSupplier().getId() != null) {
            existing.setSupplier(supplierRepository.getReferenceById(lot.getSupplier().getId()));
        }
        if (lot.getBrand() != null && lot.getBrand().getId() != null) {
            existing.setBrand(brandRepository.getReferenceById(lot.getBrand().getId()));
        }
        if (lot.getReceiveUom() != null && lot.getReceiveUom().getId() != null) {
            existing.setReceiveUom(uomRepository.getReferenceById(lot.getReceiveUom().getId()));
        }
        return lotRepository.save(existing); 
    }
    @Transactional public void deleteLot(Integer id) { lotRepository.deleteById(id); }

    // --- Inventory ---
    public List<InventoryDTO> getInventory() {
        List<Material> materials = materialRepository.findAll();
        return materials.stream().map(m -> {
            Double totalBaseQty = lotRepository.findByMaterialId(m.getId())
                    .stream()
                    .mapToDouble(Lot::getBaseQty)
                    .sum();
            
            List<MaterialConversion> conversions = materialConversionRepository.findByMaterialId(m.getId());
            String largeUomName = null;
            Double multiplier = 1.0;
            
            if (!conversions.isEmpty()) {
                MaterialConversion c = conversions.get(0);
                largeUomName = c.getLargeUom().getName();
                multiplier = c.getMultiplier();
            }

            return InventoryDTO.builder()
                    .materialId(m.getId())
                    .materialCode(m.getCode())
                    .materialName(m.getName())
                    .materialTypeName(m.getMaterialType() != null ? m.getMaterialType().getName() : "")
                    .baseUomName(m.getBaseUom() != null ? m.getBaseUom().getName() : "")
                    .totalBaseQty(totalBaseQty)
                    .largeUomName(largeUomName)
                    .multiplier(multiplier)
                    .build();
        }).toList();
    }
}
