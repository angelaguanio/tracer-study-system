import React from "react";
import CoordinatorLayout from "@/layouts/coord-layout";
import { Head } from "@inertiajs/react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CoordinatorAnnouncementEdit() {
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
                                    <Label htmlFor="title" className="text-[#6E6C6C] font-bold">Announcement Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="Title"
                                        className="h-15 max-h-30 overflow-y-auto"
                                    />
                                </div>

                                {/* Details */}
                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="details" className="text-[#6E6C6C] font-bold">Details</Label>
                                    <Textarea
                                        id="details"
                                        name="details"
                                        placeholder="Details"
                                        className="h-90 max-h-100 overflow-y-auto"
                                    />
                                </div>

                                {/* Create Button - palaging nasa bottom */}
                                <div className="mt-auto pt-4">
                                    <Button
                                        type="button"
                                        className="w-full bg-[#2859C5] hover:bg-[#2859C5]"
                                    >
                                        Update
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