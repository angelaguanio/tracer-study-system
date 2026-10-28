import React, { useState, useMemo } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { toast } from 'sonner';
import {
  Building2,
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Users,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  BookOpen,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminSettings({ departments = [] }) {
  const { flash } = usePage().props;

  // Selected Department for department-first hierarchical view
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || null);

  const selectedDepartment = useMemo(() => {
    return departments.find((d) => d.id === selectedDeptId) || departments[0] || null;
  }, [departments, selectedDeptId]);

  // Overall Statistics
  const totalPrograms = useMemo(() => {
    return departments.reduce((acc, d) => acc + (d.programs?.length || 0), 0);
  }, [departments]);

  const totalAlumni = useMemo(() => {
    return departments.reduce((acc, d) => acc + (d.alumni_count || 0), 0);
  }, [departments]);

  // --- Department Modal State ---
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const deptForm = useForm({
    name: '',
    code: '',
    status: 'active',
  });

  const openAddDeptModal = () => {
    setEditingDept(null);
    deptForm.reset();
    deptForm.setData({ name: '', code: '', status: 'active' });
    setDeptModalOpen(true);
  };

  const openEditDeptModal = (dept, e) => {
    e?.stopPropagation();
    setEditingDept(dept);
    deptForm.setData({
      name: dept.name,
      code: dept.code,
      status: dept.status,
    });
    setDeptModalOpen(true);
  };

  const submitDept = (e) => {
    e.preventDefault();
    if (editingDept) {
      deptForm.put(route('admin.settings.departments.update', editingDept.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Department updated successfully.');
          setDeptModalOpen(false);
        },
        onError: () => toast.error('Failed to update department. Please check fields.'),
      });
    } else {
      deptForm.post(route('admin.settings.departments.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Department added successfully.');
          setDeptModalOpen(false);
          deptForm.reset();
        },
        onError: () => toast.error('Failed to add department. Please check fields.'),
      });
    }
  };

  // --- Program Modal State ---
  const [progModalOpen, setProgModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState(null);

  const progForm = useForm({
    department_id: '',
    name: '',
    code: '',
    status: 'active',
  });

  const openAddProgModal = (deptId = null) => {
    setEditingProg(null);
    progForm.reset();
    progForm.setData({
      department_id: deptId || selectedDepartment?.id || '',
      name: '',
      code: '',
      status: 'active',
    });
    setProgModalOpen(true);
  };

  const openEditProgModal = (prog, e) => {
    e?.stopPropagation();
    setEditingProg(prog);
    progForm.setData({
      department_id: prog.department_id,
      name: prog.name,
      code: prog.code,
      status: prog.status,
    });
    setProgModalOpen(true);
  };

  const submitProg = (e) => {
    e.preventDefault();
    if (editingProg) {
      progForm.put(route('admin.settings.programs.update', editingProg.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Program updated successfully.');
          setProgModalOpen(false);
        },
        onError: () => toast.error('Failed to update program. Please check fields.'),
      });
    } else {
      progForm.post(route('admin.settings.programs.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Program added successfully.');
          setProgModalOpen(false);
          progForm.reset();
        },
        onError: () => toast.error('Failed to add program. Please check fields.'),
      });
    }
  };

  // --- Delete Safety Confirmation ---
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: null, // 'department' | 'program'
    item: null,
  });

  const confirmDeleteDept = (dept, e) => {
    e?.stopPropagation();
    setDeleteDialog({
      open: true,
      type: 'department',
      item: dept,
    });
  };

  const confirmDeleteProg = (prog, e) => {
    e?.stopPropagation();
    setDeleteDialog({
      open: true,
      type: 'program',
      item: prog,
    });
  };

  const executeDelete = () => {
    if (deleteDialog.type === 'department') {
      router.delete(route('admin.settings.departments.destroy', deleteDialog.item.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Department deleted successfully.');
          setDeleteDialog({ open: false, type: null, item: null });
        },
        onError: () => {
          toast.error('Cannot delete this department while records are attached.');
          setDeleteDialog({ open: false, type: null, item: null });
        },
      });
    } else if (deleteDialog.type === 'program') {
      router.delete(route('admin.settings.programs.destroy', deleteDialog.item.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Program deleted successfully.');
          setDeleteDialog({ open: false, type: null, item: null });
        },
        onError: () => {
          toast.error('Cannot delete this program while alumni are attached.');
          setDeleteDialog({ open: false, type: null, item: null });
        },
      });
    }
  };

  return (
    <AdminLayout>
      <Head title="Program Management - Departments & Programs" />

      <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <GraduationCap className="w-5 h-5" />
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Program Management</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Configure colleges/departments and degree programs. Changes immediately propagate across alumni registration, coordinator assignments, and directory filters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={openAddDeptModal}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-2 px-4 h-11"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Departments</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{departments.length}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Programs</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{totalPrograms}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Alumni Mapped</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{totalAlumni}</p>
            </div>
          </div>
        </div>

        {/* Main Two-Column Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Departments List (Click to select & view programs) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-base font-bold text-gray-900">Select Department</h2>
                <p className="text-xs text-gray-500">Click a department to view its specific programs</p>
              </div>
              <Badge variant="outline" className="text-xs font-semibold">
                {departments.length} Total
              </Badge>
            </div>

            <div className="space-y-2.5">
              {departments.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-3">
                  <Building2 className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-sm font-medium text-gray-600">No departments added yet.</p>
                  <Button onClick={openAddDeptModal} size="sm" className="bg-blue-600 text-white">
                    Create Department
                  </Button>
                </div>
              ) : (
                departments.map((dept) => {
                  const isSelected = selectedDepartment?.id === dept.id;
                  return (
                    <div
                      key={dept.id}
                      onClick={() => setSelectedDeptId(dept.id)}
                      className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/50 border-blue-500 shadow-xs ring-1 ring-blue-500/30'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                            }`}
                          >
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                                {dept.code}
                              </span>
                              <Badge
                                className={`text-[10px] px-2 py-0.5 rounded-md ${
                                  dept.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                }`}
                              >
                                {dept.status === 'active' ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                              {dept.name}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => openEditDeptModal(dept, e)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Department"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => confirmDeleteDept(dept, e)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Department"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Department Meta Counters */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                            <strong className="text-gray-700">{dept.programs?.length || 0}</strong> Programs
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-emerald-500" />
                            <strong className="text-gray-700">{dept.alumni_count || 0}</strong> Alumni
                          </span>
                        </div>

                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isSelected ? 'text-blue-600 translate-x-1' : 'text-gray-300'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Programs Belonging to the Selected Department ONLY */}
          <div className="lg:col-span-7 space-y-4">
            {selectedDepartment ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                {/* Department Details Header */}
                <div className="p-5 border-b border-gray-100 bg-linear-to-r from-blue-50/50 via-white to-transparent">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-600 text-white font-bold text-xs px-2.5 py-0.5">
                          {selectedDepartment.code}
                        </Badge>
                        <h3 className="text-lg font-bold text-gray-900">
                          {selectedDepartment.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Showing only programs affiliated with this department.
                      </p>
                    </div>

                    <Button
                      onClick={() => openAddProgModal(selectedDepartment.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 h-9 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Program</span>
                    </Button>
                  </div>
                </div>

                {/* Programs List */}
                <div className="p-5">
                  {!selectedDepartment.programs || selectedDepartment.programs.length === 0 ? (
                    <div className="py-12 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-800">No Programs in {selectedDepartment.code}</h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        This department currently has no degree programs registered. Add one to allow alumni to select it during registration.
                      </p>
                      <Button
                        onClick={() => openAddProgModal(selectedDepartment.id)}
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add First Program
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDepartment.programs.map((prog) => (
                        <div
                          key={prog.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 bg-white hover:bg-blue-50/20 transition-all gap-3"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                              <GraduationCap className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-gray-900">{prog.code}</span>
                                <Badge
                                  className={`text-[10px] px-2 py-0.2 rounded-md ${
                                    prog.status === 'active'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-gray-100 text-gray-600 border-gray-200'
                                  }`}
                                >
                                  {prog.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{prog.name}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              <span>
                                <strong className="text-gray-800">{prog.alumni_count || 0}</strong> Alumni
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => openEditProgModal(prog, e)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit Program"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => confirmDeleteProg(prog, e)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete Program"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-500">
                <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium">Please select a department from the left.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: ADD / EDIT DEPARTMENT */}
      <Dialog open={deptModalOpen} onOpenChange={setDeptModalOpen}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>{editingDept ? 'Edit Department' : 'Add New Department'}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Departments represent colleges or academic divisions (e.g., CECT).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitDept} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                Department Code / Acronym <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. CECT, CAS, CBA"
                value={deptForm.data.code}
                onChange={(e) => deptForm.setData('code', e.target.value.toUpperCase())}
                className="uppercase bg-white"
                required
              />
              {deptForm.errors.code && (
                <p className="text-xs text-red-500">{deptForm.errors.code}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                Full Department / College Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. College of Engineering and Computer Technology"
                value={deptForm.data.name}
                onChange={(e) => deptForm.setData('name', e.target.value)}
                className="bg-white"
                required
              />
              {deptForm.errors.name && (
                <p className="text-xs text-red-500">{deptForm.errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Status</Label>
              <Select
                value={deptForm.data.status}
                onValueChange={(val) => deptForm.setData('status', val)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Available for registration)</SelectItem>
                  <SelectItem value="inactive">Inactive (Hidden from dropdowns)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeptModalOpen(false)}
                className="rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={deptForm.processing}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer"
              >
                {editingDept ? 'Save Changes' : 'Create Department'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: ADD / EDIT PROGRAM */}
      <Dialog open={progModalOpen} onOpenChange={setProgModalOpen}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>{editingProg ? 'Edit Degree Program' : 'Add Degree Program'}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Programs belong strictly to their parent department.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitProg} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                Assigned Department <span className="text-red-500">*</span>
              </Label>
              <Select
                value={String(progForm.data.department_id)}
                onValueChange={(val) => progForm.setData('department_id', Number(val))}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.code} - {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {progForm.errors.department_id && (
                <p className="text-xs text-red-500">{progForm.errors.department_id}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                Program Code / Acronym <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. BSIT, BSCS, BSCpE"
                value={progForm.data.code}
                onChange={(e) => progForm.setData('code', e.target.value.toUpperCase())}
                className="uppercase bg-white"
                required
              />
              {progForm.errors.code && (
                <p className="text-xs text-red-500">{progForm.errors.code}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                Full Program Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Bachelor of Science in Information Technology"
                value={progForm.data.name}
                onChange={(e) => progForm.setData('name', e.target.value)}
                className="bg-white"
                required
              />
              {progForm.errors.name && (
                <p className="text-xs text-red-500">{progForm.errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Status</Label>
              <Select
                value={progForm.data.status}
                onValueChange={(val) => progForm.setData('status', val)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Available for registration)</SelectItem>
                  <SelectItem value="inactive">Inactive (Archived)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setProgModalOpen(false)}
                className="rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={progForm.processing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer"
              >
                {editingProg ? 'Save Changes' : 'Create Program'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: DELETE CONFIRMATION */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && setDeleteDialog({ open: false, type: null, item: null })}
      >
        <DialogContent className="max-w-md bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Deletion</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-600 pt-1">
              Are you sure you want to delete the {deleteDialog.type}{' '}
              <strong className="text-gray-900">{deleteDialog.item?.name}</strong> (
              {deleteDialog.item?.code})?
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1 my-2">
            <p className="font-semibold">⚠️ Safety Notice:</p>
            <p>
              If there are existing alumni or coordinators mapped to this {deleteDialog.type}, the system will reject the deletion to preserve academic history. Consider switching the status to <strong>Inactive</strong> instead.
            </p>
          </div>

          <DialogFooter className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, type: null, item: null })}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={executeDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
