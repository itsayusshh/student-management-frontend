import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getStudent, createStudent, updateStudent } from '../api/api';

const initialValues = { name: '', email: '', phone: '' };

function getErrors(values) {
  const err = {};
  if (!values.name?.trim()) err.name = 'Name is required';
  if (!values.email?.trim()) err.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) err.email = 'Invalid email';
  return err;
}

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    getStudent(id)
      .then((res) => {
        if (cancelled) return;
        const d = res.data?.data || res.data;
        setValues({
          name: d.name ?? [d.firstName, d.lastName].filter(Boolean).join(' ') ?? '',
          email: d.email ?? '',
          phone: d.phone ?? '',
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load student');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = getErrors(values);
    setErrors(err);
    if (Object.keys(err).length) return;

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
      };
      if (isEdit) {
        await updateStudent(id, payload);
      } else {
        await createStudent(payload);
      }
      navigate('/students');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading student..." />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        {isEdit ? 'Edit Student' : 'Add Student'}
      </h1>
      <Card className="max-w-lg">
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="John Doe"
            autoFocus
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="john@example.com"
          />
          <Input
            label="Phone (optional)"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+1 234 567 8900"
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/students')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
