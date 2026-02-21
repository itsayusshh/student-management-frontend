import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getDashboardStats, getStudents, getCourses, getEnrollments } from '../api/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, studentsRes, coursesRes, enrollRes] = await Promise.allSettled([
          getDashboardStats(),
          getStudents(),
          getCourses(),
          getEnrollments(),
        ]);
        if (statsRes.status === 'fulfilled' && statsRes.value?.data && typeof statsRes.value.data === 'object') {
          const body = statsRes.value.data;
          setStats(body.data || body);
        } else {
          const s = Array.isArray(studentsRes.value?.data) ? studentsRes.value.data.length : 0;
          const c = Array.isArray(coursesRes.value?.data) ? coursesRes.value.data.length : 0;
          const e = Array.isArray(enrollRes.value?.data) ? enrollRes.value.data.length : 0;
          setStats({ students: s, courses: c, enrollments: e });
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loading message="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  const cards = [
    {
      title: 'Total Students',
      value: stats?.students ?? 0,
      sub: 'Registered students',
      color: 'primary',
    },
    {
      title: 'Total Courses',
      value: stats?.courses ?? 0,
      sub: 'Available courses',
      color: 'emerald',
    },
    {
      title: 'Enrollments',
      value: stats?.enrollments ?? 0,
      sub: 'Student–course enrollments',
      color: 'violet',
    },
  ];

  const colorMap = {
    primary: 'bg-primary-50 text-primary-700 border-primary-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ title, value, sub, color }) => (
          <Card key={title}>
            <div className={`rounded-lg border p-4 ${colorMap[color] || colorMap.primary}`}>
              <p className="text-sm font-medium opacity-90">{title}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
              <p className="text-xs mt-1 opacity-80">{sub}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
