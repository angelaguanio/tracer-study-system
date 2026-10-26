import React, { useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, CornerDownLeft, MessageSquareQuote } from 'lucide-react';
import { INQUIRY_SUGGESTIONS, formatSuggestion } from '@/data/inquirySuggestions';

export default function QuickRepliesModal({ open, onOpenChange, alumniName, onSelectSuggestion }) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = useMemo(() => {
        const unique = Array.from(new Set(INQUIRY_SUGGESTIONS.map(s => s.category)));
        return ['All', ...unique];
    }, []);

    const filteredSuggestions = useMemo(() => {
        const q = search.trim().toLowerCase();
        return INQUIRY_SUGGESTIONS.filter(item => {
            const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
            if (!matchesCategory) return false;
            if (!q) return true;

            const matchesTitle = item.title.toLowerCase().includes(q);
            const matchesTemplate = item.template.toLowerCase().includes(q);
            const matchesKeywords = item.keywords.some(k => k.toLowerCase().includes(q));

            return matchesTitle || matchesTemplate || matchesKeywords;
        });
    }, [search, selectedCategory]);

    const handleSelect = (template) => {
        const text = formatSuggestion(template, { alumniName });
        onSelectSuggestion(text);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 rounded-2xl bg-white shadow-2xl border border-slate-200">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-sky-100 text-[#009AFB] flex items-center justify-center">
                            <MessageSquareQuote className="h-4 w-4" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-[#0B2545]">
                            Quick Replies & Predetermined Responses
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-slate-500">
                        Select a response below to immediately insert it into the reply box for {alumniName || 'this alumnus'}.
                    </DialogDescription>
                </DialogHeader>

                {/* Search Bar */}
                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search answers, keywords, or topics..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#009AFB]/30 focus:border-[#009AFB] transition"
                    />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 inquiry-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                selectedCategory === cat
                                    ? 'bg-[#0B2545] text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* List of responses */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 inquiry-scrollbar mt-1">
                    {filteredSuggestions.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs">
                            No quick replies found matching your search.
                        </div>
                    ) : (
                        filteredSuggestions.map((item) => {
                            const formattedPreview = formatSuggestion(item.template, { alumniName });
                            return (
                                <div
                                    key={item.id}
                                    className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-[#009AFB]/50 hover:shadow-sm transition-all group flex flex-col gap-2"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-sky-100 text-[#009AFB]">
                                                {item.category}
                                            </span>
                                            <h4 className="text-xs font-bold text-[#0B2545]">
                                                {item.title}
                                            </h4>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSelect(item.template)}
                                            className="h-7 px-2.5 rounded-lg text-[11px] bg-[#009AFB] hover:bg-[#0082D6] text-white font-medium gap-1 shadow-sm"
                                        >
                                            <CornerDownLeft className="h-3 w-3" />
                                            Use Reply
                                        </Button>
                                    </div>

                                    {/* Preview Box */}
                                    <pre className="text-[11px] text-slate-600 font-sans whitespace-pre-wrap line-clamp-4 bg-white p-2.5 rounded-lg border border-slate-100 select-text">
                                        {formattedPreview}
                                    </pre>
                                </div>
                            );
                        })
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
