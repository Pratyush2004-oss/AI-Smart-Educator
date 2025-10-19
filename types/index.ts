// auth type list
export type UserType = {
  name: string;
  email: string;
  domains: string[];
  quizMarks: number[];
  quiz: InitialQuizType[];
};

export type InitialQuizType = {
  question: string;
  options: string[];
  correctAns: string;
  category: string;
};

export type SignupInputType = {
  name: string;
  email: string;
  password: string;
  domains: string[];
};

export type LoginInputType = {
  email: string;
  password: string;
};

// course data types list
export type CourseType = {
  _id: string;
  courseTitle: string;
  category: string;
  difficulty: string;
  description: string;
  banner_image: string;
  chaptersCount: number;
  completedChaptersCount: number;
  createdAt: string;
  chapters: ChapterType[];
  completedChapter: number[];
};

export type RecommendedCoursesType = {
  domain: string;
  courses: CourseType[];
};

export type ChapterType = {
  chapterName: string;
  content: ContentType[];
};

export type ContentType = {
  code: string;
  example: string;
  explain: string;
  topic: string;
};

// flashcard types
export type FlashcardType = {
  _id: string;
  courseTitle: string;
  flashcardsCount: number;
  flashcardDetail: FlashcardContentType[];
};

export type FlashcardContentType = {
  front: string;
  back: string;
};

// qna types
export type QnaType = {
  _id: string;
  courseTitle: string;
  qaCount: number;
  qaDetail: QnaContentType[];
};

export type QnaContentType = {
  question: string;
  answer: string;
};

// quizes type
export type QuizType = {
  _id: string;
  courseTitle: string;
  quizesCount: number;
  quizesResult: number;
  quizDetail: QuizContentType[];
};

export type QuizContentType = {
  question: string;
  options: string[];
  correctAns: string;
};

// quiz result type
export type QuizResultType = {
  question: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
};
