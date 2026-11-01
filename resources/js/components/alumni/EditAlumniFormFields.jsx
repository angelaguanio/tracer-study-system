import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditAlumniFormFields({ data, setData, errors }) {
  return (
    <div className="space-y-4 py-1">
      {/* 1. Identity & Student Info */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
          Personal Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="edit-student-id" className="text-xs font-semibold text-gray-700">Student ID *</Label>
            <Input
              id="edit-student-id"
              value={data.student_id}
              onChange={(e) => setData("student_id", e.target.value)}
              placeholder="e.g. 22-0001-123"
              className="mt-1 h-9 text-sm bg-white"
            />
            {errors.student_id && <p className="text-xs text-red-600 mt-1">{errors.student_id}</p>}
          </div>

          <div>
            <Label htmlFor="edit-first-name" className="text-xs font-semibold text-gray-700">First Name *</Label>
            <Input
              id="edit-first-name"
              value={data.first_name}
              onChange={(e) => setData("first_name", e.target.value)}
              className="mt-1 h-9 text-sm bg-white"
            />
            {errors.first_name && <p className="text-xs text-red-600 mt-1">{errors.first_name}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="edit-middle-name" className="text-xs font-semibold text-gray-700">Middle Name</Label>
            <Input
              id="edit-middle-name"
              value={data.middle_name}
              onChange={(e) => setData("middle_name", e.target.value)}
              placeholder="Leave blank or *"
              className="mt-1 h-9 text-sm bg-white"
            />
          </div>

          <div>
            <Label htmlFor="edit-last-name" className="text-xs font-semibold text-gray-700">Last Name *</Label>
            <Input
              id="edit-last-name"
              value={data.last_name}
              onChange={(e) => setData("last_name", e.target.value)}
              className="mt-1 h-9 text-sm bg-white"
            />
            {errors.last_name && <p className="text-xs text-red-600 mt-1">{errors.last_name}</p>}
          </div>

          <div>
            <Label htmlFor="edit-suffix" className="text-xs font-semibold text-gray-700">Suffix</Label>
            <Input
              id="edit-suffix"
              value={data.suffix}
              onChange={(e) => setData("suffix", e.target.value)}
              placeholder="Jr., III, etc."
              className="mt-1 h-9 text-sm bg-white"
            />
          </div>
        </div>
      </div>

      {/* 2. Academic Information */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
          Academic Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="edit-department" className="text-xs font-semibold text-gray-700">Department *</Label>
            <Input
              id="edit-department"
              value={data.department}
              onChange={(e) => setData("department", e.target.value)}
              placeholder="e.g. CECT"
              className="mt-1 h-9 text-sm bg-white"
            />
            {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
          </div>

          <div>
            <Label htmlFor="edit-course" className="text-xs font-semibold text-gray-700">Program / Course *</Label>
            <Input
              id="edit-course"
              value={data.courses}
              onChange={(e) => setData("courses", e.target.value)}
              placeholder="e.g. BSIT"
              className="mt-1 h-9 text-sm bg-white"
            />
            {errors.courses && <p className="text-xs text-red-600 mt-1">{errors.courses}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="edit-start-year" className="text-xs font-semibold text-gray-700">Start Year</Label>
            <Input
              id="edit-start-year"
              type="number"
              value={data.start_year}
              onChange={(e) => setData("start_year", e.target.value)}
              placeholder="2021"
              className="mt-1 h-9 text-sm bg-white"
            />
          </div>
          <div>
            <Label htmlFor="edit-end-year" className="text-xs font-semibold text-gray-700">Graduation Year</Label>
            <Input
              id="edit-end-year"
              type="number"
              value={data.end_year}
              onChange={(e) => setData("end_year", e.target.value)}
              placeholder="2025"
              className="mt-1 h-9 text-sm bg-white"
            />
          </div>
          <div>
            <Label htmlFor="edit-semester" className="text-xs font-semibold text-gray-700">Semester</Label>
            <Input
              id="edit-semester"
              value={data.semester}
              onChange={(e) => setData("semester", e.target.value)}
              placeholder="1st Semester"
              className="mt-1 h-9 text-sm bg-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Contact Information */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
          Contact Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="edit-email" className="text-xs font-semibold text-gray-700">Email Address</Label>
            <Input
              id="edit-email"
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              placeholder="student@example.com"
              className="mt-1 h-9 text-sm bg-white"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="edit-contact" className="text-xs font-semibold text-gray-700">Contact Number</Label>
            <Input
              id="edit-contact"
              value={data.contact_number}
              onChange={(e) => setData("contact_number", e.target.value)}
              placeholder="09123456789"
              className="mt-1 h-9 text-sm bg-white"
            />
            {errors.contact_number && <p className="text-xs text-red-600 mt-1">{errors.contact_number}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
