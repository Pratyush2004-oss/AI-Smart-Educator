export const BASE_URL = "https://edu-yug-backend.vercel.app/api";
export const domains = [
  "Arts & Creativity",
  "Business & Finance",
  "Health & Fitness",
  "Science & Engineering",
  "Tech & Coding",
  "Mathematics",
  "Physics, Chemistry and Biology",
  "History and Mythology",
];

// apis
// user apis
export const UserApis = {
  registerUser: `${BASE_URL}/auth/register`,
  loginUser: `${BASE_URL}/auth/login`,
  checkAuth: `${BASE_URL}/auth/check-auth`,
  attemptInitialQuiz: `${BASE_URL}/auth/attempt-initial-quiz`,
  getLeaderBoard: `${BASE_URL}/auth/get-leaderboard`,
};

export const CourseApis = {
  // create and enroll course
  createCourse: `${BASE_URL}/courses/create-course`,
  enrollToCourse: `${BASE_URL}/courses/enroll-course`,

  // get course data and list
  getEnrolledCourses: `${BASE_URL}/courses/get-enrolled-courses`,
  getRecommendedCourses: `${BASE_URL}/courses/get-recommended-courses`,
  getCourseById: `${BASE_URL}/courses/get-course-content/:courseId`,
  completeCourseChapter: `${BASE_URL}/courses/complete-course-chapter`,

  // quiz apis
  getAllQuizes: `${BASE_URL}/courses/get-all-course-quizes`,
  getQuizContent: `${BASE_URL}/courses/get-single-quiz/:quizId`,
  submitQuiz: `${BASE_URL}/courses/quiz-submit`,
  getQuizResult: `${BASE_URL}/courses/get-quiz-result/:quizId`,

  // qna apis
  getAllQnList: `${BASE_URL}/courses/get-all-course-qnas`,
  getQaContent: `${BASE_URL}/courses/get-single-qa/:qaId`,

  // flashcard apis
  getAllFlashcardList: `${BASE_URL}/courses/get-all-flashcards`,
  getFlashcardContent: `${BASE_URL}/courses/get-single-flashcard/:flashcardId`,
};

export const Colors = {
  WHITE: "#fff",
  DARK_GREY: "#595959",
  PRIMARY: "#194aa4",
  PRIMARY_LIGHT: "#1d6dee",
  GRAY: "#858585",
  BG_GRAY: "#f2f2f2",
  BLACK: "#000",
  GREEN: "#41A67E",
  LIGHT_GREEN: "#dbffdd",
  RED: "#B8405E",
  LIGHT_RED: "#ffc8c4",
  LIGHT_GRAY: "#f2f2f2",
  ORANGE: "#FFA500",
};

export const PraticeOption = [
  {
    name: "Quiz",
    image: require("@/assets/images/quizz.png"),
    icon: require("@/assets/images/quiz.png"),
    path: "/quiz",
  },
  {
    name: "Flashcards",
    image: require("@/assets/images/flashcard.png"),
    icon: require("@/assets/images/layers.png"),
    path: "/flashcards",
  },
  {
    name: "Question & Ans",
    image: require("@/assets/images/notes.png"),
    icon: require("@/assets/images/qa.png"),
    path: "/questionAnswer",
  },
];

