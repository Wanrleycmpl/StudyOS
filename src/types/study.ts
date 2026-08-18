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
