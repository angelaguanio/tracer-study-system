import React, { useState, useMemo, useRef } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { toast } from 'sonner';
import { applySystemTheme } from '@/lib/theme';
import {
  Palette,
  Sparkles,
  Image as ImageIcon,
  Type,
  RotateCcw,
  Check,
  Upload,
  Sun,
  Layers,
  Eye,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

// Pre-curated professional presets
const COLOR_PRESETS = [
  {
    id: 'emerald',
    name: 'Wesleyan Emerald',
    description: 'Clean university emerald & forest green (Default)',
    primary: '#15803d',
    secondary: '#166534',
    fontOnPrimary: '#ffffff',
    textPrimary: '#15803d',
  },
  {
    id: 'ocean',
    name: 'Royal Ocean Blue',
    description: 'Vibrant sapphire & oceanic azure gradients',
    primary: '#1d4ed8',
    secondary: '#0284c7',
    fontOnPrimary: '#ffffff',
    textPrimary: '#1d4ed8',
  },
  {
    id: 'crimson',
    name: 'Crimson Elegance',
    description: 'Bold ruby crimson & deep burgundy accents',
    primary: '#be123c',
    secondary: '#e11d48',
    fontOnPrimary: '#ffffff',
    textPrimary: '#be123c',
  },
  {
    id: 'purple',
    name: 'Amethyst Violet',
    description: 'Regal amethyst and rich ultraviolet shades',
    primary: '#6d28d9',
    secondary: '#9333ea',
    fontOnPrimary: '#ffffff',
    textPrimary: '#6d28d9',
  },
  {
    id: 'amber',
    name: 'Warm Amber Gold',
    description: 'Inviting golden amber and deep honey tones',
    primary: '#b45309',
    secondary: '#d97706',
    fontOnPrimary: '#ffffff',
    textPrimary: '#b45309',
  },
  {
    id: 'slate',
    name: 'Midnight Slate',
    description: 'Sleek executive dark slate & charcoal minimalism',
    primary: '#334155',
    secondary: '#1e293b',
    fontOnPrimary: '#ffffff',
    textPrimary: '#334155',
  },
];

// Helper to determine optimal text color based on background luminance
function getContrastTextColor(hexColor) {
  if (!hexColor || !hexColor.startsWith('#')) return '#ffffff';
  let cleanHex = hexColor.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  // Perceived luminance formula (ITU-R BT.709)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.55 ? '#0f172a' : '#ffffff';
}

export default function AdminThemeSettings({ settings = {} }) {
  const [activeTab, setActiveTab] = useState('theme'); // 'theme' | 'branding'
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(settings.app_logo || null);

  // Form for Theme & Colors
  const themeForm = useForm({
    theme_preset: settings.theme_preset || 'emerald',
    theme_style: settings.theme_style || 'solid',
    primary_color: settings.primary_color || '#15803d',
    secondary_color: settings.secondary_color || '#166534',
    font_color_on_primary: settings.font_color_on_primary || '#ffffff',
    text_color_primary: settings.text_color_primary || '#15803d',
  });

  // Form for Branding (App Name, Logo)
  const brandingForm = useForm({
    app_name: settings.app_name || 'Alumni Connect',
    app_logo: null,
  });

  // Active theme computed style for preview
  const previewBackground = useMemo(() => {
    if (themeForm.data.theme_style === 'gradient') {
      return `linear-gradient(135deg, ${themeForm.data.primary_color} 0%, ${themeForm.data.secondary_color} 100%)`;
    }
    return themeForm.data.primary_color;
  }, [themeForm.data.theme_style, themeForm.data.primary_color, themeForm.data.secondary_color]);

  // Select a preset
  const handleSelectPreset = (preset) => {
    const updated = {
      theme_preset: preset.id,
      theme_style: themeForm.data.theme_style,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      font_color_on_primary: preset.fontOnPrimary,
      text_color_primary: preset.textPrimary,
    };
    themeForm.setData(updated);
    applySystemTheme(updated);
  };

  // Switch style between solid and gradient
  const handleStyleChange = (style) => {
    const updated = {
      ...themeForm.data,
      theme_style: style,
    };
    themeForm.setData('theme_style', style);
    applySystemTheme(updated);
  };

  // Handle custom primary color change
  const handlePrimaryColorChange = (color) => {
    const autoContrast = getContrastTextColor(color);
    const updated = {
      ...themeForm.data,
      theme_preset: 'custom',
      primary_color: color,
      text_color_primary: color,
      font_color_on_primary: autoContrast,
    };
    themeForm.setData(updated);
    applySystemTheme(updated);
  };

  // Handle custom secondary color change
  const handleSecondaryColorChange = (color) => {
    const updated = {
      ...themeForm.data,
      theme_preset: 'custom',
      secondary_color: color,
    };
    themeForm.setData(updated);
    applySystemTheme(updated);
  };

  // Submit Theme
  const handleSaveTheme = (e) => {
    e.preventDefault();
    themeForm.post(route('admin.theme-settings.theme'), {
      preserveScroll: true,
      onSuccess: () => {
        applySystemTheme(themeForm.data);
        toast.success('Website theme & color palette successfully applied across the entire system!');
      },
      onError: (errs) => {
        toast.error('Failed to update theme. Please review your color selections.');
      },
    });
  };

  // Handle Logo file select
  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error('Logo image size must be 3MB or less.');
        return;
      }
      brandingForm.setData('app_logo', file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Branding
  const handleSaveBranding = (e) => {
    e.preventDefault();
    brandingForm.post(route('admin.theme-settings.branding'), {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        toast.success('Platform identity (Name & Logo) successfully updated!');
      },
      onError: () => {
        toast.error('Failed to update branding settings.');
      },
    });
  };

  // Reset to system defaults
  const handleResetDefaults = () => {
    router.post(route('admin.theme-settings.reset'), {}, {
      preserveScroll: true,
      onSuccess: () => {
        setResetModalOpen(false);
        const defaults = {
          theme_preset: 'emerald',
          theme_style: 'solid',
          primary_color: '#15803d',
          secondary_color: '#166534',
          font_color_on_primary: '#ffffff',
          text_color_primary: '#15803d',
        };
        applySystemTheme(defaults);
        toast.success('Theme and branding reset to original defaults.');
        themeForm.reset();
        brandingForm.reset();
        setLogoPreview(null);
      },
    });
  };

  return (
    <AdminLayout>
      <Head title="Website Theme & Branding Settings" />

      <div className="w-full max-w-6xl mx-auto space-y-6 pb-16">
        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Palette className="size-6 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Website Theme & Branding
              </h1>
            </div>
            <p className="text-sm text-slate-500 max-w-2xl">
              Customize your platform's appearance, brand name, and logo. All color and typography choices automatically adapt across all user roles (Alumna, Coordinator, and Admin).
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setResetModalOpen(true)}
            className="shrink-0 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 border-slate-200 transition-colors"
          >
            <RotateCcw className="size-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-5 py-3 font-medium text-sm border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'theme'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Palette className="size-4" />
            Theme & Colors
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`px-5 py-3 font-medium text-sm border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'branding'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <ImageIcon className="size-4" />
            Platform Identity & Logo
          </button>
        </div>

        {/* TAB 1: THEME & COLORS */}
        {activeTab === 'theme' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Color Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handleSaveTheme} className="space-y-6">
                {/* 1. Theme Style Toggle: Solid vs Gradient */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Layers className="size-4 text-emerald-600" />
                        Theme Style Mode
                      </h2>
                      <p className="text-xs text-slate-500">
                        Choose whether buttons, headers, and accents render as a solid block or a sleek modern gradient.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleStyleChange('solid')}
                      className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all text-left cursor-pointer ${
                        themeForm.data.theme_style === 'solid'
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="size-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                        {themeForm.data.theme_style === 'solid' && <Check className="size-4" />}
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-slate-900 block">Solid Color</span>
                        <span className="text-xs text-slate-500">Classic, uniform, and minimal</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStyleChange('gradient')}
                      className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all text-left cursor-pointer ${
                        themeForm.data.theme_style === 'gradient'
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                        {themeForm.data.theme_style === 'gradient' && <Check className="size-4" />}
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-slate-900 block">Vibrant Gradient</span>
                        <span className="text-xs text-slate-500">Modern, dynamic depth</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Curated Presets */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Sparkles className="size-4 text-emerald-600" />
                        Curated Color Palettes
                      </h2>
                      <p className="text-xs text-slate-500">
                        Select one of our professionally balanced palettes tailored for high legibility and aesthetic balance.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COLOR_PRESETS.map((preset) => {
                      const isSelected = themeForm.data.theme_preset === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset)}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/30 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Color Swatch */}
                            <div
                              className="size-8 rounded-lg shrink-0 border border-black/10 shadow-xs flex items-center justify-center"
                              style={{
                                background:
                                  themeForm.data.theme_style === 'gradient'
                                    ? `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`
                                    : preset.primary,
                              }}
                            >
                              {isSelected && <Check className="size-4 text-white drop-shadow-sm" />}
                            </div>
                            <div className="truncate">
                              <span className="font-medium text-sm text-slate-900 block truncate">
                                {preset.name}
                              </span>
                              <span className="text-[11px] text-slate-400 block truncate">
                                {preset.primary}
                              </span>
                            </div>
                          </div>

                          {isSelected && (
                            <Badge className="bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5">
                              Active
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Custom Color Pickers */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Sliders className="size-4 text-emerald-600" />
                      Custom Color Tweaks
                    </h2>
                    <p className="text-xs text-slate-500">
                      Fine-tune the exact hex colors for your institution's official brand guidelines.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Color Picker */}
                    <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <Label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>Primary Color</span>
                        <span className="text-[10px] text-slate-400">Buttons, Main Accents</span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={themeForm.data.primary_color}
                          onChange={(e) => handlePrimaryColorChange(e.target.value)}
                          className="size-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white shadow-xs"
                        />
                        <Input
                          type="text"
                          value={themeForm.data.primary_color}
                          onChange={(e) => handlePrimaryColorChange(e.target.value)}
                          placeholder="#15803d"
                          className="font-mono text-sm uppercase bg-white"
                          maxLength={7}
                        />
                      </div>
                    </div>

                    {/* Secondary Color Picker */}
                    <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <Label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>Secondary / Gradient Color</span>
                        <span className="text-[10px] text-slate-400">Gradient Endpoint & Badges</span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={themeForm.data.secondary_color}
                          onChange={(e) => handleSecondaryColorChange(e.target.value)}
                          className="size-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white shadow-xs"
                        />
                        <Input
                          type="text"
                          value={themeForm.data.secondary_color}
                          onChange={(e) => handleSecondaryColorChange(e.target.value)}
                          placeholder="#166534"
                          className="font-mono text-sm uppercase bg-white"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Font Color on Primary Background (Contrast adaptation) */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                          <Type className="size-4 text-emerald-600" />
                          Font Color on Primary Backgrounds
                        </Label>
                        <p className="text-[11px] text-slate-500">
                          Controls the text color inside buttons and badges so text remains clearly readable on top of your primary color.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {/* White button option */}
                      <button
                        type="button"
                        onClick={() => themeForm.setData('font_color_on_primary', '#ffffff')}
                        className={`px-4 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                          themeForm.data.font_color_on_primary.toLowerCase() === '#ffffff'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span className="size-3 rounded-full bg-white border border-slate-300 inline-block" />
                        White Text (#FFFFFF)
                      </button>

                      {/* Dark button option */}
                      <button
                        type="button"
                        onClick={() => themeForm.setData('font_color_on_primary', '#0f172a')}
                        className={`px-4 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                          themeForm.data.font_color_on_primary.toLowerCase() === '#0f172a'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span className="size-3 rounded-full bg-slate-900 border border-slate-900 inline-block" />
                        Dark Slate Text (#0F172A)
                      </button>

                      {/* Custom font color picker */}
                      <div className="flex items-center gap-2 ml-auto">
                        <input
                          type="color"
                          value={themeForm.data.font_color_on_primary}
                          onChange={(e) => themeForm.setData('font_color_on_primary', e.target.value)}
                          className="size-7 rounded cursor-pointer border border-slate-300 p-0.5 bg-white"
                          title="Custom font color"
                        />
                        <span className="text-xs font-mono text-slate-600 uppercase">
                          {themeForm.data.font_color_on_primary}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Theme Action Button */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={themeForm.processing}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-medium shadow-sm transition-all"
                  >
                    {themeForm.processing ? 'Applying Theme...' : 'Save Theme & Colors'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Column: Live Interactive Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="size-4 text-emerald-600" />
                    <h3 className="font-semibold text-slate-900 text-sm">Live Real-time Preview</h3>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono uppercase bg-slate-50 text-slate-600">
                    {themeForm.data.theme_style} mode
                  </Badge>
                </div>

                <p className="text-xs text-slate-500">
                  This mock preview showcases how your colors and font contrast will look across navigation, buttons, and badges.
                </p>

                {/* Mock UI Sandbox */}
                <div 
                  className="border border-slate-200 rounded-xl overflow-hidden shadow-inner p-4 space-y-4 transition-colors duration-300"
                  style={{ background: `color-mix(in srgb, ${themeForm.data.primary_color} 4.5%, #ffffff)` }}
                >
                  {/* Mock Navbar */}
                  <div
                    className="rounded-lg px-4 py-3 flex items-center justify-between shadow-xs transition-all duration-300"
                    style={{
                      background: previewBackground,
                      color: themeForm.data.font_color_on_primary,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="size-5" />
                      <span className="font-bold text-xs tracking-wide">
                        {brandingForm.data.app_name || 'Alumni Connect'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] opacity-90">
                      <span className="px-2 py-0.5 rounded bg-white/20 font-medium">Home</span>
                      <span className="px-2 py-0.5 font-normal">Surveys</span>
                    </div>
                  </div>

                  {/* Mock Content Card */}
                  <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h4
                        className="text-sm font-bold transition-colors"
                        style={{ color: themeForm.data.text_color_primary }}
                      >
                        Sample Announcement
                      </h4>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${themeForm.data.primary_color}18`,
                          color: themeForm.data.primary_color,
                        }}
                      >
                        Featured
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      "Welcome back alumni! This is a preview of your system's dynamic styling and legible font contrast."
                    </p>

                    <div className="flex items-center gap-2 pt-2">
                      {/* Primary Styled Button */}
                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-default"
                        style={{
                          background: previewBackground,
                          color: themeForm.data.font_color_on_primary,
                        }}
                      >
                        <span>Participate</span>
                        <CheckCircle2 className="size-3.5" />
                      </button>

                      {/* Outline Accent Button */}
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-default"
                        style={{
                          borderColor: themeForm.data.primary_color,
                          color: themeForm.data.primary_color,
                        }}
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contrast Score Indicator */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <ShieldCheck className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-semibold text-slate-800 block">Accessibility & Contrast</span>
                    <span className="text-slate-500 block leading-tight">
                      The font on primary buttons is set to{' '}
                      <strong className="text-slate-700 font-mono">
                        {themeForm.data.font_color_on_primary}
                      </strong>{' '}
                      to ensure readability for all alumni and staff.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PLATFORM IDENTITY & BRANDING */}
        {activeTab === 'branding' && (
          <div className="max-w-2xl bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="size-5 text-emerald-600" />
                Platform Identity & Logo
              </h2>
              <p className="text-sm text-slate-500">
                Update the official title and logo that appear on the login page, navigation bars, and system reports.
              </p>
            </div>

            <form onSubmit={handleSaveBranding} className="space-y-6">
              {/* System Name Input */}
              <div className="space-y-2">
                <Label htmlFor="app_name" className="text-sm font-semibold text-slate-800">
                  System Name
                </Label>
                <Input
                  id="app_name"
                  type="text"
                  value={brandingForm.data.app_name}
                  onChange={(e) => brandingForm.setData('app_name', e.target.value)}
                  placeholder="e.g. Alumni Connect, WUP Tracer"
                  className="max-w-md text-base"
                  maxLength={100}
                  required
                />
                <p className="text-xs text-slate-400">
                  This name displays in the top navigation bar, browser tab title, and authentication cards.
                </p>
                {brandingForm.errors.app_name && (
                  <p className="text-xs text-red-600">{brandingForm.errors.app_name}</p>
                )}
              </div>

              {/* Logo Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-800">Platform Logo</Label>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  {/* Current / Preview Image */}
                  <div className="size-28 rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-slate-400 text-xs">
                        <ImageIcon className="size-8 mx-auto mb-1 opacity-50" />
                        <span>No Logo</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="space-y-2 flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleLogoFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-slate-300 text-slate-700 hover:bg-slate-100"
                      >
                        <Upload className="size-4 mr-2" />
                        Browse New Logo Image
                      </Button>
                      {logoPreview && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setLogoPreview(null);
                            brandingForm.setData({
                              ...brandingForm.data,
                              app_logo: null,
                              remove_logo: true,
                            });
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                        >
                          Remove Custom Logo
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Recommended: PNG, JPG, or WEBP with transparent background (Max 3MB). Files are automatically optimized for web performance.
                    </p>
                    {brandingForm.errors.app_logo && (
                      <p className="text-xs text-red-600">{brandingForm.errors.app_logo}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  disabled={brandingForm.processing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-medium shadow-sm transition-all"
                >
                  {brandingForm.processing ? 'Saving Changes...' : 'Save Platform Identity'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Resetting Defaults */}
      <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="size-5" />
              Reset All Customizations?
            </DialogTitle>
            <DialogDescription className="text-slate-600 pt-2 text-sm leading-relaxed">
              This will revert the platform name back to <strong>"Alumni Connect"</strong>, restore the original logo, and reset all theme colors to the default <strong>Wesleyan Emerald</strong> palette.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button variant="outline" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetDefaults}>
              Yes, Reset Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
