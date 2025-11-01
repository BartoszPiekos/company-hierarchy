import React, { useState, useEffect } from 'react';
import { Employee } from '../types';

interface EmployeeModalProps {
    onClose: () => void;
    onSave: (employee: Employee) => void;
    employees: Employee[];
    managerId: string | null;
    employeeToEdit: Employee | null;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({ onClose, onSave, employees, managerId, employeeToEdit }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        position: '',
        department: '',
        email: '',
        phone: '',
        managerId: managerId,
    });
    
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (employeeToEdit) {
            setFormData({
                firstName: employeeToEdit.firstName,
                lastName: employeeToEdit.lastName,
                position: employeeToEdit.position,
                department: employeeToEdit.department,
                email: employeeToEdit.email,
                phone: employeeToEdit.phone,
                managerId: employeeToEdit.managerId,
            });
            setPhotoPreview(employeeToEdit.photoUrl || null);
        }
    }, [employeeToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const employeeData: Employee = {
            id: employeeToEdit?.id || new Date().getTime().toString(),
            ...formData,
            managerId: formData.managerId === 'null' ? null : formData.managerId,
            photoUrl: photoPreview || undefined,
        };
        onSave(employeeData);
    };

    const availableManagers = employees.filter(emp => emp.id !== employeeToEdit?.id);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-700">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-sky-400 mb-4">
                            {employeeToEdit ? 'Edit Employee' : 'Add New Employee'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="bg-slate-700 text-white p-2 rounded w-full focus:ring-2 focus:ring-sky-500 focus:outline-none" type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                            <input className="bg-slate-700 text-white p-2 rounded w-full focus:ring-2 focus:ring-sky-500 focus:outline-none" type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                            <input className="bg-slate-700 text-white p-2 rounded w-full focus:ring-2 focus:ring-sky-500 focus:outline-none" type="text" name="position" placeholder="Position" value={formData.position} onChange={handleChange} required />
                            <input className="bg-slate-700 text-white p-2 rounded w-full focus:ring-2 focus:ring-sky-500 focus:outline-none" type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
                            <input className="bg-slate-700 text-white p-2 rounded w-full focus:ring-2 focus:ring-sky-500 focus:outline-none" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            <input className="bg-slate-700 text-white p-2 rounded w-full focus:ring-2 focus:ring-sky-500 focus:outline-none" type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Photo</label>
                            <div className="flex items-center gap-4">
                                {photoPreview && <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover" />}
                                <input className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700" type="file" accept="image/*" onChange={handlePhotoChange} />
                            </div>
                        </div>
                         <div className="mt-4">
                            <label htmlFor="managerId" className="block text-sm font-medium text-slate-300 mb-2">Manager</label>
                            <select 
                                id="managerId"
                                name="managerId"
                                value={formData.managerId ?? 'null'}
                                onChange={handleChange}
                                className="bg-slate-700 text-white p-2 rounded w-full focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            >
                                <option value="null">None (Root Employee)</option>
                                {availableManagers.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.firstName} {emp.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 px-6 py-3 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded">Save Employee</button>
                    </div>
                </form>
            </div>
        </div>
    );
};