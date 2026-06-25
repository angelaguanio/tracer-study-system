import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminAlumniCoordinatorForm({ editing, closeForm }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isResetChecked, setIsResetChecked] = useState(false);

  // DYNAMIC YEAR OPTIONS (2017 to 2026)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2017 + 1 },
    (_, i) => (2017 + i).toString()
  );

  const { data, setData, post, put, reset, errors, processing } = useForm({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    department: "CECT",
    courses: "",
    start_year: "",
    end_year: "",
    status: "active",
    reset_password: false,
  });

  // LOAD DATA WHEN EDITING
  useEffect(() => {
    if (editing) {
      setData({
        first_name: editing.first_name || "",
        last_name: editing.last_name || "",
        middle_name: editing.middle_name || "",
        email: editing.email || "",
        department: editing.department || "CECT",
        courses: editing.courses || "",
        start_year: editing.start_year ? editing.start_year.toString() : "",
        end_year: editing.end_year ? editing.end_year.toString() : "",
        status: editing.status || "active",
        reset_password: false,
      });
      setIsResetChecked(false);
    } else {
      reset();
    }
  }, [editing]);

  // MANAGING THE CHECKBOX TOGGLE
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsResetChecked(checked);
    setData("reset_password", checked);
  };

  // SUBMIT
  const submit = (e) => {
    e.preventDefault();

    if (data.start_year && data.end_year && Number(data.start_year) > Number(data.end_year)) {
      toast.error("End year must be greater than or equal to Start year.");
      return;
    }

    if (editing) {
      put(`/admin/alumni-coordinators/${editing.id}`, {
        preserveScroll: true,
        preserveState: false,
        onSuccess: () => {
          toast.success("Coordinator updated successfully!");
          reset();
          closeForm();
        },
        onError: () => {
          toast.error("Failed to update coordinator. Please check the form.");
        },
      });
    } else {
      post("/admin/alumni-coordinators", {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Coordinator created successfully!");
          reset();
          closeForm();
        },
        onError: () => {
          toast.error("Failed to create coordinator. Please check the form.");
        },
      });
    }
  };

  return (
    /* FIXED: Nagdagdag ng 'overflow-y-auto' sa backdrop wrapper para ma-scroll ang buong modal sa mobile */
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      
      {/* FIXED: 'max-h-[calc(100vh-2rem)] flex flex-col' para magkasya sa screen at hindi lumagpas */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col my-auto max-h-[calc(100vh-2rem)] overflow-hidden">
        
        {/* HEADER - Adjusted padding para mas swabe sa maliit na screen */}
        <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-5 text-black shrink-0">
          <h2 className="text-base sm:text-lg font-semibold">
            {editing ? "Edit Coordinator" : "Add Coordinator"}
          </h2>
        </div>
        <hr className="shrink-0" />

        {/* FORM BODY - FIXED: 'overflow-y-auto' dito para ang mismong form content lang ang mag-scroll kapag mahaba */}
        <form onSubmit={submit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1 text-left">
          
          {/* NAME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700">First Name</label>
              <Input
                value={data.first_name}
                onChange={(e) => setData("first_name", e.target.value)}
                className="bg-white"
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs">{errors.first_name}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Last Name</label>
              <Input
                value={data.last_name}
                onChange={(e) => setData("last_name", e.target.value)}
                className="bg-white"
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs">{errors.last_name}</p>
              )}
            </div>
          </div>

          {/* MIDDLE + EMAIL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Middle Name</label>
              <Input
                value={data.middle_name}
                onChange={(e) => setData("middle_name", e.target.value)}
                placeholder="Optional"
                className="bg-white"
              />
              {errors.middle_name && (
                <p className="text-red-500 text-xs">{errors.middle_name}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Email Address</label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className="bg-white"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
          </div>

          {/* DEPARTMENT + PROGRAM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Department</label>
              <Select
                value={data.department}
                onValueChange={(val) => setData("department", val)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CECT">CECT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Assigned Program</label>
              <Select
                value={data.courses || undefined}
                onValueChange={(val) => setData("courses", val)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BSIT">BSIT</SelectItem>
                  <SelectItem value="BSCpE & BSEcE">BSCpE & BSEcE</SelectItem>
                </SelectContent>
              </Select>
              {errors.courses && (
                <p className="text-red-500 text-xs">{errors.courses}</p>
              )}
            </div>
          </div>

          {/* START YEAR + END YEAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* START YEAR */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Start Year</label>
              <Select
                value={data.start_year || undefined}
                onValueChange={(val) => setData("start_year", val)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select start year" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start">
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.start_year && (
                <p className="text-red-500 text-xs">{errors.start_year}</p>
              )}
            </div>

            {/* END YEAR */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700">End Year</label>
              <Select
                value={data.end_year || undefined}
                onValueChange={(val) => setData("end_year", val)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select end year" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start">
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.end_year && (
                <p className="text-red-500 text-xs">{errors.end_year}</p>
              )}
            </div>
          </div>

          {/* STATUS */}
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium text-gray-700">Status</label>
            <Select
              value={data.status}
              onValueChange={(val) => setData("status", val)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-xs">{errors.status}</p>
            )}
          </div>

          {/* PASSWORD INTERFACE WITH CHECKBOX FOR RESET */}
          {editing ? (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="resetPasswordCheck"
                  checked={isResetChecked}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                />
                <label 
                  htmlFor="resetPasswordCheck" 
                  className="text-xs sm:text-sm font-semibold text-gray-800 cursor-pointer select-none"
                >
                  Reset coordinator password to default?
                </label>
              </div>

              {isResetChecked && (
                <div className="space-y-1 animate-in fade-in duration-200">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value="CoordinatorCECT@2026"
                      readOnly
                      className="pr-10 bg-gray-50 text-gray-600 border-blue-200 font-mono font-bold text-xs sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-blue-600">
                    This will restore their access using the corporate temporary credentials.
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg text-[11px] sm:text-xs mt-2">
              <strong>Notice:</strong> A default password{" "}
              <span className="font-mono bg-blue-100 px-1 py-0.5 rounded mx-1 font-bold">
                CoordinatorCECT@2026
              </span>{" "}
              will be automatically generated. The coordinator will be forced to change it upon their first login.
            </div>
          )}

          {/* BUTTONS - Fixed alignment and height for touch-friendly taps */}
          <div className="flex justify-end gap-2 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeForm}
              disabled={processing}
              className="text-xs sm:text-sm h-9 sm:h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-8 text-xs sm:text-sm h-9 sm:h-10"
              disabled={processing}
            >
              {processing ? "Saving..." : editing ? "Update Changes" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}