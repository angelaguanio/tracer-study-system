import React from "react";
import AdminLayout from "@/layouts/admin-layout";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminViewProfileOfRespondents({ user }) {

  const isEmployed = user?.employment?.status === "Employed";

  return (
    <>
      <Head title="Alumni Profile" />

      <div className="w-full p-4">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* PERSONAL INFORMATION */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex gap-6 items-center">

                <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      className="w-full h-full object-cover"
                      alt="avatar"
                    />
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-600">{user.course}</p>
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
                  <p className="text-gray-500">Year Graduated</p>
                  <p>{user.year}</p>
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
              <CardTitle>Employment Status</CardTitle>
            </CardHeader>

            <CardContent className="flex justify-between items-start">

              <div>
                <p className="font-semibold">
                  {user.employment.company}
                </p>

                <p className="text-sm text-gray-600">
                  {user.employment.nature}
                </p>

                <p className="text-sm">
                  Salary: {user.employment.salary}
                </p>
              </div>

              {/* STATUS BADGE */}
              <span
                className={`px-4 py-1 rounded-full h-fit text-sm font-semibold ${
                  isEmployed
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.employment.status}
              </span>

            </CardContent>
          </Card>

          {/* BACK BUTTON */}
          <Button
            onClick={() => router.visit(route("admin.alumni.index"))}
            className="bg-blue-600 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>

        </div>
      </div>
    </>
  );
}

AdminViewProfileOfRespondents.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);