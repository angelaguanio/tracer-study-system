import React, { useState } from "react";
import CoordinatorLayout from "@/Layouts/coord-layout";
import { Head } from "@inertiajs/react";

import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import CoordinatorAnnouncementEditSuccess from "@/Components/CoordinatorAnnouncementEditSuccess";

export default function CoordinatorAnnouncementEdit() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <CoordinatorLayout>
            <Head title="Edit Announcement" />

            {/* Full-screen background wrapper */}
            <div className="bg-[#f0faff] w-full min-h-screen flex justify-center py-10">
                
                {/* Card wrapper */}
                <div className="w-full max-w-6xl">
                    <Card className="w-full flex flex-col min-h-[700px] max-h-[900px]">

                        {/* Card Header */}
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold ml-3">
                                Edit Announcement
                            </CardTitle>

                            <Button
                                type="button"
                                className="bg-[#2859C5] text-white hover:bg-[#1f47a0]"
                            >
                                Upload Image
                            </Button>
                        </CardHeader>

                        {/* Card Content */}
                        <CardContent className="flex flex-col flex-grow">
                            <form className="flex flex-col flex-grow">

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-[#6E6C6C] font-bold">
                                        Announcement Title
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="Title"
                                        style={{ height: "60px" }}
                                    />
                                </div>

                                {/* Details */}
                                <div className="space-y-2 mt-4 flex-grow">
                                    <Label htmlFor="details" className="text-[#6E6C6C] font-bold">
                                        Details
                                    </Label>
                                    <Textarea
                                        id="details"
                                        name="details"
                                        placeholder="Details"
                                        style={{ height: "400px" }}
                                        className="overflow-y-auto"
                                    />
                                </div>

                                {/* Update Button */}
                                <div className="mt-4">
                                    <Button
                                        type="button"
                                        className="w-full bg-[#2859C5] text-white hover:bg-[#1f47a0]"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Update
                                    </Button>

                                    <CoordinatorAnnouncementEditSuccess
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                    />
                                </div>

                            </form>
                        </CardContent>

                    </Card>
                </div>
            </div>
        </CoordinatorLayout>
    );
}