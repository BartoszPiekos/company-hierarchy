import React, { useState, useRef, useLayoutEffect } from 'react';
import { TreeNode, Employee } from '../types';
import { EmployeeNode } from './EmployeeNode';

interface OrgChartProps {
    tree: TreeNode[];
    onAddDirectReport: (managerId: string) => void;
    onEdit: (employee: Employee) => void;
    onDelete: (employeeId: string) => void;
}

interface SvgLine {
    id: string;
    path: string;
}

// Recursive component to layout nodes
const OrgTreeLevel: React.FC<Omit<OrgChartProps, 'tree'> & { nodes: TreeNode[], nodeRefs: React.MutableRefObject<Map<string, HTMLElement>> }> = ({ nodes, onAddDirectReport, onEdit, onDelete, nodeRefs }) => {
    return (
        <ul className="flex justify-center">
            {nodes.map(node => (
                <li key={node.id} className="flex flex-col items-center px-4">
                    <EmployeeNode
                        node={node}
                        onAddDirectReport={onAddDirectReport}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        registerNodeRef={(el) => {
                            if (el) nodeRefs.current.set(node.id, el);
                            else nodeRefs.current.delete(node.id);
                        }}
                    />
                    {node.children && node.children.length > 0 && (
                         <div className="mt-8">
                            <OrgTreeLevel
                                nodes={node.children}
                                onAddDirectReport={onAddDirectReport}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                nodeRefs={nodeRefs}
                            />
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};

// Main component with SVG line drawing logic
export const OrgChart: React.FC<OrgChartProps> = (props) => {
    const { tree } = props;
    const [lines, setLines] = useState<SvgLine[]>([]);
    const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const newLines: SvgLine[] = [];
        const container = containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        
        const allNodes: TreeNode[] = [];
        const flattenTree = (nodes: TreeNode[]) => {
            nodes.forEach(node => {
                allNodes.push(node);
                if (node.children) flattenTree(node.children);
            });
        };
        flattenTree(tree);

        allNodes.forEach(node => {
            if (!node.children || node.children.length === 0) return;

            const parentEl = nodeRefs.current.get(node.id);
            if (!parentEl) return;

            const childrenEls = node.children.map(child => nodeRefs.current.get(child.id)).filter(Boolean) as HTMLElement[];
            if (childrenEls.length !== node.children.length) return; // Wait until all children are rendered

            const parentRect = parentEl.getBoundingClientRect();
            const childrenRects = childrenEls.map(el => el.getBoundingClientRect());

            // Parent bottom-center coordinates, relative to container
            const pBottomX = parentRect.left - containerRect.left + parentRect.width / 2;
            const pBottomY = parentRect.top - containerRect.top + parentRect.height;
            
            const gap = childrenRects[0].top - parentRect.bottom;
            const midY = pBottomY + gap / 2;

            // Path from parent down to the horizontal line's level
            let path = `M ${pBottomX} ${pBottomY} L ${pBottomX} ${midY}`;

            if (childrenRects.length > 0) {
                 // Children top-center X coordinates
                const firstChildTopX = childrenRects[0].left - containerRect.left + childrenRects[0].width / 2;
                const lastChildTopX = childrenRects[childrenRects.length - 1].left - containerRect.left + childrenRects[childrenRects.length - 1].width / 2;

                // Horizontal line
                path += ` M ${firstChildTopX} ${midY} L ${lastChildTopX} ${midY}`;

                // Lines from horizontal bar up to each child
                childrenRects.forEach((childRect, i) => {
                    const childTopX = childRect.left - containerRect.left + childRect.width / 2;
                    const childTopY = childRect.top - containerRect.top;
                    path += ` M ${childTopX} ${midY} L ${childTopX} ${childTopY}`;
                });
            }
            
            newLines.push({ id: `line-${node.id}`, path });
        });

        // The dependency array [tree] already prevents this from running unnecessarily.
        // The conditional check was buggy and is removed for robustness.
        setLines(newLines);

    }, [tree]); // Re-calculate lines only when the tree structure changes.

    return (
        <div className="relative inline-block" ref={containerRef}>
            <svg className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                <g>
                    {lines.map(line => (
                        <path
                            key={line.id}
                            d={line.path}
                            stroke="#334155" // slate-700
                            strokeWidth="2"
                            fill="none"
                        />
                    ))}
                </g>
            </svg>
            <OrgTreeLevel nodes={tree} {...props} nodeRefs={nodeRefs} />
        </div>
    );
};