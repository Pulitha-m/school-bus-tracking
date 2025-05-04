package com.BusTracking.backend.Model;

import com.BusTracking.backend.Enums.ExpenseCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Description is required")
    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull(message =   "Date is required"  )
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Category is required")
    private ExpenseCategory category;







}
