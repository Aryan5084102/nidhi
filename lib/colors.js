/**
 * Centralized color constants for JS/inline styles.
 * Maps to CSS variables defined in globals.css @theme.
 * Change a color here → reflects everywhere in JS.
 * For Tailwind classes, change the @theme variables in globals.css.
 */

// ── Primary (Indigo) ──
export const PRIMARY = "#6366F1";
export const PRIMARY_50 = "#EEF2FF";
export const PRIMARY_100 = "#E0E7FF";
export const PRIMARY_200 = "#C7D2FE";
export const PRIMARY_300 = "#A5B4FC";
export const PRIMARY_400 = "#818CF8";
export const PRIMARY_500 = "#6366F1";
export const PRIMARY_700 = "#4338CA";

// ── Success (Emerald) ──
export const SUCCESS = "#059669";
export const SUCCESS_50 = "#ECFDF5";
export const SUCCESS_100 = "#D1FAE5";
export const SUCCESS_200 = "#A7F3D0";
export const SUCCESS_300 = "#6EE7B7";
export const SUCCESS_400 = "#34D399";
export const SUCCESS_500 = "#10B981";
export const SUCCESS_700 = "#047857";

// ── Warning (Amber) ──
export const WARNING = "#D97706";
export const WARNING_50 = "#FFFBEB";
export const WARNING_100 = "#FEF3C7";
export const WARNING_200 = "#FDE68A";
export const WARNING_300 = "#FCD34D";
export const WARNING_400 = "#FBBF24";
export const WARNING_500 = "#F59E0B";

// ── Danger (Red) ──
export const DANGER = "#DC2626";
export const DANGER_50 = "#FEF2F2";
export const DANGER_100 = "#FEE2E2";
export const DANGER_200 = "#FECACA";
export const DANGER_400 = "#F87171";
export const DANGER_500 = "#EF4444";

// ── Secondary (Purple) ──
export const SECONDARY = "#7C3AED";
export const SECONDARY_50 = "#FAF5FF";
export const SECONDARY_100 = "#F3E8FF";
export const SECONDARY_200 = "#E9D5FF";
export const SECONDARY_500 = "#8B5CF6";
export const SECONDARY_700 = "#6D28D9";

// ── Misc Accents ──
export const TEAL = "#0D9488";
export const GOLD = "#C9982E";
export const NAVY = "#0F172A";
export const NAVY_LIGHT = "#1E293B";
export const SKY = "#0284C7";
export const ROSE = "#E11D48";

// ── Scheme accent palette (for cards mapped by index) ──
export const SCHEME_ACCENTS = [PRIMARY, SUCCESS, SECONDARY, TEAL, WARNING, DANGER, "#2563EB", "#9333EA"];

// ── Chart colors ──
export const CHART_PRIMARY = PRIMARY;
export const CHART_SUCCESS = SUCCESS;
export const CHART_SECONDARY = SECONDARY;
export const CHART_WARNING = WARNING;
export const CHART_DANGER = DANGER;

// ── Status color map ──
export const STATUS_COLORS = {
  Active: SUCCESS,
  Warning: WARNING,
  Alert: DANGER,
};
