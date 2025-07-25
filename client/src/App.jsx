import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';

// Auth Pages (to be created)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Public Pages (to be created)
import Home from './pages/Home';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';

// Student Pages (to be created)
import StudentDashboard from './pages/student/StudentDashboard';
import MyCourses from './pages/student/MyCourses';
import CoursePlayer from './pages/student/CoursePlayer';

// Instructor Pages (to be created)
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import ManageCourses from './pages/instructor/ManageCourses';

// Components (to be created)
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} setUser={setUser} />
        
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={user ? <Navigate to={getDashboardRoute(user.role)} /> : <Login setUser={setUser} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to={getDashboardRoute(user.role)} /> : <Register setUser={setUser} />} 
            />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute user={user} allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute user={user} allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses" element={
              <ProtectedRoute user={user} allowedRoles={['admin']}>
                <AdminCourses />
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute user={user} allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/my-courses" element={
              <ProtectedRoute user={user} allowedRoles={['student']}>
                <MyCourses />
              </ProtectedRoute>
            } />
            <Route path="/student/course/:id" element={
              <ProtectedRoute user={user} allowedRoles={['student']}>
                <CoursePlayer />
              </ProtectedRoute>
            } />

            {/* Instructor Routes */}
            <Route path="/instructor/dashboard" element={
              <ProtectedRoute user={user} allowedRoles={['instructor']}>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/instructor/create-course" element={
              <ProtectedRoute user={user} allowedRoles={['instructor']}>
                <CreateCourse />
              </ProtectedRoute>
            } />
            <Route path="/instructor/manage-courses" element={
              <ProtectedRoute user={user} allowedRoles={['instructor']}>
                <ManageCourses />
              </ProtectedRoute>
            } />

            {/* Redirect based on user role */}
            <Route path="/dashboard" element={
              user ? (
                <Navigate to={getDashboardRoute(user.role)} />
              ) : (
                <Navigate to="/login" />
              )
            } />

            {/* 404 Page */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Page not found</p>
                  <a href="/" className="text-indigo-600 hover:text-indigo-800">
                    Return to Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

// Helper function to get dashboard route based on user role
function getDashboardRoute(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'instructor':
      return '/instructor/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/';
  }
}

export default App;
