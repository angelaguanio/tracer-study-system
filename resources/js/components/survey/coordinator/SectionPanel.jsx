import { router } from "@inertiajs/react";
import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SectionPanel({ section, surveyId, isFirst, isLast, isActive, onClick, onReorder, onEdit, hasResponses = false }) {
    const handleDelete = () => {
        // Determine route prefix from current route name
        const currentRoute = route().current();
        const isCoordinator = currentRoute && currentRoute.indexOf('coordinator.') === 0;
        const routePrefix = isCoordinator ? 'coordinator' : 'admin';
        
        router.delete(route(`${routePrefix}.sections.destroy`, section.id));
    };

    return (
        <div
            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border cursor-pointer transition ${
                isActive ? "shadow-2xs font-medium" : "bg-white border-gray-200 hover:bg-slate-50"
            }`}
            style={isActive ? { background: 'color-mix(in srgb, var(--theme-primary) 12%, white)', borderColor: 'var(--theme-primary)' } : {}}
            onClick={onClick}
        >
            <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-800 truncate">{section.title}</span>
                {section.description && <span className="text-xs text-gray-400 truncate">{section.description}</span>}
            </div>


            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={isFirst} onClick={() => onReorder(section.id, "up")}><ChevronUp size={14} /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={isLast} onClick={() => onReorder(section.id, "down")}><ChevronDown size={14} /></Button>
                <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 hover:opacity-80" 
                    style={{ color: 'var(--theme-primary)' }}
                    onClick={() => onEdit(section)}
                >
                    <Pencil size={14} />
                </Button>
                {hasResponses ? (
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-300 cursor-not-allowed" disabled title="Cannot delete: responses already exist"><Trash2 size={14} /></Button>
                ) : (
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-[#E70813]" onClick={handleDelete}><Trash2 size={14} /></Button>
                )}
            </div>
        </div>
    );
}
