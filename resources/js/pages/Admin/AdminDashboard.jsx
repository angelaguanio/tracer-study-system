import React from 'react'
import AdminLayout from "@/layouts/admin-layout";

export default function AdminDashboard() {
  return (
    <div>AdminDashboard</div>
  )
}

AdminDashboard.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);