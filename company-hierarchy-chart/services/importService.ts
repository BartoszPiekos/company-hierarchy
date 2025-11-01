
import Papa from 'papaparse';
import { Employee } from '../types';

export const importFromCsv = (file: File): Promise<Employee[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const requiredHeaders = ['id', 'firstName', 'lastName', 'position', 'managerId'];
                const headers = results.meta.fields || [];

                if (!requiredHeaders.every(h => headers.includes(h))) {
                    return reject(new Error(`CSV must include headers: ${requiredHeaders.join(', ')}`));
                }

                const employees: Employee[] = results.data.map((row: any) => ({
                    id: row.id || '',
                    firstName: row.firstName || '',
                    lastName: row.lastName || '',
                    position: row.position || '',
                    department: row.department || '',
                    email: row.email || '',
                    phone: row.phone || '',
                    photoUrl: row.photoUrl || undefined,
                    managerId: row.managerId === 'null' || !row.managerId ? null : row.managerId,
                }));

                resolve(employees);
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};
