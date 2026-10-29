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
import { getInquirySuggestions, formatSuggestion } from '@/data/inquirySuggestions';

export default function QuickRepliesModal({ open, onOpenChange, alumniName, userRole = 'admin', onSelectSuggestion }) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const suggestions = useMemo(() => getInquirySuggestions(userRole), [userRole]);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(suggestions.map(s => s.category)));
        return ['All', ...unique];
    }, [suggestions]);

    const filteredSuggestions = useMemo(() => {
        const q = search.trim().toLowerCase();
        return suggestions.filter(item => {
            const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
            if (!matchesCategory) return false;
            if (!q) return true;

            const matchesTitle = item.title.toLowerCase().includes(q);
            const matchesTemplate = item.template.toLowerCase().includes(q);
            const matchesKeywords = item.keywords.some(k => k.toLowerCase().includes(q));

            return matchesTitle || matchesTemplate || matchesKeywords;
        });
    }, [search, selectedCategory, suggestions]);

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
                        <div 
                            className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                            style={{ 
                                background: 'color-mix(in srgb, var(--theme-primary) 12%, white)', 
                                color: 'var(--theme-primary)' 
                            }}
                        >
                            <MessageSquareQuote className="h-4 w-4" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-slate-900">
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
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/20 focus:border-[var(--theme-primary)] transition"
                    />
                </div>

                {/* Category Pills */}
                <div 
                    onWheel={(e) => {
                        if (e.deltaY !== 0) {
                            e.currentTarget.scrollLeft += e.deltaY;
                        }
                    }}
                    className="flex items-center gap-1.5 overflow-x-auto overflow-y-hidden flex-nowrap py-1.5 inquiry-scrollbar scroll-smooth"
                >
                    {categories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                                    isSelected
                                        ? 'shadow-xs font-semibold'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                                style={isSelected ? { background: 'var(--theme-primary)', color: 'var(--theme-text-on-primary)' } : {}}
                            >
                                {cat}
                            </button>
                        );
                    })}
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
                                    className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all group flex flex-col gap-2"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span 
                                                className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full"
                                                style={{ 
                                                    background: 'color-mix(in srgb, var(--theme-primary) 12%, white)', 
                                                    color: 'var(--theme-primary)' 
                                                }}
                                            >
                                                {item.category}
                                            </span>
                                            <h4 className="text-xs font-bold text-slate-900">
                                                {item.title}
                                            </h4>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSelect(item.template)}
                                            className="h-7 px-2.5 rounded-lg text-[11px] text-white font-medium gap-1 shadow-xs hover:opacity-90"
                                            style={{ background: 'var(--theme-gradient)', color: 'var(--theme-text-on-primary)' }}
                                        >
                                            <CornerDownLeft className="h-3 w-3" />
                                            Use Reply
                                        </Button>
                                    </div>

                                    {/* Preview Box */}
                                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 bg-white p-2.5 rounded-lg border border-slate-100 select-text break-words">
                                        {formattedPreview.replace(/\s+/g, ' ').trim()}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
