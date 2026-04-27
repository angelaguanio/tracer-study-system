import React, { useRef, useState } from "react";
import CoordinatorLayout from "@/layouts/coord-layout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X } from "lucide-react";

export default function CoordinatorAnnouncementCreate() {
    const fileInputRef = useRef(null); // Reference para sa hidden file input
    const [previews, setPreviews] = useState([]); // Preview ng image bago i-upload

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
    
        post("/coordinator/announcement", {
            forceFormData: true,
    
            onSuccess: () => {
                setData({
                    title: "",
                    details: "",
                    images: [],
                });
    
                setPreviews([]);
    
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
    
                router.visit("/coordinator/announcement");
            },
        });
    };

    return (
            <>
            <Head title="Create Announcement" />

            {/* Full-screen background wrapper */}
            <div className="bg-[#f0faff] w-full min-h-screen flex justify-center py-10">
                {/* Card wrapper */}
                <div className="w-full max-w-6xl">
                    <Card className="w-full flex flex-col min-h-[700px]">

                        {/* Card Header */}
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Link href="/coordinator/announcement">
                                    <Button type="button" variant="ghost" className="p-2">
                                        <ArrowLeft size={18} />
                                    </Button>
                                </Link>
                                <CardTitle className="text-lg font-semibold ml-3">
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
                                className="bg-[#2859C5] text-white hover:bg-[#1f47a0]"
                            >
                                Upload Image
                            </Button>
                    </CardHeader>

                        {/* Card Content */}
                        <CardContent className="flex flex-col flex-grow">
                            {/* SINGLE FORM */}
                            <form onSubmit={handleSubmit} className="flex flex-col flex-grow gap-4">

                                {/* HIDDEN FILE INPUT */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const newFiles = Array.from(e.target.files || []);

                                        if (newFiles.length === 0) return;

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

                                {/* IMAGE PREVIEW */}
                                {previews.length > 0 && (
                                    <div className="mb-4 flex gap-2 flex-wrap px-6">
                                        {previews.map((src, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={src}
                                                    className="w-32 h-32 object-cover rounded border"
                                                />
                                
                                                {/* REMOVE SPECIFIC IMAGE */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPreviews(prev => prev.filter((_, i) => i !== index));
                                                        setData("images", prev => prev.filter((_, i) => i !== index));
                                
                                                        setPreviews(newPreviews);
                                                        setData("images", newImages);
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
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-[#6E6C6C] font-bold">Announcement Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="Title"
                                        value={data.title} // bind form data
                                        onChange={e => setData("title", e.target.value)}
                                        className="h-15 max-h-30 overflow-y-auto"
                                    />
                                    {/* ERROR */}
                                    {errors.title && (
                                        <p className="text-red-500 text-sm">{errors.title}</p>
                                    )}
                                </div>

                                {/* DETAILS */}
                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="details" className="text-[#6E6C6C] font-bold">Details</Label>
                                    <Textarea
                                        id="details"
                                        name="details"
                                        placeholder="Details"
                                        value={data.details} // bind form data
                                        onChange={e => setData("details", e.target.value)}
                                        className="h-100 overflow-y-auto"
                                    />
                                    {/* ERROR */}
                                    {errors.details && (
                                        <p className="text-red-500 text-sm">{errors.details}</p>
                                    )}
                                </div>

                                {/* Create Button - palaging nasa bottom */}
                                <div className="mt-auto pt-4">
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
    )
}

CoordinatorAnnouncementCreate.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
); 