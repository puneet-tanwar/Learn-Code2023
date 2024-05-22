package repository;

import model.Employee;

public interface EmployeeDataStore {
  void save(Employee employee);
}
