"use client"

import { useState } from "react"
import VotingFormTable from "@/components/admin/VotingFormTable";
import Button from "@/components/ui/Button";
import EditPopup from "@/components/admin/EditPopup";

export default function AdminDashboard() {
  const [open, setOpen] = useState(false)

  const handleSave = (data: { col1: string; col2: string; col3: string }) => {
    // TODO: persist data to backend / update state
    console.log("Saved data:", data)
    setOpen(false)
  }

  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
          <button
            onClick={() => setOpen(true)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="mt-2 text-gray-600">
        <Button href="/admin/voting-forms">
          Add New Voting Form
        </Button>
      </div>

      <div className="mt-6">
        <VotingFormTable />
      </div>

      <EditPopup open={open} onClose={() => setOpen(false)} onSave={handleSave} />
    </main>
  )
}
