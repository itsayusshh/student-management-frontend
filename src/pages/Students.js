import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import { getStudents, deleteStudent } from '../api/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStudents();
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.students ?? data?.data ?? [];
      setStudents(list);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const name = [s.name, s.firstName, s.lastName].filter(Boolean).join(' ').toLowerCase();
    const email = (s.email || '').toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteStudent(deleteId);
      setStudents((prev) => prev.filter((s) => s.id !== deleteId && s._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const idKey = (s) => s.id ?? s._id;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Students</h1>
        <Link to="/students/new">
          <Button>Add Student</Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4">
          <input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm"
          />
        </div>

        {error && (
          <ErrorMessage message={error} onRetry={load} />
        )}

        {loading ? (
          <Loading message="Loading students..." />
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 py-8 text-center">
            {students.length === 0 ? 'No students yet.' : 'No students match your search.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Phone</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={idKey(s)} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {s.name || [s.firstName, s.lastName].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{s.email || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{s.phone || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/students/${idKey(s)}/edit`} className="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3">
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(idKey(s))}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={!!deleteId}
        onClose={() => !deleting && setDeleteId(null)}
        title="Delete student?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </>
        }
      >
        <p className="text-slate-600">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
