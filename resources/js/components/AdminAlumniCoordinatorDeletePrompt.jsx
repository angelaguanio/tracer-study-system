import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminAlumniCoordinatorDeletePrompt({
    open,
    coordinator,
    onClose,
}) {
    const [success, setSuccess] = useState(false);

    const handleDelete = () => {
        router.delete(
            `/admin/alumni-coordinators/${coordinator.id}`,
            {
                onSuccess: () => {
                    setSuccess(true);

                    setTimeout(() => {
                        setSuccess(false);
                        onClose();
                    }, 3000);
                },
            }
        );
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-md rounded-xl p-6 shadow">

                {success ? (

                    <div className="flex flex-col items-center gap-3 py-8">

                        <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="text-white" size={28} />
                        </div>

                        <p className="text-green-600 font-semibold text-lg">
                            Deleted Successfully
                        </p>

                    </div>

                ) : (

                    <>
                        <h2 className="text-lg font-semibold ">
                            Are you sure?
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Deleting <span className="font-semibold text-gray-900">
                                {coordinator.first_name} {coordinator.last_name}</span> will permanently 
                                remove their account and they will no longer have access to the system.
                        </p>

                        <div className="flex justify-center gap-3 mt-5">

                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>

                            <Button
                                className="bg-red-600 text-white"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>

                        </div>
                    </>
                )}

            </div>
        </div>
    );
}