-- Brain Builders Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/hcjybeppnirrkmhwaejn/sql

-- Students table (Praptini)
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  year_level INTEGER DEFAULT 5,
  target_band INTEGER DEFAULT 8,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Practice sessions
CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0
);

-- Individual answers (for detailed analytics)
CREATE TABLE IF NOT EXISTS answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES practice_sessions(id),
  student_id UUID REFERENCES students(id),
  question_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INTEGER,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily streaks
CREATE TABLE IF NOT EXISTS daily_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  date DATE NOT NULL,
  questions_completed INTEGER DEFAULT 0,
  accuracy_percent INTEGER DEFAULT 0,
  UNIQUE(student_id, date)
);

-- Card collection
CREATE TABLE IF NOT EXISTS card_collection (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  card_id INTEGER NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, card_id)
);

-- Insert Praptini as default student
INSERT INTO students (name, year_level, target_band) 
VALUES ('Praptini', 5, 8)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (but allow all for now - simple setup)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_collection ENABLE ROW LEVEL SECURITY;

-- Policies (allow all reads/writes for anon - simple family app)
CREATE POLICY "Allow all" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON practice_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON answers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON daily_streaks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON card_collection FOR ALL USING (true) WITH CHECK (true);

-- Create view for parent dashboard
CREATE OR REPLACE VIEW student_progress AS
SELECT 
  s.id as student_id,
  s.name,
  COUNT(DISTINCT ps.id) as total_sessions,
  COALESCE(SUM(ps.total_questions), 0) as total_questions,
  COALESCE(SUM(ps.correct_answers), 0) as total_correct,
  CASE 
    WHEN SUM(ps.total_questions) > 0 
    THEN ROUND((SUM(ps.correct_answers)::DECIMAL / SUM(ps.total_questions)) * 100)
    ELSE 0 
  END as overall_accuracy,
  COALESCE(SUM(ps.duration_seconds) / 60, 0) as total_minutes_practiced
FROM students s
LEFT JOIN practice_sessions ps ON s.id = ps.student_id
GROUP BY s.id, s.name;

-- View for subject breakdown
CREATE OR REPLACE VIEW subject_performance AS
SELECT 
  student_id,
  subject,
  COUNT(*) as total_questions,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct,
  ROUND((SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100) as accuracy
FROM answers
GROUP BY student_id, subject;
