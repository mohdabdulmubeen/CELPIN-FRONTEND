import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Sparkles,
  X,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { DateRangeCalendar, DateRangeValue } from './DateRangeCalendar';
import { formatDisplayDate, formatRangeSummary, getDaysDifference, getTodayStr } from '../utils/dateUtils';

export interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onChange: (range: DateRangeValue) => void;
  minDate?: string;
  maxDate?: string;
  mode?: 'range' | 'single';
  showPresets?: boolean;
  highlightedDates?: string[];
  unavailableDates?: string[];
  className?: string;
  buttonClassName?: string;
  label?: string;
  placeholder?: string;
  inline?: boolean;
  disabled?: boolean;
  align?: 'left' | 'right' | 'center';
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
  mode = 'range',
  showPresets = true,
  highlightedDates = [],
  unavailableDates = [],
  className = '',
  buttonClassName = '',
  label,
  placeholder = 'Select dates',
  inline = false,
  disabled = false,
  align = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // If inline mode is requested, render DateRangeCalendar directly
  if (inline) {
    return (
      <div className={className}>
        {label && (
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {label}
          </label>
        )}
        <DateRangeCalendar
          startDate={startDate}
          endDate={endDate}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          mode={mode}
          showPresets={showPresets}
          highlightedDates={highlightedDates}
          unavailableDates={unavailableDates}
          inline={true}
        />
      </div>
    );
  }

  // Outside click listener to auto-close popover
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const daysCount = getDaysDifference(startDate, endDate);

  // Formatted trigger label
  const displaySummary = startDate
    ? mode === 'single'
      ? formatDisplayDate(startDate, { includeDayOfWeek: true })
      : formatRangeSummary(startDate, endDate)
    : placeholder;

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`Booking Date Selector: currently ${displaySummary}`}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border border-border/80 bg-background hover:bg-muted/30 text-foreground transition-all shadow-xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
          isOpen ? 'ring-2 ring-primary border-primary' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${buttonClassName}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
            <CalendarIcon className="h-4 w-4" />
          </div>
          <div className="text-left truncate">
            <div className="text-xs font-bold text-foreground truncate">{displaySummary}</div>
            {startDate && mode === 'range' && (
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span>{daysCount} {daysCount === 1 ? 'day session' : 'days total'}</span>
                <span>•</span>
                <span className="text-primary font-medium">Click to adjust</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {startDate && mode === 'range' && (
            <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/25">
              <Sparkles className="h-2.5 w-2.5 text-amber-600 dark:text-amber-400" />
              {daysCount}d
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          />
        </div>
      </button>

      {/* Popover Calendar Modal / Dropdown */}
      {isOpen && (
        <>
          {/* Mobile backdrop for small screens */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Select Date Range"
            className={`z-50 ${
              // Mobile: centered bottom sheet / modal
              'fixed sm:absolute inset-x-3 bottom-4 sm:inset-x-auto sm:bottom-auto'
            } sm:top-full sm:mt-2 ${
              align === 'right'
                ? 'sm:right-0'
                : align === 'center'
                ? 'sm:left-1/2 sm:-translate-x-1/2'
                : 'sm:left-0'
            } w-auto max-w-md sm:w-[380px] md:w-[420px] transition-all animate-in fade-in zoom-in-95 duration-150`}
          >
            <DateRangeCalendar
              startDate={startDate}
              endDate={endDate}
              onChange={onChange}
              minDate={minDate}
              maxDate={maxDate}
              mode={mode}
              showPresets={showPresets}
              highlightedDates={highlightedDates}
              unavailableDates={unavailableDates}
              inline={false}
              onCancel={() => setIsOpen(false)}
              onApply={() => setIsOpen(false)}
              className="border-2 border-primary/20 shadow-2xl"
            />
          </div>
        </>
      )}
    </div>
  );
};
