import React from "react";
import AdminLayout from "@/layouts/admin-layout";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminViewProfileOfRespondents({ user }) {

  if (!user) {
    return (
      <AdminLayout>
        <div className="p-6 text-red-500">No user data found.</div>
      </AdminLayout>
    );
  }

 const employment = user.employment
  ? {
      status: user.employment.status,
      company: user.employment.company,
      position: user.employment.position,
      type: user.employment.type,
      salary: user.employment.salary,
    }
  : null;

  return (
    <>
      <Head title="Alumni Profile" />

      <div className="w-full p-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* BACK BUTTON */}
          <div>
            <Button
              onClick={() => router.visit("/admin/alumni")}
              variant="outline"
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
          </div>

          {/* PERSONAL INFORMATION */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-4">

                {/* AVATAR */}
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">No Image</span>
                  )}
                </div>

                {/* INFO */}
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-600">{user.course}</p>
                  <p className="text-gray-600">Year: {user.year}</p>
                </div>

              </div>

              <hr className="my-4" />

              <div className="grid grid-cols-2 gap-4 text-sm">

                <div>
                  <p className="text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>

                <div>
                  <p className="text-gray-500">Contact</p>
                  <p>{user.contact}</p>
                </div>

                <div>
                  <p className="text-gray-500">Address</p>
                  <p>{user.address}</p>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* EMPLOYMENT STATUS */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Information</CardTitle>
            </CardHeader>

            <CardContent className="flex justify-between items-start">

              <div className="space-y-1 text-sm">

                <p>
                  <span className="font-semibold">Company:</span>{" "}
                  {employment.company}
                </p>

                <p>
                  <span className="font-semibold">Position:</span>{" "}
                  {employment.position}
                </p>

                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {employment.type}
                </p>

                <p>
                  <span className="font-semibold">Salary:</span>{" "}
                  {employment.salary}
                </p>

              </div>

              {/* STATUS BADGE (FIXED SAFE CHECK) */}
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  employment.status?.toLowerCase() === "employed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {employment.status}
              </span>

            </CardContent>
          </Card>

        </div>
      </div>
    </>
  );
}

AdminViewProfileOfRespondents.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);