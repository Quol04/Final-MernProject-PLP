import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/admin/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => {
      setStats(res.data);
      setChartData([
        { label: "Users", value: res.data.totalUsers },
        { label: "Courses", value: res.data.totalCourses },
        { label: "Lessons", value: res.data.totalLessons },
        { label: "Enrollments", value: res.data.totalEnrollments }
      ]);
    });
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {stats ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <StatCard label="Users" value={stats.totalUsers} />
            <StatCard label="Courses" value={stats.totalCourses} />
            <StatCard label="Lessons" value={stats.totalLessons} />
            <StatCard label="Enrollments" value={stats.totalEnrollments} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">System Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* You can also add another chart */}
          <div className="bg-white mt-8 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Enrollments Over Time (Example)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={[{ day: "Mon", value: 30 }, { day: "Tue", value: 70 }, { day: "Wed", value: 40 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </AdminLayout>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded-lg shadow text-center">
    <p className="text-gray-500 text-sm">{label}</p>
    <h3 className="text-2xl font-bold text-indigo-700 mt-2">{value}</h3>
  </div>
);
export default AdminDashboard;