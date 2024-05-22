package service;

import model.Employee;
import repository.EmployeeDataStore;

public class EmployeeService {

  private EmployeeDataStore employeeDataStore;

  public EmployeeService(EmployeeDataStore employeeDataStore) {
    this.employeeDataStore = employeeDataStore;
  }

  public void saveEmployee(Employee employee) {
    employeeDataStore.save(employee);
  }
}
