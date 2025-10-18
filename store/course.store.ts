import { CourseType, RecommendedCoursesType } from "@/types";
import { create } from "zustand";
import { useUserStore } from "./auth.store";
import axios from "axios";
import { CourseApis } from "@/assets/constants";
import { Alert } from "react-native";

interface CourseStoreInterface {
  enrolledCourseList: CourseType[];
  recommendedCourseList: RecommendedCoursesType[];
  selectedCourse: CourseType | null;

  // functions
  // get all enrolledCourseList
  getCourseList: () => Promise<void>;
  // get all recommendedCourseList
  getRecommendedCourseList: () => Promise<void>;
  // get course info
  getCourseInfo: (course: CourseType) => Promise<void>;
  // enroll to course
  enrollToCourse: (courseId: string) => Promise<void>;

  // reset Data
}

export const useCourseStore = create<CourseStoreInterface>((set, get) => ({
  enrolledCourseList: [],
  recommendedCourseList: [],
  selectedCourse: null,
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
      Alert.alert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => {
            get().getCourseList();
            get().getRecommendedCourseList();
          },
        },
      ]);
    } catch (error: any) {
      console.log(error);
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    }
  },
}));
