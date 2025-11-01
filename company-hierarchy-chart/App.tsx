import React, { useState, useRef, useCallback } from 'react';
import { useOrgData } from './hooks/useOrgData';
import { Controls } from './components/Controls';
import { OrgChart } from './components/OrgChart';
import { EmployeeModal } from './components/AddEmployeeModal';
import { Employee, TreeNode } from './types';
import { exportToPdf, exportToJpg, exportToCsv } from './services/exportService';
import { importFromCsv } from './services/importService';
import { HeaderIcon } from './components/icons';

const App: React.FC = () => {
    const { employees, setEmployees, addEmployee, updateEmployee, deleteEmployee } = useOrgData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingManagerId, setEditingManagerId] = useState<string | null>(null);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

    const chartRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const buildTree = useCallback((employeeList: Employee[]): TreeNode[] => {
        const employeeMap: { [key: string]: TreeNode } = {};
        employeeList.forEach(emp => {
            employeeMap[emp.id] = { ...emp, children: [] };
        });

        const tree: TreeNode[] = [];
        employeeList.forEach(emp => {
            if (emp.managerId && employeeMap[emp.managerId]) {
                employeeMap[emp.managerId].children.push(employeeMap[emp.id]);
            } else {
                tree.push(employeeMap[emp.id]);
            }
        });

        return tree;
    }, []);

    const orgTree = buildTree(employees);

    const handleAddRootEmployee = () => {
        setEditingManagerId(null);
        setEmployeeToEdit(null);
        setIsModalOpen(true);
    };
    
    const handleAddDirectReport = (managerId: string) => {
        setEditingManagerId(managerId);
        setEmployeeToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditEmployee = (employee: Employee) => {
        setEmployeeToEdit(employee);
        setEditingManagerId(employee.managerId);
        setIsModalOpen(true);
    };

    const handleDeleteEmployee = (employeeId: string) => {
        const employee = employees.find(e => e.id === employeeId);
        if (employee && window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
            deleteEmployee(employeeId);
        }
    };

    const handleSaveEmployee = (employee: Employee) => {
        if (employeeToEdit) {
            updateEmployee(employee);
        } else {
            addEmployee(employee);
        }
        setIsModalOpen(false);
        setEmployeeToEdit(null);
    };

    const handleExportPdf = () => {
        if (chartRef.current) {
            exportToPdf(chartRef.current, 'company-hierarchy.pdf');
        }
    };

    const handleExportJpg = () => {
        if (chartRef.current) {
            exportToJpg(chartRef.current, 'company-hierarchy.jpg');
        }
    };

    const handleExportCsv = () => {
        exportToCsv(employees, 'company-hierarchy.csv');
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const newEmployees = await importFromCsv(file);
                setEmployees(newEmployees);
                alert('Data imported successfully!');
            } catch (error) {
                console.error(error);
                alert(`Error importing data: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        if(event.target) {
            event.target.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
            <header className="bg-slate-800/50 backdrop-blur-sm p-4 sticky top-0 z-20 border-b border-slate-700">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <HeaderIcon />
                        <h1 className="text-2xl font-bold text-sky-400">Company Hierarchy Chart</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                <Controls
                    onAddEmployee={handleAddRootEmployee}
                    onExportPdf={handleExportPdf}
                    onExportJpg={handleExportJpg}
                    onExportCsv={handleExportCsv}
                    onImportCsv={handleImportClick}
                />
                <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="mt-8 overflow-x-auto pb-8 text-center">
                    {orgTree.length > 0 ? (
                         <div ref={chartRef} className="inline-block p-8 bg-slate-900">
                             <OrgChart 
                                tree={orgTree} 
                                onAddDirectReport={handleAddDirectReport}
                                onEdit={handleEditEmployee}
                                onDelete={handleDeleteEmployee}
                             />
                         </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-800 rounded-lg">
                            <p className="text-slate-400">No employees found. Start by adding an employee or importing a CSV file.</p>
                        </div>
                    )}
                </div>
            </main>

            {isModalOpen && (
                <EmployeeModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveEmployee}
                    employees={employees}
                    managerId={editingManagerId}
                    employeeToEdit={employeeToEdit}
                />
            )}
        </div>
    );
};

export default App;