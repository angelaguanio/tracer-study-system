import React, { useRef, useState } from "react";
import CoordinatorLayout from "@/layouts/coord-layout";
import { Head, router, Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X } from "lucide-react";

import CoordinatorAnnouncementEditUpdate from "@/components/CoordinatorAnnouncementEditUpdate";

export default function CoordinatorAnnouncementEdit({ announcement }) {
  const fileInputRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  const [preview, setPreview] = useState(
    announcement?.image
      ? announcement.image.startsWith("http")
        ? announcement.image
        : `/storage/${announcement.image}`
      : null
  );

  const [formData, setFormData] = useState({
    title: announcement?.title || "",
    details: announcement?.details || "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setRemoveImage(false);
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!announcement?.id) return;

    const data = new FormData();
    data.append("title", formData.title);
    data.append("details", formData.details);

    if (formData.image) {
      data.append("image", formData.image);
    }

    if (removeImage) {
      data.append("remove_image", "1");
    }

    data.append("_method", "PUT");

    router.post(`/coordinator/announcement/${announcement.id}`, data, {
      forceFormData: true,

      onSuccess: () => {
        router.visit("/coordinator/announcement?updated=1", {
          replace: true,
          preserveState: false,
        });
      },
    });
  };

  return (
    <CoordinatorLayout>
      <>
        <Head title="Edit Announcement" />

        {/* PAGE WRAPPER */}
        <div className="bg-[#f0faff] w-full min-h-screen flex justify-center py-6 px-4 sm:py-10">

          {/* RESPONSIVE CONTAINER */}
          <div className="w-full max-w-5xl">

            {/* CARD */}
            <Card className="w-full min-h-[600px] sm:min-h-[700px] flex flex-col">

              <CardHeader className="flex flex-row items-center justify-between">

                <div className="flex items-center gap-2">

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.visit("/coordinator/announcement")}
                    className="p-2"
                  >
                    <ArrowLeft size={18} />
                  </Button>

                  <CardTitle className="text-lg font-semibold">
                    Edit Announcement
                  </CardTitle>
                </div>

                {/* RIGHT SIDE */}
                <Button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="bg-[#2859C5] text-white hover:bg-[#1f47a0] w-full sm:w-auto"
                >
                  Upload Image
                </Button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </CardHeader>

              {/* IMAGE PREVIEW */}
              {preview && !removeImage && (
                <div className="mb-2 flex justify-center sm:justify-start px-4 relative w-fit">

                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 sm:w-40 max-h-64 rounded border object-contain"
                    />

                    {/* REMOVE BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setRemoveImage(true);
                        setFormData({ ...formData, image: null });
                      }}
                      className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 shadow-sm hover:bg-gray-100"
                    >
                      <X size={14} className="text-gray-700" />
                    </button>

                  </div>

                </div>
              )}

              <CardContent className="flex flex-col flex-grow px-4 sm:px-6">

                <form onSubmit={handleSubmit} className="flex flex-col flex-grow gap-4">

                  {/* TITLE */}
                  <div className="space-y-2">
                    <Label className="text-[#6E6C6C] font-bold">
                      Announcement Title
                    </Label>

                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Title"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="space-y-2">
                    <Label className="text-[#6E6C6C] font-bold">
                      Details
                    </Label>

                    <Textarea
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      placeholder="Details"
                      className="h-[250px] sm:h-[400px] lg:h-[500px] overflow-y-auto resize-none"
                    />
                  </div>

                  {/* BUTTON */}
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

        {/* MODAL */}
        <CoordinatorAnnouncementEditUpdate show={showModal} />
      </>
    </CoordinatorLayout>
  );
}