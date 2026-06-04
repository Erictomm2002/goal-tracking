export const fmt = (n: number) => Number(n || 0).toLocaleString("vi-VN") + "đ";

export const localDateStr = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const todayStr = () => localDateStr(new Date());
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
