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

    // LIMITS
    const MAX_FILES = 10;
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    let parsedImages = announcement?.image;

    try {
      parsedImages =
        typeof parsedImages === "string"
          ? JSON.parse(parsedImages)
          : parsedImages;
    } catch (e) {
      parsedImages = [];
    }

    const initialImages = Array.isArray(parsedImages)
      ? parsedImages
      : parsedImages
        ? [parsedImages]
        : [];

    const [existingImages, setExistingImages] = useState(initialImages);
    const [newImages, setNewImages] = useState([]);
    const [previewNew, setPreviewNew] = useState([]);

    const previews = [...existingImages, ...previewNew];

    const [formData, setFormData] = useState({
      title: announcement?.title || "",
      details: announcement?.details || "",
      image: null,
    });

  const handleChange = (e) => {
     const { name, value } = e.target;
     setFormData({ ...formData, [name]: value });
   };

   // FILE HANDLER (UPDATED LIMITS)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // MAX 10 IMAGES TOTAL
    if ((existingImages.length + newImages.length + files.length) > MAX_FILES) {
      alert("Maximum of 10 images only.");
      return;
    }

    // TOTAL SIZE CHECK (ALL FILES COMBINED)
    let totalSize = 0;

    for (let file of files) {
      totalSize += file.size;
    }

    if ((totalSize / 1024 / 1024) > 10) {
      alert("Total image size must not exceed 10MB.");
      return;
    }

      const newPreviews = files.map(file => URL.createObjectURL(file));

      setPreviewNew(prev => [...prev, ...newPreviews]);

      setNewImages(prev => [...prev, ...files]);
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!announcement?.id) return;

      const data = new FormData();
      data.append("title", formData.title);
      data.append("details", formData.details);

      // existing images
      data.append("existing_images", JSON.stringify(existingImages));

      // new uploaded images
      newImages.forEach(file => {
        data.append("images[]", file);
      });

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
              <Card className="w-full flex flex-col min-h-[700px]">

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
                    multiple
                    onChange={handleFileChange}
                  />
                </CardHeader>

                {/* IMAGE PREVIEW */}
                {previews.length > 0 && (
                  <div className="mb-2 flex gap-2 flex-wrap pl-6">

                    {previews.map((img, index) => (
                      <div key={index} className="relative">

                        <img
                          src={img}
                          className="w-32 h-32 object-cover rounded border"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const removedImage = previews[index];

                            setPreviewNew(prev =>
                              prev.filter(img => img !== removedImage)
                            );

                            setExistingImages(prev =>
                              prev.filter(img => img !== removedImage)
                            );
                          }}
                          className="absolute -top-2 -right-2 bg-white border rounded-full p-1"
                        >
                          <X size={14} />
                        </button>

                      </div>
                    ))}

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