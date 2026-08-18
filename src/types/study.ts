export type StudyType = "teoria" | "revisao" | "questoes";

export type StudySession = {
  date: string;
  duration_minutes: number;
};

export type QuestionLog = {
  correct_count: number;
  wrong_count: number;
};

export type Subject = {
  id: string;
  name: string;
  color: string;
  created_at: string;
};

export type StudySessionRecord = {
  id: string;
  subject_id: string;
  date: string;
  duration_minutes: number;
  type: StudyType;
};

export type QuestionLogRecord = {
  id: string;
  subject_id: string;
  date: string;
  bank: string;
  correct_count: number;
  wrong_count: number;
};
