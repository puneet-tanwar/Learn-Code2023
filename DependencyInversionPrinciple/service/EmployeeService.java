package service;

import model.Employee;
import repository.EmployeeRepository;

public class EmployeeService {

  private EmployeeRepository employeeRepository;

  public EmployeeService(EmployeeRepository employeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  public void saveEmployee(Employee employee) {
    employeeRepository.save(employee);
  }
}
