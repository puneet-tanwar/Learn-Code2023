export interface User {
  name: string;
  email: string; 
  password: string;
  role: UserRole;
}

export enum UserRole {
  Admin = 'admin',
  Chef = 'chef',
  Employee = 'employee',
}