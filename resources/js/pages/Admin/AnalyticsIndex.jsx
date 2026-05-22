import { router } from "@inertiajs/react";
import { BarChart2, MapPin } from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AnalyticsIndex({ surveys }) {
    return (
        <div className="w-full max-w-4xl px-4 py-6 flex flex-col gap-4 self-start">
            <h1 className="text-xl font-bold text-gray-800">Analytics</h1>
            <p className="text-sm text-gray-500">Select a survey to view its response analytics.</p>

            {/* EMPLOYMENT LOCATION ANALYTICS CARD */}
            <Card className="bg-white border shadow-sm">
                <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                            <MapPin size={16} className="text-blue-600" />
                            Employment Location Analytics
                        </h2>
                        <p className="text-sm text-gray-500">
                            Local vs. external employment based on home address and company location.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => router.get(route("admin.analytics.employment-location"))}
                    >
                        <MapPin size={14} />
                        View Report
                    </Button>
                </CardContent>
            </Card>

            <div className="border-t border-gray-100 pt-2">
                <p className="text-sm text-gray-500 mb-3">Survey Response Analytics</p>
            </div>

            {surveys.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">No surveys available.</p>
            ) : (
                surveys.map((survey) => (
                    <Card key={survey.id} className="bg-white border shadow-sm">
                        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                            <div className="flex flex-col gap-1">
                                <h2 className="font-semibold text-gray-800">{survey.title}</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Badge className={survey.status === "active" ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-500 border-gray-300"}>
                                        {survey.status === "active" ? "Active" : "Inactive"}
                                    </Badge>
                                    <span>{survey.sections_count} section{survey.sections_count !== 1 ? "s" : ""}</span>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                onClick={() => router.get(route("admin.surveys.analytics", survey.id))}
                            >
                                <BarChart2 size={14} />
                                View Analytics
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}

AnalyticsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
