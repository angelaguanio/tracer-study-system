import React, { useRef, useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import { Head, router, Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X  } from "lucide-react";
import AdminAnnouncementEditUpdate from "@/components/AdminAnnouncementEditUpdate";

export default function AdminAnnouncementEdit({ announcement }) {
  const fileInputRef = useRef(null);

  const [removeImage, setRemoveImage] = useState(false);

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

    // new image upload
    if (formData.image) {
      data.append("image", formData.image);
    }

    // if user removed existing image
    if (removeImage) {
      data.append("remove_image", "1");
    }

    // method override
    data.append("_method", "PUT");

    router.post(`/admin/announcement/${announcement.id}`, data, {
      forceFormData: true,

      onSuccess: () => {
        router.visit("/admin/announcement?updated=1", {
          replace: true,
          preserveScroll: true,
        });
      },

      onError: (errors) => {
        console.log("Validation errors:", errors);
      },
    });
  };

  return (
    <>
      <Head title="Edit Announcement" />

      <div className="bg-[#f0faff] w-full min-h-screen flex justify-center py-10">
        <div className="w-full max-w-6xl">
          <Card className="w-full flex flex-col min-h-[700px] max-h-[900px]">

            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href="/admin/announcement">
                  <Button type="button" variant="ghost" className="p-2">
                    <ArrowLeft size={18} />
                  </Button>
                </Link>

                <CardTitle className="text-lg font-semibold">
                  Edit Announcement
                </CardTitle>
              </div>

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

            {/* Image Preview */}
            {preview && !removeImage && (
              <div className="mb-2 flex justify-start pl-6 relative w-fit">
                
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="mb-2 flex justify-center sm:justify-start px-4 relative w-fit"
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
                    className="h-[250px] sm:h-[400px] lg:h-[500px] overflow-y-auto resize-none"
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
    </>
  );
}

AdminAnnouncementEdit.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);