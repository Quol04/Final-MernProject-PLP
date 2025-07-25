import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user, allowedRoles }) => {
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified and user's role is not in the list, redirect to their dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }

  // If everything is okay, render the protected component
  return children;
};

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

export default ProtectedRoute;
