import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navigation from './Navigation';
import TopRibbon from './TopRibbon';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      {/* Top ribbon with font size, language, dark mode, login */}
      <TopRibbon />

      {/* Date bar */}
      <div className="border-b border-border">
        <div className="container py-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>{currentDate}</span>
          <span className="hidden sm:block">Today's Paper</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Scientific Times
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Science & Technology News Portal
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            {isSearchOpen && (
              <Input
                type="search"
                placeholder="Search articles..."
                className="w-48 md:w-64 animate-in slide-in-from-right"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block border-t border-border">
        <Navigation />
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <Navigation mobile onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;