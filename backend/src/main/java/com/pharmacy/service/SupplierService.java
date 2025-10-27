package com.pharmacy.service;

import com.pharmacy.model.Supplier;
import com.pharmacy.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {
    
    private final SupplierRepository supplierRepository;
    
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }
    
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
    }
    
    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }
    
    public Supplier updateSupplier(Long id, Supplier supplier) {
        Supplier existingSupplier = getSupplierById(id);
        existingSupplier.setName(supplier.getName());
        existingSupplier.setContact(supplier.getContact());
        existingSupplier.setEmail(supplier.getEmail());
        return supplierRepository.save(existingSupplier);
    }
    
    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
}
