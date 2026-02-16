import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Praptini's student ID from Supabase
const STUDENT_ID = 'c7457a24-48b5-4c12-a3db-cd9ffb932c5d';

export function useProgress() {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Start a new practice session
  const startSession = async () => {
    try {
      const { data, error } = await supabase
        .from('practice_sessions')
        .insert({ 
          student_id: STUDENT_ID,
          started_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      setSessionId(data.id);
      return data.id;
    } catch (err) {
      console.error('Failed to start session:', err);
      return null;
    }
  };

  // Save an answer
  const saveAnswer = async (questionData, isCorrect) => {
    if (!sessionId) return;
    
    try {
      await supabase
        .from('answers')
        .insert({
          session_id: sessionId,
          student_id: STUDENT_ID,
          subject: questionData.subject,
          is_correct: isCorrect
        });
    } catch (err) {
      console.error('Failed to save answer:', err);
    }
  };

  // End session with stats
  const endSession = async (totalQuestions, correctAnswers, durationSeconds = 0) => {
    if (!sessionId) return;
    
    try {
      await supabase
        .from('practice_sessions')
        .update({
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          duration_seconds: durationSeconds
        })
        .eq('id', sessionId);
      
      setSessionId(null);
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  return {
    sessionId,
    startSession,
    saveAnswer,
    endSession,
    studentId: STUDENT_ID
  };
}

// Hook for parent dashboard
export function useParentDashboard() {
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [subjectBreakdown, setSubjectBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  const STUDENT_ID = 'c7457a24-48b5-4c12-a3db-cd9ffb932c5d';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Get all sessions
      const { data: sessionsData } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('student_id', STUDENT_ID)
        .order('started_at', { ascending: false });

      setSessions(sessionsData || []);

      // Calculate totals
      const totalQuestions = sessionsData?.reduce((sum, s) => sum + (s.total_questions || 0), 0) || 0;
      const totalCorrect = sessionsData?.reduce((sum, s) => sum + (s.correct_answers || 0), 0) || 0;
      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      // Get subject breakdown from answers
      const { data: answersData } = await supabase
        .from('answers')
        .select('subject, is_correct')
        .eq('student_id', STUDENT_ID);

      // Group by subject
      const bySubject = {};
      (answersData || []).forEach(answer => {
        if (!bySubject[answer.subject]) {
          bySubject[answer.subject] = { total: 0, correct: 0 };
        }
        bySubject[answer.subject].total++;
        if (answer.is_correct) bySubject[answer.subject].correct++;
      });

      const breakdown = Object.entries(bySubject).map(([subject, data]) => ({
        subject,
        total: data.total,
        correct: data.correct,
        accuracy: Math.round((data.correct / data.total) * 100)
      }));

      setSubjectBreakdown(breakdown);
      setStats({
        totalSessions: sessionsData?.length || 0,
        totalQuestions,
        totalCorrect,
        accuracy,
        lastPractice: sessionsData?.[0]?.started_at || null
      });

    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    sessions,
    subjectBreakdown,
    loading,
    refresh: fetchStats
  };
}
