export interface CRMContact {
  id: string;
  name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  type: string | null;
  scale: string | null;
  currentSoftware: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CRMDeal {
  id: string;
  contactId: string;
  title: string;
  value: number | null;
  stage: string;
  package: string | null;
  probability: number | null;
  expectedCloseDate: string | null;
  lostReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CRMTask {
  id: string;
  contactId: string | null;
  dealId: string | null;
  title: string;
  type: string;
  priority: string;
  dueDate: string | null;
  dueTime: string | null;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
}

export interface CRMNote {
  id: string;
  contactId: string | null;
  dealId: string | null;
  content: string;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  company?: string;
  email?: string;
  address?: string;
  type?: string;
  scale?: string;
  currentSoftware?: string;
  tags?: string[];
}

export interface DealFormData {
  title: string;
  contactId: string;
  value?: number;
  stage: string;
  package?: string;
  probability?: number;
  expectedCloseDate?: string;
}

export interface TaskFormData {
  title: string;
  type: string;
  contactId?: string;
  dealId?: string;
  dueDate?: string;
  dueTime?: string;
  priority: string;
}

export interface NoteFormData {
  contactId?: string;
  dealId?: string;
  content: string;
}

export interface TodayDashboard {
  todayTasks: CRMTask[];
  urgentDeals: CRMDeal[];
  recentContacts: CRMContact[];
  pipelineStats: {
    openDeals: number;
    totalValue: number;
    todayTasksCount: number;
  };
}

export const STAGES = [
  "Tiếp cận",
  "Demo",
  "Báo giá",
  "Thương lượng",
  "Thắng",
  "Thua",
] as const;

export const STAGE_COLORS: Record<string, string> = {
  "Tiếp cận": "bg-gray-100 text-gray-700",
  "Demo": "bg-blue-100 text-blue-700",
  "Báo giá": "bg-amber-100 text-amber-700",
  "Thương lượng": "bg-purple-100 text-purple-700",
  "Thắng": "bg-green-100 text-green-700",
  "Thua": "bg-red-100 text-red-700",
};

export const PACKAGES = ["Cơ bản", "Chuyên nghiệp", "Doanh nghiệp"] as const;

export const CONTACT_TYPES = [
  "Nhà hàng",
  "Café",
  "Fastfood",
  "Bar",
  "Khác",
] as const;

export const CONTACT_SCALES = [
  "1 cơ sở",
  "2–5 cơ sở",
  "Chuỗi lớn",
] as const;

export const TASK_TYPES = [
  { value: "call", label: "Gọi điện", icon: "Phone" },
  { value: "meeting", label: "Gặp mặt", icon: "Handshake" },
  { value: "demo", label: "Demo", icon: "Monitor" },
  { value: "email", label: "Email", icon: "Mail" },
  { value: "quote", label: "Báo giá", icon: "FileText" },
  { value: "other", label: "Khác", icon: "MoreHorizontal" },
] as const;

export const TASK_TYPE_COLORS: Record<string, string> = {
  call: "bg-blue-100 text-blue-700",
  meeting: "bg-purple-100 text-purple-700",
  demo: "bg-orange-100 text-orange-700",
  email: "bg-green-100 text-green-700",
  quote: "bg-amber-100 text-amber-700",
  other: "bg-gray-100 text-gray-700",
};

export const TAG_CHIPS = [
  "prospect",
  "warm",
  "partner",
  "churned",
] as const;
