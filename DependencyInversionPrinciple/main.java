package main;

import model.Employee;
import repository.Database;
import repository.EmployeeDataStore;
import service.EmployeeService;

public class Main {

  public static void main(String[] args) {
    EmployeeDataStore employeeDataStore = new Database();

    EmployeeService employeeService = new EmployeeService(employeeDataStore);

    Employee employee = new Employee("John Doe", "1234 Elm Street");

    employeeService.saveEmployee(employee);
  }
}
