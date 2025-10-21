import {
  CourseType,
  FlashcardType,
  QnaType,
  QuizResultType,
  QuizType,
  RecommendedCoursesType,
} from "@/types";
import { create } from "zustand";
import { useUserStore } from "./auth.store";
import axios from "axios";
import { CourseApis } from "@/assets/constants";
import { Alert } from "react-native";

interface CourseStoreInterface {
  enrolledCourseList: CourseType[];
  recommendedCourseList: RecommendedCoursesType[];
  selectedCourse: CourseType | null;
  Quizlist: QuizType[];
  QaList: QnaType[];
  FlashcardList: FlashcardType[];
  selectedQuiz: QuizType | null;
  selectedQa: QnaType | null;
  selectedFlashcard: FlashcardType | null;

  // functions
  // get all enrolledCourseList
  getCourseList: () => Promise<void>;
  // get all recommendedCourseList
  getRecommendedCourseList: () => Promise<void>;
  // get course info
  getCourseInfo: (course: CourseType) => Promise<void>;
  // enroll to course
  enrollToCourse: (courseId: string) => Promise<void | boolean>;
  // create course
  createCourse: (title: string) => Promise<void>;

  // compolete course chapter
  completeCourseChapter: (chapterId: number) => Promise<void | boolean>;

  // fetch QaList
  fetchQaList: () => Promise<void>;
  // fetch Qa Details
  fetchQaDetails: (qa: QnaType) => Promise<void>;

  // fetch flashcardList
  fetchFlashcardList: () => Promise<void>;
  // fetch Flashcard Details
  fetchFlashcardDetails: (flashcard: FlashcardType) => Promise<void>;

  // fetch quiz list
  fetchQuizList: () => Promise<void>;
  // fetch Quiz Details
  fetchQuizDetails: (quiz: QuizType) => Promise<void>;
  // submit Quiz
  submitQuiz: (result: QuizResultType[]) => Promise<void | boolean>;
  // reset Data
  resetCourseData: () => void;
}

export const useCourseStore = create<CourseStoreInterface>((set, get) => ({
  enrolledCourseList: [],
  recommendedCourseList: [],
  selectedCourse: null,
  Quizlist: [],
  FlashcardList: [],
  QaList: [],
  selectedFlashcard: null,
  selectedQa: null,
  selectedQuiz: null,
  // create Course
  createCourse: async (title: string) => {},
  // get all enrolledCourseList
  getCourseList: async () => {
    const token = useUserStore.getState().token;
    try {
      const response = await axios.get(CourseApis.getEnrolledCourses, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 400) throw new Error(response.data.message);
      set({ enrolledCourseList: response.data.courses });
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  },
  // get all recommendedCourseList
  getRecommendedCourseList: async () => {
    const token = useUserStore.getState().token;
    try {
      const response = await axios.get(CourseApis.getRecommendedCourses, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 400) throw new Error(response.data.message);
      set({ recommendedCourseList: response.data.courses });
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  },
  // get course info
  getCourseInfo: async (course) => {
    const token = useUserStore.getState().token;
    try {
      const response = await axios.get(
        CourseApis.getCourseById.replace(":courseId", course._id),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      set({ selectedCourse: { ...course, ...response.data.course } });
    } catch (error) {}
  },
  // enroll to course
  enrollToCourse: async (courseId) => {
    const token = useUserStore.getState().token;
    try {
      const response = await axios.post(
        CourseApis.enrollToCourse,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      set({
        selectedCourse: {
          ...get().selectedCourse!,
          _id: response.data.courseId,
          completedChapter: response.data.completedChapter,
        },
      });
      Alert.alert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => {
            get().getCourseList();
            get().getRecommendedCourseList();
          },
        },
      ]);
      return true;
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    }
  },
  // compolete course chapter
  completeCourseChapter: async (chapterId) => {
    const token = useUserStore.getState().token;
    const courseId = get().selectedCourse ? get().selectedCourse!._id : "";
    try {
      if (!token || !courseId) return;
      const response = await axios.put(
        CourseApis.completeCourseChapter,
        { courseId, chapterId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      Alert.alert("Success", response.data.message);
      get().getCourseInfo(get().selectedCourse!);
      get().getCourseList();
      return true;
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    }
  },

  // fetch flashcardList
  fetchFlashcardList: async () => {
    const token = useUserStore.getState().token;
    try {
      if (!token) return;
      const response = await axios.get(CourseApis.getAllFlashcardList, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 400) throw new Error(response.data.message);
      set({ FlashcardList: response.data.flashcards });
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    }
  },
  // fetchFlashcardDetails
  fetchFlashcardDetails: async (flashcard) => {
    const token = useUserStore.getState().token;
    try {
      if (!token || !flashcard || !flashcard._id) return;
      const response = await axios.get(
        CourseApis.getFlashcardContent.replace(":flashcardId", flashcard._id),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      set({
        selectedFlashcard: {
          ...flashcard,
          flashcardDetail: response.data.flashcardDetail,
        },
      });
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    }
  },

  // fetch QaList
  fetchQaList: async () => {
    const token = useUserStore.getState().token;
    try {
      if (!token) return;
      const response = await axios.get(CourseApis.getAllQnList, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 400) throw new Error(response.data.message);
      set({ QaList: response.data.qas });
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    }
  },
  // fetch QaDetails
  fetchQaDetails: async (qa) => {
    const token = useUserStore.getState().token;
    try {
      if (!token) return;
      const response = await axios.get(
        CourseApis.getQaContent.replace(":qaId", qa._id),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      set({ selectedQa: { ...qa, qaDetail: response.data.qaDetail } });
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    }
  },

  // fetch quizList
  fetchQuizList: async () => {
    const token = useUserStore.getState().token;
    try {
      if (!token) return;
      const response = await axios.get(CourseApis.getAllQuizes, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 400) throw new Error(response.data.message);
      set({ Quizlist: response.data.quizes });
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    }
  },
  // fetch quiz detials
  fetchQuizDetails: async (quiz) => {
    const token = useUserStore.getState().token;
    try {
      if (!token || !quiz || !quiz._id) return;
      const response = await axios.get(
        CourseApis.getQuizContent.replace(":quizId", quiz._id),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      set({ selectedQuiz: { ...quiz, quizDetail: response.data.quizDetail } });
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    }
  },
  // submit quiz result
  submitQuiz: async (result) => {
    const token = useUserStore.getState().token;
    const quizId = get().selectedQuiz?._id;
    try {
      if (!token || !quizId || !result.length) {
        Alert.alert("Error", "Please provide all the details");
        return;
      }
      const response = await axios.post(
        CourseApis.submitQuiz,
        { quizId, quizResult: result },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      Alert.alert("Success", response.data.message);
      get().fetchQuizList();
      return true;
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    }
  },
  // reset Data
  resetCourseData: () => {
    set({
      enrolledCourseList: [],
      recommendedCourseList: [],
      selectedCourse: null,
      Quizlist: [],
      FlashcardList: [],
      QaList: [],
      selectedFlashcard: null,
      selectedQa: null,
      selectedQuiz: null,
    });
  },
}));
