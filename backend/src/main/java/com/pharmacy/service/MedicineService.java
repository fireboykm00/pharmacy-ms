package com.pharmacy.service;

import com.pharmacy.dto.MedicineDTO;
import com.pharmacy.model.Medicine;
import com.pharmacy.model.Supplier;
import com.pharmacy.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineService {
    
    private final MedicineRepository medicineRepository;
    private final SupplierService supplierService;
    
    public List<MedicineDTO> getAllMedicines() {
        return medicineRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public MedicineDTO getMedicineById(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        return convertToDTO(medicine);
    }
    
    public MedicineDTO createMedicine(MedicineDTO medicineDTO) {
        Medicine medicine = convertToEntity(medicineDTO);
        Medicine savedMedicine = medicineRepository.save(medicine);
        return convertToDTO(savedMedicine);
    }
    
    public MedicineDTO updateMedicine(Long id, MedicineDTO medicineDTO) {
        Medicine existingMedicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        
        existingMedicine.setName(medicineDTO.getName());
        existingMedicine.setCategory(medicineDTO.getCategory());
        existingMedicine.setCostPrice(medicineDTO.getCostPrice());
        existingMedicine.setSellingPrice(medicineDTO.getSellingPrice());
        existingMedicine.setQuantity(medicineDTO.getQuantity());
        existingMedicine.setExpiryDate(medicineDTO.getExpiryDate());
        existingMedicine.setReorderLevel(medicineDTO.getReorderLevel());
        
        if (medicineDTO.getSupplierId() != null) {
            Supplier supplier = supplierService.getSupplierById(medicineDTO.getSupplierId());
            existingMedicine.setSupplier(supplier);
        }
        
        Medicine updatedMedicine = medicineRepository.save(existingMedicine);
        return convertToDTO(updatedMedicine);
    }
    
    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }
    
    public void updateStock(Long medicineId, int quantity) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        medicine.setQuantity(medicine.getQuantity() + quantity);
        medicineRepository.save(medicine);
    }
    
    public List<Medicine> getExpiredMedicines() {
        return medicineRepository.findByExpiryDateBefore(LocalDate.now());
    }
    
    public List<Medicine> getLowStockMedicines() {
        return medicineRepository.findLowStockMedicines();
    }
    
    private MedicineDTO convertToDTO(Medicine medicine) {
        MedicineDTO dto = new MedicineDTO();
        dto.setMedicineId(medicine.getMedicineId());
        dto.setName(medicine.getName());
        dto.setCategory(medicine.getCategory());
        dto.setCostPrice(medicine.getCostPrice());
        dto.setSellingPrice(medicine.getSellingPrice());
        dto.setQuantity(medicine.getQuantity());
        dto.setExpiryDate(medicine.getExpiryDate());
        dto.setReorderLevel(medicine.getReorderLevel());
        dto.setSupplierId(medicine.getSupplier().getSupplierId());
        dto.setSupplierName(medicine.getSupplier().getName());
        return dto;
    }
    
    private Medicine convertToEntity(MedicineDTO dto) {
        Medicine medicine = new Medicine();
        medicine.setName(dto.getName());
        medicine.setCategory(dto.getCategory());
        medicine.setCostPrice(dto.getCostPrice());
        medicine.setSellingPrice(dto.getSellingPrice());
        medicine.setQuantity(dto.getQuantity());
        medicine.setExpiryDate(dto.getExpiryDate());
        medicine.setReorderLevel(dto.getReorderLevel());
        
        Supplier supplier = supplierService.getSupplierById(dto.getSupplierId());
        medicine.setSupplier(supplier);
        
        return medicine;
    }
}
