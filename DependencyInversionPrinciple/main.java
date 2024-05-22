package main;

import model.Employee;
import repository.Database;
import repository.EmployeeRepository;
import service.EmployeeService;

public class Main {

  public static void main(String[] args) {
    EmployeeRepository employeeRepository = new Database();

    EmployeeService employeeService = new EmployeeService(employeeRepository);

    Employee employee = new Employee("John Doe", "1234 Elm Street");

    employeeService.saveEmployee(employee);
  }
}
