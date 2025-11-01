import React from 'react';
import { TreeNode, Employee } from '../types';
import { AddIcon, EmailIcon, PhoneIcon, EditIcon, DeleteIcon } from './icons';

interface EmployeeNodeProps {
    node: TreeNode;
    onAddDirectReport: (managerId: string) => void;
    onEdit: (employee: Employee) => void;
    onDelete: (employeeId: string) => void;
    registerNodeRef: (element: HTMLDivElement | null) => void;
}

export const EmployeeNode: React.FC<EmployeeNodeProps> = ({ node, onAddDirectReport, onEdit, onDelete, registerNodeRef }) => {
    return (
        <div
            ref={registerNodeRef} 
            className="relative group bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg w-72 text-left p-4 transition-all duration-300 hover:shadow-cyan-500/10 hover:border-slate-600">
            <div className="flex items-start gap-4">
                <img
                    className="w-16 h-16 rounded-full shadow-lg border-2 border-slate-600"
                    src={node.photoUrl || `https://i.pravatar.cc/150?u=${node.id}`}
                    alt={`${node.firstName} ${node.lastName}`}
                />
                <div className="flex-1">
                    <h5 className="text-lg font-bold text-slate-50">{`${node.firstName} ${node.lastName}`}</h5>
                    <p className="text-sm font-semibold text-cyan-400">{node.position}</p>
                    <p className="text-sm text-slate-400">{node.department}</p>
                </div>
            </div>
            <div className="mt-4 text-sm text-slate-300 space-y-2 border-t border-slate-700/50 pt-3">
                 <div className="flex items-center gap-3">
                   <EmailIcon />
                   <a href={`mailto:${node.email}`} className="hover:text-cyan-400 break-all">{node.email}</a>
                 </div>
                 <div className="flex items-center gap-3">
                   <PhoneIcon />
                   <span>{node.phone}</span>
                 </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => onEdit(node)}
                    className="bg-slate-700 hover:bg-slate-600 text-white rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500"
                    title="Edit Employee"
                >
                    <EditIcon />
                </button>
                 <button
                    onClick={() => onDelete(node.id)}
                    className="bg-slate-700 hover:bg-slate-600 text-white rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500"
                    title="Delete Employee"
                >
                    <DeleteIcon />
                </button>
            </div>

            <button
                onClick={() => onAddDirectReport(node.id)}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 z-10"
                title="Add Direct Report"
            >
                <AddIcon />
            </button>
        </div>
    );
};