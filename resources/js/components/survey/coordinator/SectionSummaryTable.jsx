import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SectionSummaryTable({ sectionSummary = [] }) {
    return (
        <div className="rounded-md border bg-white shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-sky-300">
                        <TableHead className="font-bold text-black">Section</TableHead>
                        <TableHead className="font-bold text-black text-right">Responses</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sectionSummary.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center text-gray-400 py-6">No data available</TableCell>
                        </TableRow>
                    ) : (
                        sectionSummary.map((s) => (
                            <TableRow key={s.section_id} className="border-t">
                                <TableCell className="text-gray-800">{s.title}</TableCell>
                                <TableCell className="text-right text-gray-600">{s.response_count}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
