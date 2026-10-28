import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [name, setName] = useState('')
  const [course, setCourse] = useState('BSIT')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  // READ: get all records from the students table
  async function loadStudents() {
    if (!supabase) {
      setError(
        'Supabase is not configured. Create a .env file in the project root with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server.'
      )
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('students')
      .select('id, name, course')
      .order('id')

    if (error) setError(error.message)
    else {
      setError(null)
      setStudents(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadStudents()
  }, [])

  // CREATE: insert a new record, then reload the list
  async function addStudent(e) {
    e.preventDefault()
    if (!supabase || !name.trim()) return
    setSaving(true)
    const { error } = await supabase
      .from('students')
      .insert({ name: name.trim(), course })

    if (error) setError(error.message)
    else {
      setName('')
      await loadStudents()
    }
    setSaving(false)
  }

  // DELETE: remove a record after confirmation
  async function deleteStudent(student) {
    if (!supabase || !window.confirm(`Delete ${student.name}? This cannot be undone.`)) {
      return
    }

    setDeletingId(student.id)
    setError(null)
    const { data, error } = await supabase
      .from('students')
      .delete()
      .eq('id', student.id)
      .select('id')

    if (error) {
      setError(error.message)
    } else if (!data?.length) {
      setError(
        'No student was deleted. Run the delete policy SQL from supabase-setup.sql in your Supabase project.'
      )
    } else {
      setStudents((currentStudents) =>
        currentStudents.filter((currentStudent) => currentStudent.id !== student.id)
      )
    }
    setDeletingId(null)
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Card 1: the list (matches the slide 10 JSX) */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold text-slate-900">Student Directory</h2>
          <p className="mt-2 text-slate-600">Records loaded from Supabase</p>

          {loading && <p className="mt-6 text-slate-500">Loading...</p>}

          {error && (
            <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              Error: {error}
            </p>
          )}

          {!loading && !error && (
            <table className="mt-6 w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm uppercase text-slate-500">
                  <th className="py-2">ID</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Course</th>
                  <th className="py-2"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100">
                    <td className="py-3 text-slate-500">{s.id}</td>
                    <td className="py-3 font-medium text-slate-900">{s.name}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                        {s.course}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteStudent(s)}
                        disabled={deletingId !== null || !supabase}
                        aria-label={`Delete ${s.name}`}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === s.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Card 2: add a record (Learning outcome: create a record) */}
        <form onSubmit={addStudent} className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-lg font-bold text-slate-900">Add a Student</h3>
          <p className="mt-1 text-sm text-slate-500">
            Use fictional names only.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              <option>BSIT</option>
              <option>BSCS</option>
              <option>BSIS</option>
            </select>
            <button
              type="submit"
              disabled={saving || !supabase}
              className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Add'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-500">
          React builds it • Tailwind styles it • Supabase provides the data
        </p>
      </div>
    </main>
  )
}
