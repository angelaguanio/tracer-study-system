import React, { useRef, useState } from "react";
import CoordinatorLayout from "@/Layouts/coord-layout";
import { Head, useForm, router } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";

export default function CoordinatorAnnouncementCreate() {
    const fileInputRef = useRef(null); // 👉 Reference para sa hidden file input
    const [preview, setPreview] = useState(null); // 👉 Preview ng image bago i-upload

    // INERTIA FORM DATA
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        details: "",
        image: null,
    });

    // SUBMIT HANDLER
    const handleSubmit = (e) => {
        e.preventDefault(); // prevent default HTML GET request

        post("/coordinator/announcement", {
            forceFormData: true, // important para sa image file
            onSuccess: () => {
                // Reset form after successful submission (optional)
                setData({ title: "", details: "", image: null });
                setPreview(null);

                // Redirect to announcements index page
                router.visit("/coordinator/announcement");
            },
        });
    };

    return (
        <CoordinatorLayout>
            <Head title="Create Announcement" />

            {/* Full-screen background wrapper */}
            <div className="bg-[#f0faff] w-full min-h-screen flex justify-center py-10">
                {/* Card wrapper */}
                <div className="w-full max-w-6xl">
                    <Card className="w-full flex flex-col min-h-[700px] max-h-[900px]">

                        {/* Card Header */}
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-semibold ml-3">
                                Create new announcement
                            </CardTitle>

                            {/* Upload Image Button */}
                            <Button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="bg-[#2859C5] text-white hover:bg-[#1f47a0]"
                            >
                                Upload Image
                            </Button>
                        </CardHeader>

                        {/* Card Content */}
                        <CardContent className="flex flex-col flex-grow">
                            {/* SINGLE FORM */}
                            <form onSubmit={handleSubmit} className="flex flex-col flex-grow">

                                {/* HIDDEN FILE INPUT */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setData("image", file); // save file in form
                                            setPreview(URL.createObjectURL(file)); // preview image
                                        }
                                    }}
                                />

                                {/* IMAGE PREVIEW */}
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-40 mb-4 rounded border"
                                    />
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
                                        className="h-90 max-h-100 overflow-y-auto"
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
        </CoordinatorLayout>
    );
}