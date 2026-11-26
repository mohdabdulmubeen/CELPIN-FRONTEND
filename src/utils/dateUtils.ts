/**
 * Date Utility Functions for Celpin Smart Co-Working Cafe
 * Zero-dependency, timezone-safe date helpers for booking ranges and calendars.
 */

/**
 * Format Date to YYYY-MM-DD using local timezone values to prevent off-by-one errors.
 */
export function formatYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string into a local midnight Date.
 */
export function parseYMD(str: string): Date {
  if (!str) return new Date();
  const parts = str.split('-');
  if (parts.length !== 3) return new Date(str);
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day, 0, 0, 0, 0);
}

/**
 * Returns today's date formatted as YYYY-MM-DD.
 */
export function getTodayStr(): string {
  return formatYMD(new Date());
}

/**
 * Checks if two dates (string or Date) fall on the exact same calendar day.
 */
export function isSameDay(d1?: string | Date | null, d2?: string | Date | null): boolean {
  if (!d1 || !d2) return false;
  const s1 = typeof d1 === 'string' ? d1 : formatYMD(d1);
  const s2 = typeof d2 === 'string' ? d2 : formatYMD(d2);
  return s1 === s2;
}

/**
 * Returns true if dateStr is strictly in the past relative to today.
 */
export function isPastDate(dateStr: string, todayStr: string = getTodayStr()): boolean {
  return dateStr < todayStr;
}

/**
 * Returns true if d1 is strictly before d2 (lexicographical comparison on YYYY-MM-DD).
 */
export function isBefore(d1: string, d2: string): boolean {
  return d1 < d2;
}

/**
 * Returns true if d1 is strictly after d2.
 */
export function isAfter(d1: string, d2: string): boolean {
  return d1 > d2;
}

/**
 * Returns true if target date is between start and end (inclusive).
 */
export function isDateInRange(target: string, start?: string, end?: string): boolean {
  if (!start && !end) return false;
  if (start && !end) return target === start;
  if (!start && end) return target === end;
  const s = start as string;
  const e = end as string;
  const min = s <= e ? s : e;
  const max = s <= e ? e : s;
  return target >= min && target <= max;
}

/**
 * Adds N calendar days to a YYYY-MM-DD string.
 */
export function addDays(dateStr: string, days: number): string {
  const d = parseYMD(dateStr);
  d.setDate(d.getDate() + days);
  return formatYMD(d);
}

/**
 * Adds N weeks to a YYYY-MM-DD string.
 */
export function addWeeks(dateStr: string, weeks: number): string {
  return addDays(dateStr, weeks * 7);
}

/**
 * Adds N months to a YYYY-MM-DD string.
 */
export function addMonths(dateStr: string, months: number): string {
  const d = parseYMD(dateStr);
  d.setMonth(d.getMonth() + months);
  return formatYMD(d);
}

/**
 * Calculates the inclusive day count between startDate and endDate.
 * Example: Nov 10 to Nov 10 is 1 day. Nov 10 to Nov 16 is 7 days.
 */
