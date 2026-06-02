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

-- Seed default categories
INSERT INTO expense_categories (name, icon, budget_amount, budget_period) VALUES
  ('Ăn uống', '🍜', 500000, 'weekly'),
  ('Xăng xe', '⛽', 200000, 'weekly'),
  ('Khác', '🎮', 300000, 'monthly')
ON CONFLICT DO NOTHING;
