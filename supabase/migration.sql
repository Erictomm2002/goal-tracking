-- Migration: Create expense tracking tables
-- Run this in Supabase SQL Editor

-- Disable RLS to match existing app (no auth)
ALTER TABLE IF EXISTS expense_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS expenses DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS expense_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📦',
  budget_amount NUMERIC NOT NULL DEFAULT 0,
  budget_period TEXT NOT NULL DEFAULT 'monthly' CHECK (budget_period IN ('weekly', 'monthly'))
);

CREATE TABLE IF NOT EXISTS expenses (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT NOT NULL REFERENCES expense_categories(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_id);

-- Savings spending tracking (withdrawals from savings goal fund)
CREATE TABLE IF NOT EXISTS savings_spends (
  id BIGSERIAL PRIMARY KEY,
  amount NUMERIC NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE savings_spends DISABLE ROW LEVEL SECURITY;

-- Financial declarations (cash / bank balance snapshot)
CREATE TABLE IF NOT EXISTS finance_declarations (
  id BIGSERIAL PRIMARY KEY,
  cash NUMERIC NOT NULL DEFAULT 0,
  bank NUMERIC NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE finance_declarations DISABLE ROW LEVEL SECURITY;

-- Seed default categories
INSERT INTO expense_categories (name, icon, budget_amount, budget_period) VALUES
  ('Ăn uống', '🍜', 500000, 'weekly'),
  ('Xăng xe', '⛽', 200000, 'weekly'),
  ('Khác', '🎮', 300000, 'monthly')
ON CONFLICT DO NOTHING;

-- ============================================================
-- CRM Module: Personal CRM for iPos Sales
-- ============================================================

-- Contacts
CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  type TEXT,
  scale TEXT,
  current_software TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE crm_contacts DISABLE ROW LEVEL SECURITY;

-- Deals
CREATE TABLE IF NOT EXISTS crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  value NUMERIC,
  stage TEXT NOT NULL DEFAULT 'Tiếp cận',
  package TEXT,
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  lost_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE crm_deals DISABLE ROW LEVEL SECURITY;

-- Tasks
CREATE TABLE IF NOT EXISTS crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES crm_deals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  due_time TEXT,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE crm_tasks DISABLE ROW LEVEL SECURITY;

-- Notes
CREATE TABLE IF NOT EXISTS crm_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES crm_deals(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE crm_notes DISABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crm_deals_contact ON crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage ON crm_deals(stage);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_contact ON crm_tasks(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_deal ON crm_tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due_date ON crm_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_completed ON crm_tasks(completed);
CREATE INDEX IF NOT EXISTS idx_crm_notes_contact ON crm_notes(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_deal ON crm_notes(deal_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_updated ON crm_contacts(updated_at);

-- ============================================================
-- Seed data mẫu cho CRM
-- ============================================================

INSERT INTO crm_contacts (id, name, company, phone, email, type, scale, current_software, tags) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Nguyễn Văn A', 'Nhà hàng Hương Việt', '0901234567', 'a@huongviet.com', 'Nhà hàng', '1 cơ sở', 'KiotViet', '["prospect","warm"]'),
  ('a0000000-0000-0000-0000-000000000002', 'Trần Thị B', 'Café Maison', '0912345678', 'b@maison.com', 'Café', '1 cơ sở', 'Không dùng', '["prospect"]'),
  ('a0000000-0000-0000-0000-000000000003', 'Lê Văn C', 'Fastfood 3T', '0923456789', 'c@3tfastfood.com', 'Fastfood', '2–5 cơ sở', 'MISA', '["partner"]')
ON CONFLICT DO NOTHING;

INSERT INTO crm_deals (id, contact_id, title, value, stage, package, probability, expected_close_date) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Nhà hàng Hương Việt', 15000000, 'Demo', 'Chuyên nghiệp', 60, CURRENT_DATE + INTERVAL '7 days'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Café Maison', 5000000, 'Tiếp cận', 'Cơ bản', 20, CURRENT_DATE + INTERVAL '30 days'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'Fastfood 3T', 30000000, 'Báo giá', 'Doanh nghiệp', 80, CURRENT_DATE + INTERVAL '14 days')
ON CONFLICT DO NOTHING;

INSERT INTO crm_tasks (id, contact_id, deal_id, title, type, priority, due_date, due_time) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Demo iPos cho anh A', 'demo', 'high', CURRENT_DATE, '14:00'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Gọi lại tư vấn cho chị B', 'call', 'medium', CURRENT_DATE, '10:00'),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Gửi báo giá chi tiết', 'email', 'high', CURRENT_DATE + INTERVAL '1 day', '09:00'),
  ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', NULL, 'Hẹn gặp lại demo lần 2', 'meeting', 'low', CURRENT_DATE + INTERVAL '3 days', NULL),
  ('c0000000-0000-0000-0000-000000000005', NULL, NULL, 'Tìm hiểu thêm đối thủ cạnh tranh', 'other', 'low', CURRENT_DATE + INTERVAL '7 days', NULL)
ON CONFLICT DO NOTHING;

INSERT INTO crm_notes (id, contact_id, deal_id, content) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Khách quan tâm đến gói Chuyên nghiệp. **Cần demo trực tiếp** tại quán.'),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Chị B mới mở quán, chưa dùng phần mềm nào. Cần tư vấn từ đầu.\n- Quy mô nhỏ\n- Ngân sách eo hẹp'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Đã gửi báo giá qua email. Chờ phản hồi.')
ON CONFLICT DO NOTHING;