export const imageAssets = {
  "Tech-&-Coding-1.png": require("@/assets/images/Tech-&-Coding-1.png"),
  "Tech-&-Coding-2.png": require("@/assets/images/Tech-&-Coding-2.png"),
  "Tech-&-Coding-3.png": require("@/assets/images/Tech-&-Coding-3.png"),
  "Tech-&-Coding-4.png": require("@/assets/images/Tech-&-Coding-4.png"),
  "Tech-&-Coding-5.png": require("@/assets/images/Tech-&-Coding-5.png"),
  "Tech-&-Coding-6.png": require("@/assets/images/Tech-&-Coding-6.png"),
  "Health-&-Fitness-1.png": require("@/assets/images/Health-&-Fitness-1.png"),
  "Health-&-Fitness-2.png": require("@/assets/images/Health-&-Fitness-2.png"),
  "Health-&-Fitness-3.png": require("@/assets/images/Health-&-Fitness-3.png"),
  "Health-&-Fitness-4.png": require("@/assets/images/Health-&-Fitness-4.png"),
  "Health-&-Fitness-5.png": require("@/assets/images/Health-&-Fitness-5.png"),
  "Health-&-Fitness-6.png": require("@/assets/images/Health-&-Fitness-6.png"),
  "Business-&-Finance-1.png": require("@/assets/images/Business-&-Finance-1.png"),
  "Business-&-Finance-2.png": require("@/assets/images/Business-&-Finance-2.png"),
  "Business-&-Finance-3.png": require("@/assets/images/Business-&-Finance-3.png"),
  "Business-&-Finance-4.png": require("@/assets/images/Business-&-Finance-4.png"),
  "Business-&-Finance-5.png": require("@/assets/images/Business-&-Finance-5.png"),
  "Business-&-Finance-6.png": require("@/assets/images/Business-&-Finance-6.png"),
  "Arts-&-Creativity-1.png": require("@/assets/images/Arts-and-Creativity-1.png"),
  "Arts-&-Creativity-2.png": require("@/assets/images/Arts-and-Creativity-2.png"),
  "Arts-&-Creativity-3.png": require("@/assets/images/Arts-and-Creativity-3.png"),
  "Arts-&-Creativity-4.png": require("@/assets/images/Arts-and-Creativity-4.png"),
  "Arts-&-Creativity-5.png": require("@/assets/images/Arts-and-Creativity-5.png"),
  "Arts-&-Creativity-6.png": require("@/assets/images/Arts-and-Creativity-6.png"),
  "Science-&-Engineering-1.png": require("@/assets/images/Science-&-Engineering-1.png"),
  "Science-&-Engineering-2.png": require("@/assets/images/Science-&-Engineering-2.png"),
  "Science-&-Engineering-3.png": require("@/assets/images/Science-&-Engineering-3.png"),
  "Science-&-Engineering-4.png": require("@/assets/images/Science-&-Engineering-4.png"),
  "Science-&-Engineering-5.png": require("@/assets/images/Science-&-Engineering-5.png"),
  "Science-&-Engineering-6.png": require("@/assets/images/Science-&-Engineering-6.png"),
  "Mathematics-1.png": require("@/assets/images/Mathematics-1.png"),
  "Mathematics-2.png": require("@/assets/images/Mathematics-2.png"),
  "Mathematics-3.png": require("@/assets/images/Mathematics-3.png"),
  "Mathematics-4.png": require("@/assets/images/Mathematics-4.png"),
  "Mathematics-5.png": require("@/assets/images/Mathematics-5.png"),
  "Mathematics-6.png": require("@/assets/images/Mathematics-6.png"),
  "Physics,-Chemistry-and-Biology-1.png": require("@/assets/images/Physics,-Chemistry-and-Biology-1.png"),
  "Physics,-Chemistry-and-Biology-2.png": require("@/assets/images/Physics,-Chemistry-and-Biology-2.png"),
  "Physics,-Chemistry-and-Biology-3.png": require("@/assets/images/Physics,-Chemistry-and-Biology-3.png"),
  "Physics,-Chemistry-and-Biology-4.png": require("@/assets/images/Physics,-Chemistry-and-Biology-4.png"),
  "Physics,-Chemistry-and-Biology-5.png": require("@/assets/images/Physics,-Chemistry-and-Biology-5.png"),
  "Physics,-Chemistry-and-Biology-6.png": require("@/assets/images/Physics,-Chemistry-and-Biology-6.png"),
  "History-and-Mythology-1.png": require("@/assets/images/History-and-Mythology-1.png"),
  "History-and-Mythology-2.png": require("@/assets/images/History-and-Mythology-2.png"),
  "History-and-Mythology-3.png": require("@/assets/images/History-and-Mythology-3.png"),
  "History-and-Mythology-4.png": require("@/assets/images/History-and-Mythology-4.png"),
  "History-and-Mythology-5.png": require("@/assets/images/History-and-Mythology-5.png"),
  "History-and-Mythology-6.png": require("@/assets/images/History-and-Mythology-6.png"),
};

export const ProfileMenu = [
  {
    name: "My Course",
    icon: "book-outline", //Ionic Icons
    path: "/(tabs)",
    type: "",
    desc: "Get my progress on all my courses",
  },
  {
    name: "Leader Board",
    icon: "bar-chart",
    path: "/leaderboard",
    type: "",
    desc: "Check where you are in the leaderboard",
  },
  {
    name: "Explore",
    icon: "search-outline",
    path: "/(tabs)/explore",
    type: "",
    desc: "Explore new courses",
  },
  {
    name: "Course Progress",
    icon: "analytics-outline", //Ionic Icons
    path: "/(tabs)/progress",
    type: "",
    desc: "Get my progress on all my courses",
  },
  {
    name: "Quiz",
    icon: "help-circle-outline", //Ionic Icons
    path: "/practice/[type]",
    type: "Quiz",
    desc: "Get quizes on all my courses",
  },
  {
    name: "Flashcards",
    icon: "id-card-outline", //Ionic Icons
    path: "/practice/[type]",
    type: "Flashcards",
    desc: "Get flashcards on all my courses",
  },
  {
    name: "Question & Ans",
    icon: "chatbubbles-outline", //Ionic Icons
    path: "/practice/[type]",
    type: "Question & Ans",
    desc: "Get quizes on all my courses",
  },
  {
    name: "Feedbacks",
    icon: "chatbubble-outline", //Ionic Icons
    path: "/feedback",
    type: "",
    desc: "Provide your genuine feedback and queries",
  },
];
