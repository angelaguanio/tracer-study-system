  import React, { useRef, useState } from "react";
  import CoordinatorLayout from "@/layouts/coord-layout";
  import { Head, router, Link } from "@inertiajs/react";
  import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { Button } from "@/components/ui/button";
  import { Label } from "@/components/ui/label";
  import { ArrowLeft, X, AlertCircle } from "lucide-react";
  import CoordinatorAnnouncementEditUpdate from "../../components/CoordinatorAnnouncementEditUpdate";

  export default function CoordinatorAnnouncementEdit({ announcement }) {
    const fileInputRef = useRef(null);

    const [showModal, setShowModal] = useState(false);

    // LIMITS
    const MAX_FILES = 10;
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    const [fileError, setFileError] = useState(""); //error state for image validation

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
    if (!files.length) return;

    setFileError(""); // reset error every upload attempt

    const currentCount = existingImages.length + newImages.length;

    // MAX 10 IMAGES TOTAL
    if (currentCount + files.length > MAX_FILES) {
      setFileError("Maximum of 10 images only.");
      return;
    }

    // TOTAL SIZE CHECK (ALL FILES COMBINED)
    const existingSize = newImages.reduce(
      (sum, file) => sum + file.size,
      0
    );

    const incomingSize = files.reduce(
      (sum, file) => sum + file.size,
      0
    );

    const totalSize = existingSize + incomingSize;

    if (totalSize > MAX_SIZE) {
      setFileError("Total image size must not exceed 10MB.");
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

    const isRevise = announcement?.status === "revise";

    return (
      <CoordinatorLayout>
        <>
          <Head title="Edit Announcement" />

          {/* PAGE WRAPPER */}
          <div className="bg-[#f0faff] w-full min-h-screen flex justify-center py-6 sm:py-10 px-4 sm:px-6">

            {/* RESPONSIVE CONTAINER */}
            <div className="w-full max-w-6xl">

              {/* CARD */}
              <Card className="w-full flex flex-col">

                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => router.visit("/coordinator/announcement")}
                      className="p-2"
                    >
                      <ArrowLeft size={18} />
                    </Button>

                    <CardTitle className="text-lg font-semibold">
                      {isRevise ? "Resubmit Announcement" : "Edit Announcement"}
                    </CardTitle>

                  </div>

                  {/* RIGHT SIDE BUTTON */}
                  <div className="w-full sm:w-auto">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="w-full sm:w-auto bg-[#2859C5] text-white hover:bg-[#1f47a0]"
                    >
                      Upload Image
                    </Button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </CardHeader>

                {/* REVISION BANNER */}
                {isRevise && (
                  <div className="mx-4 sm:mx-6 mt-3 mb-2 p-4 bg-white border-l-4 border-yellow-400 rounded-md shadow-sm">

                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="text-yellow-500" size={18} />
                      <p className="font-semibold text-yellow-700 text-sm">
                        Revision Note
                      </p>
                    </div>

                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {announcement?.revision_note}
                    </p>

                  </div>
                )}

                {/* INFO TEXT (only shows kapag may image na) */}
                {previews.length > 0 && (
                  <span className="text-xs text-gray-500 px-4 sm:px-6 block">
                    You can upload up to <b>10 images</b> with a total size of <b>10MB</b>.
                  </span>
                )}

                {/* ERROR DISPLAY */}
                {fileError && (
                  <span className="text-sm text-red-500 px-4 sm:px-6 block">
                    {fileError}
                  </span>
                )}

                {/* IMAGE PREVIEW */}
                {previews.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2 px-4 sm:px-6">

                    {previews.map((img, index) => (
                      <div key={index} className="relative">

                        <img
                          src={img}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded border"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setFileError("");

                            const indexInAll = index;

                            if (indexInAll < existingImages.length) {
                              setExistingImages(prev =>
                                prev.filter((_, i) => i !== indexInAll)
                              );
                            } else {
                              const newIndex = indexInAll - existingImages.length;

                              setPreviewNew(prev =>
                                prev.filter((_, i) => i !== newIndex)
                              );

                              setNewImages(prev =>
                                prev.filter((_, i) => i !== newIndex)
                              );
                            }
                          }}
                          className="absolute -top-2 -right-2 bg-white border rounded-full p-1 cursor-pointer"
                        >
                          <X size={14} />
                        </button>

                      </div>
                    ))}

                  </div>
                )}

                <CardContent className="flex flex-col flex-grow">

                  <form onSubmit={handleSubmit} className="flex flex-col flex-grow">

                    {/* TITLE */}
                    <div className="space-y-2 mt-4">
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
                    <div className="space-y-2 mt-4">
                      <Label className="text-[#6E6C6C] font-bold">
                        Details
                      </Label>

                      <Textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        placeholder="Details"
                        className="h-[250px] sm:h-[400px] lg:h-[500px] resize-none"
                      />
                    </div>

                    {/* BUTTON */}
                    <div className="mt-4">
                      <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-[#2859C5] hover:bg-[#1f47a0]"
                      >
                        {isRevise ? "Resubmit" : "Update"}
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