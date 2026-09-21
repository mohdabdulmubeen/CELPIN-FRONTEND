import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Building2, Calendar } from 'lucide-react';

export interface LocationSelection {
  country: string;
  state: string;
  city: string;
  date: string;
}

interface LocationSelectorBarProps {
  initialValues?: Partial<LocationSelection>;
  value?: LocationSelection;
  onChange?: (selection: LocationSelection) => void;
  onSelect?: (selection: LocationSelection) => void;
  className?: string;
}

export const LocationSelectorBar: React.FC<LocationSelectorBarProps> = ({
  initialValues,
  value,
  onChange,
  onSelect,
  className = ''
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const currentCountry = value?.country || initialValues?.country || 'India';
  const currentState = value?.state || initialValues?.state || 'Telangana';
  const currentCity = value?.city || initialValues?.city || 'Warangal';
  const currentDate = value?.date || initialValues?.date || todayStr;

  const [country, setCountry] = useState<string>(currentCountry);
  const [state, setState] = useState<string>(currentState);
  const [city, setCity] = useState<string>(currentCity);
  const [date, setDate] = useState<string>(currentDate);

  // States per country
  const stateOptions: Record<string, string[]> = {
    India: ['Telangana', 'Karnataka', 'Maharashtra', 'Delhi NCR'],
    'United States': ['Texas', 'California', 'New York', 'Washington']
  };

  // Cities per state
  const cityOptions: Record<string, string[]> = {
    Telangana: ['Warangal', 'Hanamkonda', 'Kazipet', 'Hyderabad'],
    Karnataka: ['Bengaluru', 'Mysuru'],
    Maharashtra: ['Mumbai', 'Pune'],
    'Delhi NCR': ['New Delhi', 'Gurugram', 'Noida'],
    Texas: ['Austin', 'Dallas', 'Houston'],
    California: ['San Francisco', 'San Jose', 'Los Angeles'],
    'New York': ['New York City', 'Brooklyn'],
    Washington: ['Seattle', 'Bellevue']
  };

  // Keep state synchronized with incoming value prop
  useEffect(() => {
    if (value) {
      if (value.country) setCountry(value.country);
      if (value.state) setState(value.state);
      if (value.city) setCity(value.city);
      if (value.date) setDate(value.date);
    }
  }, [value]);

  const notifyChange = (newCountry: string, newState: string, newCity: string, newDate: string) => {
    const updated = { country: newCountry, state: newState, city: newCity, date: newDate };
    if (onChange) onChange(updated);
    if (onSelect) onSelect(updated);
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const defaultState = stateOptions[newCountry]?.[0] || '';
    setState(defaultState);
    const defaultCity = cityOptions[defaultState]?.[0] || '';
    setCity(defaultCity);
    notifyChange(newCountry, defaultState, defaultCity, date);
  };

  const handleStateChange = (newState: string) => {
    setState(newState);
    const defaultCity = cityOptions[newState]?.[0] || '';
    setCity(defaultCity);
    notifyChange(country, newState, defaultCity, date);
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    notifyChange(country, state, newCity, date);
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    notifyChange(country, state, city, newDate);
  };

  return (
    <div className={`w-full rounded-2xl bg-card border border-border p-4 sm:p-5 shadow-sm transition-all ${className}`}>
      <div className="flex items-center gap-2 mb-3.5">
        <MapPin className="h-4 w-4 text-primary shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
          Select Location &amp; Booking Date
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Country Selector */}
        <div className="flex flex-col gap-1.5 px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border/60 hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
            Country
          </label>
          <select
            value={country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="bg-transparent font-medium text-foreground text-sm focus:outline-none cursor-pointer w-full"
          >
            <option value="India" className="bg-card text-foreground">🇮🇳 India</option>
            <option value="United States" className="bg-card text-foreground">🇺🇸 United States (US)</option>
          </select>
        </div>

        {/* State Selector */}
        <div className="flex flex-col gap-1.5 px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border/60 hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            State
          </label>
          <select
            value={state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="bg-transparent font-medium text-foreground text-sm focus:outline-none cursor-pointer w-full"
          >
            {(stateOptions[country] || ['Telangana']).map((st) => (
              <option key={st} value={st} className="bg-card text-foreground">
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* City Selector */}
        <div className="flex flex-col gap-1.5 px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border/60 hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
            City / Hub
          </label>
          <select
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="bg-transparent font-medium text-foreground text-sm focus:outline-none cursor-pointer w-full"
          >
            {(cityOptions[state] || ['Warangal', 'Hanamkonda', 'Kazipet']).map((ct) => (
              <option key={ct} value={ct} className="bg-card text-foreground">
                {ct}
              </option>
            ))}
          </select>
        </div>

        {/* Booking Date Selector */}
        <div className="flex flex-col gap-1.5 px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border/60 hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            Booking Date
          </label>
          <input
            type="date"
            min={todayStr}
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="bg-transparent font-medium text-foreground text-sm focus:outline-none cursor-pointer w-full"
          />
        </div>
      </div>
    </div>
  );
};
