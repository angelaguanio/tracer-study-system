/**
 * Global Theme Applicator
 * Applies active system settings (primary, secondary, gradients, and font colors)
 * directly to the document root and injects dynamic CSS rules for immediate
 * propagation across all user roles (Admin, Coordinator, and Alumna).
 */
export function applySystemTheme(settings) {
  if (!settings || typeof window === 'undefined') return;

  const root = document.documentElement;
  const primary = settings.primary_color || '#15803d';
  const secondary = settings.secondary_color || '#166534';
  const isGradient = settings.theme_style === 'gradient';
  const gradient = isGradient
    ? `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`
    : primary;
  const fontOnPrimary = settings.font_color_on_primary || '#ffffff';
  const textPrimary = settings.text_color_primary || primary;

  // Set CSS Variables on :root
  root.style.setProperty('--theme-primary', primary);
  root.style.setProperty('--theme-secondary', secondary);
  root.style.setProperty('--theme-gradient', gradient);
  root.style.setProperty('--theme-text-on-primary', fontOnPrimary);
  root.style.setProperty('--theme-text-primary', textPrimary);

  root.style.setProperty('--color-blue-btn', primary);
  root.style.setProperty('--color-bluehover-btn', secondary);
  root.style.setProperty('--color-navbar', gradient);
  root.style.setProperty('--color-navbar-text', fontOnPrimary);
  root.style.setProperty('--sidebar-accent', primary);
  root.style.setProperty('--sidebar-accent-foreground', fontOnPrimary);
  root.style.setProperty('--primary', primary);
  root.style.setProperty('--primary-foreground', fontOnPrimary);

  // Dynamic runtime stylesheet override to ensure all Admin, Coord, and Alumna components adapt instantly
  let styleEl = document.getElementById('system-theme-runtime-overrides');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'system-theme-runtime-overrides';
    document.head.appendChild(styleEl);
  }

  styleEl.innerHTML = `
    .theme-sidebar-bg,
    [data-sidebar="sidebar"],
    [data-slot="sidebar-inner"] {
      background: ${gradient} !important;
      color: ${fontOnPrimary} !important;
    }

    /* Primary Buttons & Actions */
    .bg-blue-600,
    button.bg-blue-600,
    a.bg-blue-600,
    .bg-blue-btn,
    .bg-\\[\\#005AAA\\],
    .bg-\\[\\#007AD7\\],
    .bg-\\[\\#009AFB\\],
    .bg-\\[\\#1258D6\\] {
      background-color: ${primary} !important;
      color: ${fontOnPrimary} !important;
      border-color: ${primary} !important;
    }

    .bg-blue-600:hover,
    .hover\\:bg-blue-700:hover,
    button.bg-blue-600:hover,
    a.bg-blue-600:hover,
    .hover\\:bg-bluehover-btn:hover,
    .hover\\:bg-\\[\\#003C87\\]:hover,
    .hover\\:bg-\\[\\#005AAA\\]:hover,
    .hover\\:bg-\\[\\#0082D6\\]:hover {
      background-color: ${secondary} !important;
      border-color: ${secondary} !important;
    }

    /* Headings, Icons, & Accent Text */
    .text-blue-600,
    .focus\\:text-blue-600:focus,
    .hover\\:text-blue-600:hover,
    .text-\\[\\#003C87\\],
    .text-\\[\\#005AAA\\],
    .text-\\[\\#007AD7\\],
    .text-\\[\\#009AFB\\],
    .text-\\[\\#1258D6\\],
    .group:hover .group-hover\\:text-\\[\\#005AAA\\] {
      color: ${primary} !important;
    }

    .text-blue-700 {
      color: ${secondary} !important;
    }

    /* Card Borders & Focus Rings */
    .border-blue-600,
    .border-\\[\\#007AD7\\],
    .border-\\[\\#009AFB\\] {
      border-color: ${primary} !important;
    }

    .border-blue-200,
    .border-blue-200\\/80,
    .border-blue-100,
    .border-blue-100\\/50,
    .hover\\:border-blue-300:hover {
      border-color: color-mix(in srgb, ${primary} 25%, #e2e8f0) !important;
    }

    .bg-blue-50,
    .bg-blue-50\\/80,
    .bg-blue-100,
    .bg-blue-100\\/50,
    .hover\\:bg-blue-50:hover,
    .focus\\:bg-blue-50:focus {
      background-color: color-mix(in srgb, ${primary} 10%, white) !important;
    }

    /* Headings, Text & Dots */
    .text-blue-500,
    .text-blue-800,
    .text-blue-text {
      color: ${primary} !important;
    }

    .bg-blue-400 {
      background-color: ${primary} !important;
    }

    /* SVG Waves & Background Magic UI */
    .fill-blue-500\\/20 {
      fill: color-mix(in srgb, ${primary} 18%, transparent) !important;
    }

    path[fill="#005AAA"],
    path[fill="#003C87"],
    path[fill="#60A5FA"],
    path[fill="#93C5FD"] {
      fill: ${primary} !important;
    }

    /* Card Adaptive Highlights */
    .theme-card-accent {
      border-top: 3px solid ${primary} !important;
    }

    .theme-banner-bg {
      background: ${gradient} !important;
      color: ${fontOnPrimary} !important;
    }

    .theme-hero-overlay {
      background: linear-gradient(to top, color-mix(in srgb, ${primary} 85%, black) 0%, rgba(0, 0, 0, 0.4) 100%) !important;
    }
  `;
}
