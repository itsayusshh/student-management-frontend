import axios from "axios";

const API_BASE_URL = "https://student-management-api-qyuh.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
}); //
//  Attach JWT if present (for protected routes)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Students
export const getStudents = (params) => api.get("/students", { params });
export const getStudent = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post("/students", data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Courses
export const getCourses = (params) => api.get("/courses", { params });
export const getCourse = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post("/courses", data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Enrollments
export const getEnrollments = (params) => api.get("/enrollments", { params });
export const enrollStudent = (data) => api.post("/enrollments", data);
export const unenrollStudent = (enrollmentId) =>
  api.delete(`/enrollments/${enrollmentId}`);

// Dashboard / stats (common patterns)
export const getDashboardStats = () =>
  api.get("/dashboard/stats").catch(() => ({ data: null }));

// Auth
export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (data) => api.post("/auth/register", data);
export const getCurrentUser = () => api.get("/auth/me");

export default api;
