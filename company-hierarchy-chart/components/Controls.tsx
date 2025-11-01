import React from 'react';
import { AddIcon, CsvIcon, ImportIcon, JpgIcon, PdfIcon } from './icons';

interface ControlsProps {
    onAddEmployee: () => void;
    onExportPdf: () => void;
    onExportJpg: () => void;
    onExportCsv: () => void;
    onImportCsv: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
    onAddEmployee,
    onExportPdf,
    onExportJpg,
    onExportCsv,
    onImportCsv,
}) => {
    return (
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-4 rounded-lg flex flex-wrap items-center justify-center gap-4">
            <button
                onClick={onAddEmployee}
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded transition-colors"
            >
                <AddIcon /> Add Employee
            </button>
            <div className="flex items-center gap-4">
                 <button
                    onClick={onImportCsv}
                    className="flex items-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded transition-colors"
                    title="Import from CSV"
                >
                    <ImportIcon /> Import
                </button>
                 <div className="h-8 w-px bg-slate-600"></div>
                 <span className="text-slate-400 font-semibold">Export:</span>
                <button
                    onClick={onExportPdf}
                    className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    title="Export to PDF"
                >
                   <PdfIcon />
                </button>
                <button
                    onClick={onExportJpg}
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    title="Export to JPG"
                >
                    <JpgIcon />
                </button>
                <button
                    onClick={onExportCsv}
                    className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    title="Export to CSV"
                >
                    <CsvIcon />
                </button>
            </div>
        </div>
    );
};