import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://hcjybeppnirrkmhwaejn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjanliZXBwbmlycmttaHdhZWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjM4OTAsImV4cCI6MjA4Njc5OTg5MH0._MVrFRK0ZF-38imPzUblDG6jTekS9qDr1YGZX80jPD0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get or create student (Praptini)
export async function getOrCreateStudent(name = 'Praptini') {
  // First try to get existing student
  let { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('name', name)
    .single();

  if (!student) {
    // Create new student
    const { data: newStudent } = await supabase
      .from('students')
      .insert({ name, year_level: 5, target_band: 8 })
      .select()
      .single();
    student = newStudent;
  }

  return student;
}

// Start a practice session
export async function startSession(studentId) {
  const { data: session } = await supabase
    .from('practice_sessions')
    .insert({ student_id: studentId })
    .select()
    .single();
  
  return session;
}

// End a practice session
export async function endSession(sessionId, stats) {
  const { data } = await supabase
    .from('practice_sessions')
    .update({
      ended_at: new Date().toISOString(),
      total_questions: stats.total,
      correct_answers: stats.correct,
      duration_seconds: stats.duration
    })
    .eq('id', sessionId)
    .select()
    .single();
  
  return data;
}

// Save an answer
export async function saveAnswer(sessionId, studentId, answer) {
  const { data } = await supabase
    .from('answers')
    .insert({
      session_id: sessionId,
      student_id: studentId,
      question_id: answer.questionId,
      subject: answer.subject,
      difficulty: answer.difficulty,
      is_correct: answer.isCorrect,
      time_taken_seconds: answer.timeTaken
    })
    .select()
    .single();
  
  return data;
}

// Update daily streak
export async function updateDailyStreak(studentId, questionsCompleted, accuracy) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data } = await supabase
    .from('daily_streaks')
    .upsert({
      student_id: studentId,
      date: today,
      questions_completed: questionsCompleted,
      accuracy_percent: accuracy
    }, {
      onConflict: 'student_id,date'
    })
    .select()
    .single();
  
  return data;
}

// Save earned card
export async function saveEarnedCard(studentId, cardId) {
  const { data } = await supabase
    .from('card_collection')
    .insert({
      student_id: studentId,
      card_id: cardId
    })
    .select()
    .single();
  
  return data;
}

// Get student's card collection
export async function getCardCollection(studentId) {
  const { data } = await supabase
    .from('card_collection')
    .select('card_id, earned_at')
    .eq('student_id', studentId);
  
  return data || [];
}

// Get student progress (for parent dashboard)
export async function getStudentProgress(studentId) {
  const { data } = await supabase
    .from('student_progress')
    .select('*')
    .eq('student_id', studentId)
    .single();
  
  return data;
}

// Get subject performance breakdown
export async function getSubjectPerformance(studentId) {
  const { data } = await supabase
    .from('subject_performance')
    .select('*')
    .eq('student_id', studentId);
  
  return data || [];
}

// Get recent sessions
export async function getRecentSessions(studentId, limit = 7) {
  const { data } = await supabase
    .from('practice_sessions')
    .select('*')
    .eq('student_id', studentId)
    .order('started_at', { ascending: false })
    .limit(limit);
  
  return data || [];
}

// Get streak info
export async function getStreakInfo(studentId) {
  const { data: streaks } = await supabase
    .from('daily_streaks')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false })
    .limit(30);
  
  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  
  if (streaks && streaks.length > 0) {
    for (let i = 0; i < streaks.length; i++) {
      const streakDate = new Date(streaks[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (streakDate.toDateString() === expectedDate.toDateString()) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  return {
    currentStreak,
    recentDays: streaks || []
  };
}
