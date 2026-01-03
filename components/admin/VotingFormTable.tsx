"use client"

import { useEffect, useState } from "react"
import { getAllVotingForms, deleteVotingForm, VotingFormRow } from "@/lib/firestore/votingForm.admin"
import { Pencil, Trash2 } from "lucide-react"

export default function VotingFormTable() {
  const [rows, setRows] = useState<VotingFormRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const data = await getAllVotingForms()
    setRows(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this record?")
    if (!ok) return

    await deleteVotingForm(id)
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  if (loading) {
    return <p className="text-center">Loading...</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">#</th>
            <th className="border px-3 py-2">Candidate (MR)</th>
            <th className="border px-3 py-2">Party (MR)</th>
            <th className="border px-3 py-2">Election</th>
            <th className="border px-3 py-2">Number</th>
            <th className="border px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{index + 1}</td>
              <td className="border px-3 py-2">{row.candidateNameMr}</td>
              <td className="border px-3 py-2">{row.partyNameMr}</td>
              <td className="border px-3 py-2">{row.electionType}</td>
              <td className="border px-3 py-2">{row.candidateNumber}</td>

              <td className="border px-3 py-2">
                <div className="flex justify-center gap-3">
                  {/* Edit */}
                  <button
                    title="Edit"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => alert("Edit coming soon")}
                  >
                    <Pencil size={16} />
                  </button>

                  {/* Delete */}
                  <button
                    title="Delete"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(row.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
