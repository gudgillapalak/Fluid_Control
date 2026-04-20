export type AppRole = 'admin' | 'manager' | 'employee';

export interface Project {
  id: string;
  project_name: string;
  status: string;
  manager_id: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  dev_number: string | null;
  category: string | null;
  customer_name: string | null;
  scope: string | null;
  risk_classification: string | null;
  project_owner: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface ProjectAssignment {
  id: string;
  project_id: string;
  employee_id: string;
  assigned_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

// Status grouping helper for dashboard
export const groupStatus = (status: string): string => {
  const lower = status?.toLowerCase().trim() || '';
  if (lower.includes('completed') || lower.includes('done')) return 'Completed';
  if (lower.includes('on going') || lower.includes('ongoing') || lower.includes('in-process') || lower.includes('in process') || lower.includes('in progress')) return 'Ongoing';
  if (lower.includes('on hold') || lower.includes('on-hold')) return 'On Hold';
  if (lower.includes('on demand') || lower.includes('as & when')) return 'On Demand';
  if (lower.includes('feasibility') || lower.includes('quotation')) return 'Feasibility/Quotation';
  return 'Other';
};

export const STATUS_GROUP_COLORS: Record<string, string> = {
  'Completed': 'hsl(142, 71%, 45%)',
  'Ongoing': 'hsl(217, 91%, 60%)',
  'On Hold': 'hsl(38, 92%, 50%)',
  'On Demand': 'hsl(262, 83%, 58%)',
  'Feasibility/Quotation': 'hsl(199, 89%, 48%)',
  'Other': 'hsl(220, 9%, 46%)',
};
