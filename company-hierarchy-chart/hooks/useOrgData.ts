import { useState } from 'react';
import { Employee } from '../types';

const initialEmployees: Employee[] = [
    { id: '1', firstName: 'Eleonora', lastName: 'Vance', position: 'CEO', department: 'Executive', email: 'ceo@company.com', phone: '111-222-3333', photoUrl: 'https://i.pravatar.cc/150?u=1', managerId: null },
    { id: '2', firstName: 'Marcus', lastName: 'Cole', position: 'CTO', department: 'Technology', email: 'cto@company.com', phone: '111-222-3334', photoUrl: 'https://i.pravatar.cc/150?u=2', managerId: '1' },
    { id: '3', firstName: 'Jenna', lastName: 'Simmons', position: 'CFO', department: 'Finance', email: 'cfo@company.com', phone: '111-222-3335', photoUrl: 'https://i.pravatar.cc/150?u=3', managerId: '1' },
    { id: '4', firstName: 'David', lastName: 'Chen', position: 'Lead Engineer', department: 'Technology', email: 'd.chen@company.com', phone: '111-222-3336', photoUrl: 'https://i.pravatar.cc/150?u=4', managerId: '2' },
    { id: '5', firstName: 'Aisha', lastName: 'Khan', position: 'Senior Accountant', department: 'Finance', email: 'a.khan@company.com', phone: '111-222-3337', photoUrl: 'https://i.pravatar.cc/150?u=5', managerId: '3' },
    { id: '6', firstName: 'Leo', lastName: 'Garcia', position: 'Software Engineer', department: 'Technology', email: 'l.garcia@company.com', phone: '111-222-3338', photoUrl: 'https://i.pravatar.cc/150?u=6', managerId: '4' },
];

export const useOrgData = () => {
    const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

    const addEmployee = (employee: Employee) => {
        setEmployees(prev => [...prev, employee]);
    };

    const updateEmployee = (updatedEmployee: Employee) => {
        setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
    };

    const deleteEmployee = (employeeId: string) => {
        setEmployees(prev => {
            // Reassign children of the deleted employee
            const updated = prev.map(emp => {
                if (emp.managerId === employeeId) {
                    return { ...emp, managerId: null }; // Make them root employees
                }
                return emp;
            });
            // Filter out the deleted employee
            return updated.filter(emp => emp.id !== employeeId);
        });
    };

    return { employees, setEmployees, addEmployee, updateEmployee, deleteEmployee };
};