import { Injectable } from '@angular/core';
import {
  Employee,
  EmployeeDictionary,
  EmployeeRoles,
} from '../interfaces/employee.interface';

@Injectable({ providedIn: 'root' })
export class CsvReadService {
  employeeMap: EmployeeDictionary = {};
  root: Employee | undefined = undefined;

  parseCsv(file: File): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const csvData = event.target.result;
        const lines =
          csvData.indexOf('\r') > -1
            ? csvData.split('\r\n')
            : csvData.split('\n');
        const headers = lines[0].split(',');
        const employeeList: Employee[] = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',');
          const employee: Employee = {
            email: row[0],
            fullName: row[1],
            role: row[2],
            reportsTo: row[3],
            row: i,
          };

          if (employee.role === 'Root') {
            this.root = employee;
          }
          this.employeeMap[employee.email] = employee;
          employeeList.push(employee);
        }
        resolve(employeeList);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  }

  validateCsvRules(employeeList: Employee[]): string[] {
    const errors: string[] = [];

    employeeList.forEach((employee) => {
      const { email, fullName, role, reportsTo, row } = employee;
      switch (role) {
        case EmployeeRoles.ROOT:
          if (reportsTo) {
            const parent = this.employeeMap[reportsTo];
            errors.push(
              `Row ${row} (${email}): ${fullName} is a Root but reports to ${parent.role} (${parent.fullName}).`
            );
          }
          break;

        case EmployeeRoles.ADMIN:
          if (!reportsTo) {
            errors.push(
              `Row ${row} (${email}): ${fullName} is an Admin but does not report to ROOT (${this.root?.fullName}).`
            );
          } else if (reportsTo.indexOf(';') > -1) {
            errors.push(
              `Row ${row} (${email}): ${fullName} is an Admin but reports to ${
                reportsTo.split(';').length
              } employees: ${reportsTo}.`
            );
          } else {
            const parent = this.employeeMap[reportsTo];
            if (parent.role != EmployeeRoles.ROOT) {
              errors.push(
                `Row ${row} (${email}): ${fullName} is an Admin but reports to ${parent.role} (${parent.fullName}), not Root.`
              );
            }
          }

          break;

        case EmployeeRoles.MANAGER:
          if (!reportsTo) {
            errors.push(
              `Row ${row} (${email}): ${fullName} is a Manager but does not report to an Admin or another Manager.`
            );
          } else if (reportsTo.indexOf(';') > -1) {
            errors.push(
              `Row ${row} (${email}): ${fullName} is a Manager but reports to ${
                reportsTo.split(';').length
              } employees: ${reportsTo}.`
            );
          } else {
            const parent = this.employeeMap[reportsTo];
            if (
              !(
                parent.role == EmployeeRoles.ADMIN ||
                parent.role == EmployeeRoles.MANAGER
              )
            ) {
              errors.push(
                `Row ${row} (${email}): ${fullName} is a Manager but reports to ${parent.role} (${parent.fullName}), not Admin or Manager.`
              );
            }
          }
          break;

        case EmployeeRoles.CALLER:
          if (!reportsTo) {
            errors.push(
              `Row ${row} (${email}): ${fullName} is a Caller but does not report to a Manager.`
            );
          } else if (reportsTo.indexOf(';') > -1) {
            errors.push(
              `Row ${row} (${email}): ${fullName} is a Caller but reports to ${
                reportsTo.split(';').length
              } employees: ${reportsTo}.`
            );
          } else {
            const parent = this.employeeMap[reportsTo];
            if (parent.role != EmployeeRoles.MANAGER) {
              errors.push(
                `Row ${row} (${email}): ${fullName} is a Caller but reports to ${parent.role} (${parent.fullName}), not Manager.`
              );
            }
          }
          break;
      }
    });

    return errors;
  }
}
