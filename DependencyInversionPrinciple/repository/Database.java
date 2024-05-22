package repository;

import model.Employee;

public class Database implements EmployeeDataStore {

  @Override
  public void save(Employee employee) {
    System.out.println(
      "Employee saved to the database: " +
      employee.getName() +
      ", " +
      employee.getAddress()
    );
  }
}
