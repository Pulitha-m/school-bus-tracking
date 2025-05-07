package com.BusTracking.backend.Service;

import com.BusTracking.backend.Enums.ExpenseCategory;
import com.BusTracking.backend.Enums.PaymentStatus;
import com.BusTracking.backend.Model.Expense;
import com.BusTracking.backend.Model.Salary;
import com.BusTracking.backend.Model.Shift;

import com.BusTracking.backend.Repository.DriverRepo;
import com.BusTracking.backend.Repository.SalaryRepository;
import com.BusTracking.backend.Repository.ShiftRepo;
// Hypothetical
import com.BusTracking.backend.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SalaryService {

    @Autowired
    private ShiftRepo shiftRepository;

    @Autowired
    private SalaryRepository salaryRepository;

    @Autowired
    private ExpenseService expenseService;


    @Autowired
    private UserRepo driverRepository; // Hypothetical

    private static final double BASIC_SALARY = 60000.0; // LKR 60,000 per month
    private static final double STANDARD_SHIFT_HOURS = 8.0; // 8 hours per shift
    private static final double MONTHLY_HOURS = 176.0; // 22 days * 8 hours
    private static final double HOURLY_RATE = BASIC_SALARY / MONTHLY_HOURS; // ~340.91 LKR/hour
    private static final double EPF_EMPLOYEE_RATE = 0.08; // 8% employee contribution
    private static final double EPF_EMPLOYER_RATE = 0.12; // 12% employer contribution
    private static final double ETF_RATE = 0.03; // 3% employer contribution
    private static final String UPLOAD_DIR = "Uploads/SalarySlips/";
    private static final String GENERATED_SLIP_DIR = "Uploads/GeneratedSlips/";

    public List<Salary> calculateMonthlySalaries() {
        YearMonth currentMonth = YearMonth.now();
        LocalDate startDate = currentMonth.atDay(1);
        LocalDate endDate = currentMonth.atEndOfMonth();

        List<Shift> shifts = shiftRepository.findByDateBetweenOrderByDriverIdAsc(startDate, endDate);
        Map<Long, List<Shift>> shiftsByDriver = shifts.stream()
                .collect(Collectors.groupingBy(Shift::getDriverId));

        return shiftsByDriver.entrySet().stream().map(entry -> {
            Long driverId = entry.getKey();
            List<Shift> driverShifts = entry.getValue();
            String username = driverRepository.findById(driverId)
                    .map(driver -> driver.getUsername())
                    .orElse("unknown@example.com");

            double totalOvertimeHours = driverShifts.stream()
                    .mapToDouble(shift -> {
                        long hours = shift.getTotalWorkedTime().toHours();
                        return hours > STANDARD_SHIFT_HOURS ? hours - STANDARD_SHIFT_HOURS : 0;
                    })
                    .sum();

            double overtimePay = totalOvertimeHours * HOURLY_RATE;
            double totalSalaryBeforeDeductions = BASIC_SALARY + overtimePay;
            double epfEmployee = totalSalaryBeforeDeductions * EPF_EMPLOYEE_RATE;
            double epfEmployer = totalSalaryBeforeDeductions * EPF_EMPLOYER_RATE;
            double epfTotal = epfEmployee + epfEmployer;
            double etf = totalSalaryBeforeDeductions * ETF_RATE;
            double netSalary = totalSalaryBeforeDeductions - epfEmployee;

            Salary salary = salaryRepository.findByDriverIdAndMonth(driverId, startDate)
                    .orElse(new Salary());
            salary.setDriverId(driverId);
            salary.setUsername(username);
            salary.setMonth(startDate);
            salary.setBasicSalary(BASIC_SALARY);
            salary.setOvertimePay(overtimePay);
            salary.setTotalSalary(netSalary);
            salary.setEpf(epfTotal);
            salary.setEtf(etf);
            // Only set status to PENDING for new records
            if (salary.getId() == null) {
                salary.setStatus("PENDING");
            }
            return salaryRepository.save(salary);
        }).collect(Collectors.toList());
    }

    public Salary uploadSalarySlip(Long driverId, LocalDate month, MultipartFile slip) throws IOException {
        System.out.println("Uploading salary slip for Driver ID: " + driverId + ", Month: " + month);

        String contentType = slip.getContentType();
        System.out.println("Received file type: " + contentType + ", File size: " + slip.getSize() + " bytes");

        if (!contentType.equals("image/png") && !contentType.equals("image/jpeg")) {
            throw new IllegalArgumentException("Only PNG or JPEG images are allowed");
        }

        Salary salary = salaryRepository.findByDriverIdAndMonth(driverId, month)
                .orElseThrow(() -> new IllegalArgumentException("Salary record not found"));

        byte[] imageBytes = slip.getBytes();
        salary.setSlipImage(imageBytes);
        salary.setStatus("PAID");

        Salary updated = salaryRepository.saveAndFlush(salary);
        System.out.println("✅ Saved with status: " + updated.getStatus());

        if ("PAID".equalsIgnoreCase(updated.getStatus())) {
            Expense expense = new Expense();
            expense.setDescription("Salary payment to driver ID: " + updated.getDriverId());
            expense.setAmount(BigDecimal.valueOf(updated.getTotalSalary()));
            expense.setDate(LocalDate.now());
            expense.setCategory(ExpenseCategory.SALARY);

            expenseService.saveExpense(expense);
            System.out.println("✅ Expense record added for salary payment");
        }

        return updated;
    }




    public Salary updatePaymentStatus(Long driverId, LocalDate month, String status) {
        Salary salary = salaryRepository.findByDriverIdAndMonth(driverId, month)
                .orElseThrow(() -> new IllegalArgumentException("Salary record not found"));
        salary.setStatus(status);
        return salaryRepository.save(salary);
    }

    public List<Salary> getAllSalaries() {
        return salaryRepository.findAll();
    }

}