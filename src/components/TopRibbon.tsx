import { Minus, Plus, Sun, Moon, User, Globe, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
];

const TopRibbon = () => {
  const { isDarkMode, toggleDarkMode, fontSize, setFontSize, language, setLanguage } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const decreaseFontSize = () => {
    if (fontSize > 80) setFontSize(fontSize - 10);
  };

  const increaseFontSize = () => {
    if (fontSize < 150) setFontSize(fontSize + 10);
  };

  const resetFontSize = () => setFontSize(100);

  const currentLanguage = languages.find(l => l.code === language) || languages[0];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="bg-muted border-b border-border">
      <div className="container py-1.5 flex items-center justify-between">
        {/* Left: Font size controls */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground hidden sm:inline">Text Size:</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={decreaseFontSize}
              disabled={fontSize <= 80}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={resetFontSize}
            >
              {fontSize}%
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={increaseFontSize}
              disabled={fontSize >= 150}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Right: Language, Dark mode, Login/Signup */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                <Globe className="h-3 w-3" />
                <span className="hidden sm:inline">{currentLanguage.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? 'bg-accent' : ''}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Login/Signup/Dashboard */}
          <div className="flex items-center gap-1 ml-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-3 w-3 mr-1" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleLogout}>
                  <LogOut className="h-3 w-3 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                  <Link to="/login">
                    <User className="h-3 w-3 mr-1" />
                    Login
                  </Link>
                </Button>
                <Button variant="default" size="sm" className="h-7 text-xs">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopRibbon;
