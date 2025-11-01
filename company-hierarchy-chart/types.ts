
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  photoUrl?: string;
  managerId: string | null;
}

export interface TreeNode extends Employee {
  children: TreeNode[];
}