export function getDaysDifference(startDate?: string, endDate?: string): number {
  if (!startDate) return 0;
  if (!endDate || endDate === startDate) return 1;
  const start = parseYMD(startDate);
  const end = parseYMD(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Formats date into human-readable string.
 * Example: 'Tue, Nov 10, 2026' or 'Nov 10, 2026' or 'Nov 10'
 */
export function formatDisplayDate(
  dateInput?: string | Date | null,
  options: {
    includeDayOfWeek?: boolean;
    includeYear?: boolean;
    shortMonth?: boolean;
  } = {}
): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? parseYMD(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  const {
    includeDayOfWeek = true,
    includeYear = true,
    shortMonth = true
  } = options;

  const weekday = includeDayOfWeek
    ? date.toLocaleDateString('en-US', { weekday: 'short' }) + ', '
    : '';
  const month = date.toLocaleDateString('en-US', {
    month: shortMonth ? 'short' : 'long'
  });
  const day = date.getDate();
  const year = includeYear ? `, ${date.getFullYear()}` : '';

  return `${weekday}${month} ${day}${year}`;
}

/**
 * Formats a start and end date range into a concise user-friendly summary.
 * Example: 'Nov 10 – Nov 16, 2026 (7 Days)' or 'Nov 10, 2026 (Single Day)'
 */
export function formatRangeSummary(startDate?: string, endDate?: string): string {
  if (!startDate) return 'Select date range';
  const days = getDaysDifference(startDate, endDate);
  const startFormatted = formatDisplayDate(startDate, { includeDayOfWeek: false, includeYear: false });

  if (!endDate || startDate === endDate) {
    const year = parseYMD(startDate).getFullYear();
    return `${startFormatted}, ${year} (1 Day)`;
  }

  const startYear = parseYMD(startDate).getFullYear();
  const endYear = parseYMD(endDate).getFullYear();
  const endFormatted = formatDisplayDate(endDate, {
    includeDayOfWeek: false,
    includeYear: startYear !== endYear
  });

  const yearSuffix = startYear === endYear ? `, ${startYear}` : '';
  const unit = days === 1 ? '1 Day' : `${days} Days`;
  return `${startFormatted} – ${endFormatted}${yearSuffix} (${unit})`;
}

export interface CalendarDayItem {
  date: Date;
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  dayOfWeek: number; // 0 = Sun, 6 = Sat
}

/**
 * Builds a 35 or 42 day calendar matrix for a given year and month.
 */
export function getMonthCalendarGrid(year: number, month: number): CalendarDayItem[] {
  const todayStr = getTodayStr();
  const firstDay = new Date(year, month, 1);
  const startingDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const items: CalendarDayItem[] = [];

  // Previous month trailing days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const d = new Date(year, month - 1, day);
    const dateStr = formatYMD(d);
    items.push({
      date: d,
      dateStr,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isPast: isPastDate(dateStr, todayStr),
      dayOfWeek: d.getDay()
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dateStr = formatYMD(d);
    items.push({
      date: d,
      dateStr,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isPast: isPastDate(dateStr, todayStr),
      dayOfWeek: d.getDay()
    });
  }

  // Next month leading days to complete the 7-column grid
  const remainingCells = (7 - (items.length % 7)) % 7;
  // ensure at least 35 or 42 cells for consistent height
  const totalTarget = items.length + remainingCells < 35 ? 35 : items.length + remainingCells;
  const neededNextMonth = totalTarget - items.length;

  for (let day = 1; day <= neededNextMonth; day++) {
    const d = new Date(year, month + 1, day);
    const dateStr = formatYMD(d);
    items.push({
      date: d,
      dateStr,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isPast: isPastDate(dateStr, todayStr),
      dayOfWeek: d.getDay()
    });
  }

  return items;
}

export interface DatePreset {
  id: string;
  label: string;
  shortLabel: string;
  getRange: (referenceDate?: string) => { startDate: string; endDate: string; daysCount: number };
}

/**
 * Standard quick presets for fast selection
 */
export const DATE_PRESETS: DatePreset[] = [
  {
    id: 'today',
    label: 'Today',
    shortLabel: '1d',
    getRange: (ref = getTodayStr()) => ({
      startDate: ref,
      endDate: ref,
      daysCount: 1
    })
  },
  {
    id: 'tomorrow',
    label: 'Tomorrow',
    shortLabel: 'Tmrw',
    getRange: (ref = getTodayStr()) => {
      const tmrw = addDays(ref, 1);
      return { startDate: tmrw, endDate: tmrw, daysCount: 1 };
    }
  },
  {
    id: '3days',
    label: '3 Days',
    shortLabel: '3d',
    getRange: (ref = getTodayStr()) => ({
      startDate: ref,
      endDate: addDays(ref, 2),
      daysCount: 3
    })
  },
  {
    id: 'week',
    label: '1 Week (7d)',
    shortLabel: '7d',
    getRange: (ref = getTodayStr()) => ({
      startDate: ref,
      endDate: addDays(ref, 6),
      daysCount: 7
    })
  },
  {
    id: '2weeks',
    label: '2 Weeks (14d)',
    shortLabel: '14d',
    getRange: (ref = getTodayStr()) => ({
      startDate: ref,
      endDate: addDays(ref, 13),
      daysCount: 14
    })
  },
  {
    id: 'month',
    label: '1 Month (30d)',
    shortLabel: '30d',
    getRange: (ref = getTodayStr()) => ({
      startDate: ref,
      endDate: addDays(ref, 29),
      daysCount: 30
    })
  }
];

export interface BookingTimeSlot {
  startTime: string; // "09:00"
  endTime: string;   // "11:00"
  startHour: number; // 9
  endHour: number;   // 11
  label: string;     // "9:00 AM – 11:00 AM"
  shortLabel: string;// "9:00–11:00"
}

export function formatHourLabel(hour: number): string {
  const h = Math.floor(hour) % 24;
  if (h === 0) return '12:00 AM';
  if (h < 12) return `${h}:00 AM`;
  if (h === 12) return '12:00 PM';
  return `${h - 12}:00 PM`;
}

export function formatShortHourLabel(hour: number): string {
  const h = Math.floor(hour) % 24;
  if (h === 0) return '12:00';
  if (h <= 12) return `${h}:00`;
  return `${h - 12}:00`;
}

export function parseStartHour(timeStr?: string): number {
  if (!timeStr) return 9;
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10);
  return isNaN(h) ? 9 : h;
}

export function parseCafeHours(timingStr?: string): { startHour: number; endHour: number } {
  let startHour = 9; // Default workspace check-in start 9:00 AM
  let endHour = 21;  // Default workspace closing 9:00 PM (21:00)

  if (timingStr) {
    const parts = timingStr.split(/[–-]/);
    if (parts.length === 2) {
      const closeMatch = parts[1].trim().match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
      if (closeMatch) {
        let h = parseInt(closeMatch[1], 10);
        const isPM = closeMatch[3].toUpperCase() === 'PM';
        if (isPM && h < 12) h += 12;
        if (!isPM && h === 12) h = 0;
        endHour = Math.max(startHour + 1, h);
      }
    }
  }

  return { startHour, endHour };
}

/**
 * Returns consecutive duration time slots fitting strictly within booking hours.
 * For example:
 * - 2h duration: 9:00–11:00, 11:00–1:00, 1:00–3:00, 3:00–5:00, 5:00–7:00, 7:00–9:00
 * - 3h duration: 9:00–12:00, 12:00–3:00, 3:00–6:00, 6:00–9:00
 * - Only slots that fit within available booking hours are returned.
 */
export function getConsecutiveTimeSlots(
  durationHours: number = 2,
  timingStr?: string
): BookingTimeSlot[] {
  const validDuration = Math.max(1, Math.min(8, Math.floor(durationHours)));
  const { startHour, endHour } = parseCafeHours(timingStr);

  const slots: BookingTimeSlot[] = [];
  let curr = startHour;

  while (curr + validDuration <= endHour) {
    const end = curr + validDuration;
    const startStr = `${String(curr).padStart(2, '0')}:00`;
    const endStr = `${String(end).padStart(2, '0')}:00`;

    slots.push({
      startTime: startStr,
      endTime: endStr,
      startHour: curr,
      endHour: end,
      label: `${formatHourLabel(curr)} – ${formatHourLabel(end)}`,
      shortLabel: `${formatShortHourLabel(curr)}–${formatShortHourLabel(end)}`
    });

    curr += validDuration;
  }

  return slots;
}

/**
 * Formats a start time and duration into a start-end slot label, e.g. "9:00 AM – 11:00 AM"
 */
export function formatTimeSlotRange(
  startTime?: string,
  durationHours: number = 2
): string {
  const startH = parseStartHour(startTime);
  const dur = Math.max(1, Math.min(8, Math.floor(durationHours || 2)));
  const endH = startH + dur;
  return `${formatHourLabel(startH)} – ${formatHourLabel(endH)}`;
}
