import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { route } from "ziggy-js";

export default function SubheadingFormModal({ open, onClose, sectionId, subheading = null }) {
    const isEdit = !!subheading?.id;
    const [form, setForm] = useState({ label: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (subheading?.id) {
            // Edit existing subheading
            setForm({ label: subheading.label });
        } else {
            // Create new subheading
            setForm({ label: "" });
        }
        setErrors({});
    }, [subheading, open]);

    const handleSubmit = () => {
        if (!sectionId && !isEdit) {
            setErrors({ general: 'Section ID is required' });
            return;
        }

        const payload = {
            label: form.label
        };

        const onError = (e) => {
            console.error('Subheading submission error:', e);
            setErrors(e);
        };

        const onSuccess = () => {
            console.log('Subheading created/updated successfully');
            onClose();
        };

        // Determine route prefix from current route name
        const currentRoute = route().current();
        const isCoordinator = currentRoute && currentRoute.indexOf('coordinator.') === 0;
        const routePrefix = isCoordinator ? 'coordinator' : 'admin';

        try {
            if (isEdit) {
                router.put(route(`${routePrefix}.subheadings.update`, subheading.id), payload, { onError, onSuccess });
            } else {
                router.post(route(`${routePrefix}.subheadings.store`, sectionId), payload, { onError, onSuccess });
            }
        } catch (error) {
            console.error('Route error:', error);
            setErrors({ general: 'Failed to submit form' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="lg:max-w-lg max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-start">
                        {isEdit ? "Edit Subheading" : "Add Subheading"}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-700">{errors.general}</p>
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-3">
                        <Label>Subheading / Description Text:</Label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={form.label}
                            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                            placeholder="Enter section description or instructions..."
                            autoFocus
                        />
                        {errors.label && <p className="text-xs text-red-500">{errors.label}</p>}
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-start mb-1">
                            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Preview</span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {form.label || "Your subheading text will appear here..."}
                        </p>
                    </div>
                </div>

                <DialogFooter className='flex flex-col-reverse sm:flex-row sm:justify-end gap-2'>
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
                    <Button 
                        className="bg-amber-600 hover:bg-amber-700 text-white  w-full sm:w-auto" 
                        onClick={handleSubmit}
                        disabled={!form.label.trim()}
                    >
                        {isEdit ? "Save Subheading" : "Add Subheading"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}