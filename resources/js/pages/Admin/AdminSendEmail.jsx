import React, { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import { Head, useForm, router } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function AdminSendEmail({ user }) {
  const { data, setData, post, processing, errors } = useForm({
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.alumni.email.send", user.id));
  };

  return (
    <>
      <Head title="Send Email" />

      <div className="bg-[#f0faff] w-full min-h-screen flex justify-center items-start py-10">

        <div className="w-full max-w-6xl flex flex-col gap-3">

          {/* CARD */}
          <Card className="w-full">

            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Send Email
              </CardTitle>
            </CardHeader>

            <CardContent>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* RECEIVER */}
                <div>
                  <p className="text-gray-600 text-sm">
                    To: <span className="font-semibold">{user.name}</span>
                  </p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>

                {/* SUBJECT */}
                <div className="space-y-1">
                  <Label>Subject</Label>
                  <Input
                    value={data.subject}
                    onChange={(e) => setData("subject", e.target.value)}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm">{errors.subject}</p>
                  )}
                </div>

                {/* MESSAGE */}
                <div className="space-y-1">
                  <Label>Message</Label>
                  <Textarea
                    value={data.message}
                    onChange={(e) => setData("message", e.target.value)}
                    className="h-[180px] resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm">{errors.message}</p>
                  )}
                </div>

                {/* SEND BUTTON */}
                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {processing ? "Sending..." : "Send Email"}
                </Button>

              </form>

            </CardContent>
          </Card>

          {/* BACK BUTTON */}
          <div className="flex justify-start">
            <Button
              onClick={() => router.visit(route("admin.alumni.index"))}
              className="bg-blue-600 flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}

AdminSendEmail.layout = (page) => <AdminLayout>{page}</AdminLayout>;