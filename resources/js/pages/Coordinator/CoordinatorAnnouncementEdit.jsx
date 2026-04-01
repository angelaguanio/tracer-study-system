import React, { useRef, useState } from "react";
import CoordinatorLayout from "@/layouts/coord-layout";
import { Head, router } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CoordinatorAnnouncementEdit({ announcement }) {
  const fileInputRef = useRef(null);

  // Preview image
  const [preview, setPreview] = useState(announcement?.image);

  // Form data state
  const [formData, setFormData] = useState({
    title: announcement?.title || "",
    details: announcement?.details || "",
    image: null,
  });

  // Handle text changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // preview
      setFormData({ ...formData, image: file });
    }
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("details", formData.details);
    if (formData.image) data.append("image", formData.image);

    // POST with method override to PUT
    data.append("_method", "PUT");

    router.post(`/coordinator/announcement/${announcement.id}`, data, {
      forceFormData: true,
      onSuccess: () => {
        router.visit("/coordinator/announcement");
      },
      onError: (errors) => {
        console.log("Validation errors:", errors);
      },
    });
  };

  return (
    <CoordinatorLayout>
      <Head title="Edit Announcement" />

      <div className="bg-[#f0faff] w-full min-h-screen flex justify-center py-10">
        <div className="w-full max-w-6xl">
          <Card className="w-full flex flex-col min-h-[700px] max-h-[900px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold ml-3">
                Edit Announcement
              </CardTitle>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="bg-[#2859C5] text-white hover:bg-[#1f47a0]"
                >
                  Upload Image
                </Button>
              </div>
            </CardHeader>

            {/* 🔹 Image Preview: same behavior as Create page */}
            {preview && (
              <div className="mb-2 flex justify-start pl-6">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 max-h-64 rounded border object-contain"
                />
              </div>
            )}

            <CardContent className="flex flex-col flex-grow">
              <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                {/* TITLE */}
                <div className="space-y-2 -mt-4">
                  <Label htmlFor="title" className="text-[#6E6C6C] font-bold">
                    Announcement Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="h-15 max-h-30 overflow-y-auto"
                  />
                </div>

                {/* DETAILS */}
                <div className="space-y-2 mt-4">
                  <Label htmlFor="details" className="text-[#6E6C6C] font-bold">
                    Details
                  </Label>
                  <Textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Details"
                    className="h-90 max-h-100 overflow-y-auto"
                  />
                </div>

                {/* UPDATE BUTTON */}
                <div className="mt-auto pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-[#2859C5] hover:bg-[#1f47a0]"
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