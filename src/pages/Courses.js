import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getCourses } from '../api/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCourses()
      .then((res) => {
        const data = res.data;
        setCourses(Array.isArray(data) ? data : data?.courses ?? data?.data ?? []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to load courses');
      })
      .finally(() => setLoading(false));
  }, []);

  const idKey = (c) => c.id ?? c._id;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Courses</h1>
      <Card>
        {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}
        {loading ? (
          <Loading message="Loading courses..." />
        ) : courses.length === 0 ? (
          <p className="text-slate-500 py-8 text-center">No courses yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={idKey(c)} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{c.name || c.title || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{c.code || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{c.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
