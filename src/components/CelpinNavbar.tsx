import React, { useState } from 'react';
import { Coffee, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const CelpinNavbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'booking', label: 'Book a Seat' },
    { id: 'rewards', label: 'Rewards' }
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur-md border-b border-border/60">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <img
              src="/images/celpin-emblem.png"
              alt="Celpin Coworking Logo"
              className="h-10 w-10 rounded-xl object-cover shadow-sm ring-1 ring-border/50 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-foreground leading-none">Celpin</span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mt-1">Coworking</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              onClick={() => onNavigate('booking')}
              className="hidden sm:inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 gap-1.5 shadow-sm"
            >
              Book Now
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10 md:hidden border border-border/50 text-muted-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentPage === link.id
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  onNavigate('booking');
                  setMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center text-sm font-medium bg-primary text-primary-foreground h-10 rounded-md"
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
