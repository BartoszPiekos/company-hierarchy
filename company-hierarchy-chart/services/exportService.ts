import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Employee } from '../types';

export const exportToPdf = (element: HTMLElement, filename: string) => {
    html2canvas(element, { 
        backgroundColor: '#0F172A', // Same as bg-slate-900
        scale: 2 // Increase scale for better resolution
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(filename);
    });
};

export const exportToJpg = (element: HTMLElement, filename: string) => {
    html2canvas(element, { 
        backgroundColor: '#0F172A', // Same as bg-slate-900
        scale: 2 
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    });
};

export const exportToCsv = (data: Employee[], filename: string) => {
    const headers = ['id', 'firstName', 'lastName', 'position', 'department', 'email', 'phone', 'managerId'];
    const csvRows = [
        headers.join(','),
        ...data.map(emp => headers.map(header => `"${emp[header as keyof Employee] ?? ''}"`).join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.click();
};