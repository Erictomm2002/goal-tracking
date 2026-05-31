export interface Habit {
  title: string;
  subtitle: string;
  description?: string;
}

export interface Reward {
  name: string;
  price: number;
  deadline: string;
  image?: string;
  habits: Habit[];
}

export interface CheckInLog {
  date: string;
  checks: Record<string, boolean>;
  saving: number;
  note: string;
  donePct: number;
}

export interface Toast {
  msg: string;
  type: "ok" | "info";
}
