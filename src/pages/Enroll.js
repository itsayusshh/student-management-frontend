import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getStudents, getCourses, getEnrollments, enrollStudent, unenrollStudent } from '../api/api';

export default function Enroll() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sRes, cRes, eRes] = await Promise.all([
        getStudents(),
        getCourses(),
        getEnrollments(),
      ]);
      const sData = sRes.data;
      const cData = cRes.data;
      const eData = eRes.data;
      setStudents(Array.isArray(sData) ? sData : sData?.students ?? sData?.data ?? []);
      setCourses(Array.isArray(cData) ? cData : cData?.courses ?? cData?.data ?? []);
      setEnrollments(Array.isArray(eData) ? eData : eData?.enrollments ?? eData?.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const id = (s) => s.id ?? s._id;
  const studentById = (sid) => students.find((s) => id(s) === sid);
  const courseById = (cid) => courses.find((c) => id(c) === cid);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!studentId || !courseId) return;
    setSubmitting(true);
    setError(null);
    try {
      await enrollStudent({ studentId, courseId });
      await load();
      setStudentId('');
      setCourseId('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Enrollment failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnenroll = async (enrollment) => {
    const eid = enrollment.id ?? enrollment._id;
    try {
      await unenrollStudent(eid);
      setEnrollments((prev) => prev.filter((e) => (e.id ?? e._id) !== eid));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unenroll failed');
    }
  };

  if (loading) return <Loading message="Loading..." />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Enroll Students</h1>

      {error && <ErrorMessage message={error} onRetry={load} />}

      <Card title="New enrollment" className="mb-6">
        <form onSubmit={handleEnroll} className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm"
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={id(s)} value={id(s)}>
                  {s.name || [s.firstName, s.lastName].filter(Boolean).join(' ') || s.email}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm"
            >
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={id(c)} value={id(c)}>
                  {c.name || c.title} {c.code ? `(${c.code})` : ''}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={submitting || !studentId || !courseId}>
            {submitting ? 'Enrolling...' : 'Enroll'}
          </Button>
        </form>
      </Card>

      <Card title="Current enrollments">
        {enrollments.length === 0 ? (
          <p className="text-slate-500 py-4">No enrollments yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {enrollments.map((e) => {
              const sid = e.studentId ?? e.student;
              const cid = e.courseId ?? e.course;
              const s = studentById(sid);
              const c = courseById(cid);
              return (
                <li key={e.id ?? e._id} className="py-3 flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-800">
                    {s ? (s.name || [s.firstName, s.lastName].filter(Boolean).join(' ') || s.email) : 'Unknown'} → {c ? (c.name || c.title) : 'Unknown'}
                  </span>
                  <Button variant="ghost" onClick={() => handleUnenroll(e)}>
                    Unenroll
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
