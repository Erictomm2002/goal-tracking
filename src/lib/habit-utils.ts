export const fmt = (n: number) => Number(n || 0).toLocaleString("vi-VN") + "đ";
export const todayStr = () => new Date().toISOString().slice(0, 10);
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
