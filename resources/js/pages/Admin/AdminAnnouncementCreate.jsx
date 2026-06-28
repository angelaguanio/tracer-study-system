import React, { useRef, useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminAnnouncementCreate() {
    const fileInputRef = useRef(null); // Reference para sa hidden file input
    const [previews, setPreviews] = useState([]); // Preview ng image bago i-upload
    const [fileError, setFileError] = useState(""); //error state for image validation

    // LIMITS
    const MAX_FILES = 10;
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    // INERTIA FORM DATA
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        details: "",
        images: [],
    });

    // SUBMIT HANDLER
    const handleSubmit = (e) => {
        e.preventDefault();

        post("/admin/announcement", {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Announcement created successfully!");
                setData({ title: "", details: "", images: [] });
                setPreviews([]);
                setFileError("");
                if (fileInputRef.current) fileInputRef.current.value = null;
                // router.visit("/admin/announcement");
            },
        });
    };

    return (
        <>
            <Head title="Create Announcement" />

            {/* WRAPPER */}
            <div className="bg-[#f0faff] w-full min-h-screen flex justify-center py-6 sm:py-10 px-3 sm:px-4">

                <div className="w-full max-w-6xl">

                    {/* CARD */}
                    <Card className="w-full flex flex-col h-fit">

                        {/* HEADER */}
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Link href="/admin/announcement">
                                    <Button type="button" variant="ghost" className="p-2">
                                        <ArrowLeft size={18} />
                                    </Button>
                                </Link>

                                <CardTitle className="text-lg font-semibold ml-1 sm:ml-3">
                                    Create new announcement
                                </CardTitle>
                            </div>

                            {/* Upload Image Button */}
                            <Button
                                type="button"
                                onClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                        fileInputRef.current.click();
                                    }
                                }}
                                className="w-full sm:w-auto bg-[#2859C5] text-white hover:bg-[#1f47a0]"
                            >
                                Upload Image
                            </Button>

                        </CardHeader>

                        {/* CONTENT */}
                        <CardContent className="flex flex-col">

                            {/* SINGLE FORM */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">

                                {/* HIDDEN FILE INPUT */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const newFiles = Array.from(e.target.files || []);
                                        if (!newFiles.length) return;

                                        // reset error every upload attempt
                                        setFileError("");

                                        const currentFiles = data.images || [];
                                        const combinedFiles = [...currentFiles, ...newFiles];

                                        // LIMIT 10 IMAGES
                                        if (combinedFiles.length > MAX_FILES) {
                                            setFileError("Maximum of 10 images only.");
                                            return;
                                        }

                                        // LIMIT 10MB TOTAL SIZE
                                        const totalSize = combinedFiles.reduce(
                                            (sum, file) => sum + file.size,
                                            0
                                        );

                                        if (totalSize > MAX_SIZE) {
                                            setFileError("Total image size must not exceed 10MB.");
                                            return;
                                        }

                                        const newPreviews = newFiles.map(file =>
                                            URL.createObjectURL(file)
                                        );

                                        setData(prev => ({
                                            ...prev,
                                            images: [...(prev.images || []), ...newFiles]
                                        }));

                                        setPreviews(prev => [...prev, ...newPreviews]);
                                    }}
                                />

                                {/* INFO TEXT (only shows kapag may image na) */}
                                {previews.length > 0 && (
                                    <span className="text-xs text-gray-500 px-2 sm:px-6">
                                        You can upload up to <b>10 images</b> with a total size of <b>10MB</b>.
                                    </span>
                                )}

                                {/* ERROR DISPLAY */}
                                {fileError && (
                                    <span className="text-sm text-red-500 px-2 sm:px-6">
                                        {fileError}
                                    </span>
                                )}

                                {/* IMAGE PREVIEW */}
                                {previews.length > 0 && (
                                    <div className="mb-2 flex gap-2 flex-wrap px-2 sm:px-6">
                                        {previews.map((src, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={src}
                                                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded border"
                                                />

                                                {/* REMOVE SPECIFIC IMAGE */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        // remove preview
                                                        setPreviews(prev =>
                                                            prev.filter((_, i) => i !== index)
                                                        );

                                                        // sync images
                                                        setData(prev => ({
                                                            ...prev,
                                                            images: prev.images.filter((_, i) => i !== index)
                                                        }));

                                                        setFileError(""); // reset error
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-white border rounded-full p-1"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* TITLE */}
                                <div className="space-y-1 px-2 sm:px-6">
                                    <Label className="text-[#6E6C6C] font-bold">
                                        Announcement Title
                                    </Label>

                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="Title"
                                        value={data.title} // bind form data
                                        onChange={e => setData("title", e.target.value)}
                                    />

                                    {/* ERROR */}
                                    {errors.title && (
                                        <p className="text-red-500 text-sm">{errors.title}</p>
                                    )}
                                </div>

                                {/* DETAILS */}
                                <div className="space-y-1 px-2 sm:px-6">
                                    <Label className="text-[#6E6C6C] font-bold">
                                        Details
                                    </Label>

                                    <Textarea
                                        id="details"
                                        name="details"
                                        placeholder="Details"
                                        value={data.details} // bind form data
                                        onChange={e => setData("details", e.target.value)}
                                        className="min-h-[320px] sm:min-h-[360px] lg:min-h-[450px]"
                                    />

                                    {/* ERROR */}
                                    {errors.details && (
                                        <p className="text-red-500 text-sm">{errors.details}</p>
                                    )}
                                </div>

                                {/* Create Button - palaging nasa bottom */}
                                <div className="pt-2 sm:pt-4 px-2 sm:px-6">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                        {processing ? "Creating..." : "Create"}
                                    </Button>
                                </div>

                            </form>

                        </CardContent>
                    </Card>

                </div>
            </div>
        </>
    );
}

AdminAnnouncementCreate.layout = (page) => (
<AdminLayout>{page}</AdminLayout>
);