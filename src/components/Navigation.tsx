import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { categories } from '@/data/mockArticles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  mobile?: boolean;
  onClose?: () => void;
}

const navigationItems = [
  {
    label: 'Science',
    subcategories: ['Biology', 'Chemistry', 'Physics', 'Environment', 'Health'],
  },
  {
    label: 'Technology',
    subcategories: ['AI & ML', 'Software', 'Hardware', 'Cybersecurity', 'Web'],
  },
  {
    label: 'Innovation',
    subcategories: ['Startups', 'Patents', 'Breakthroughs', 'Future Tech'],
  },
  {
    label: 'Research',
    subcategories: ['Academic', 'Industry', 'Grants', 'Publications'],
  },
  {
    label: 'Gadgets',
    subcategories: ['Smartphones', 'Wearables', 'Smart Home', 'Reviews'],
  },
  {
    label: 'Space',
    subcategories: ['NASA', 'SpaceX', 'Astronomy', 'Exploration'],
  },
];

const Navigation = ({ mobile, onClose }: NavigationProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  if (mobile) {
    return (
      <nav className="py-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.label} className="px-4">
              <button
                className="w-full flex items-center justify-between py-2 text-left font-medium hover:text-muted-foreground transition-colors"
                onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
              >
                {item.label}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openDropdown === item.label ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === item.label && (
                <ul className="pl-4 py-2 space-y-2 border-l border-border ml-2">
                  {item.subcategories.map((sub) => (
                    <li key={sub}>
                      <a
                        href="#"
                        className="block py-1 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={onClose}
                      >
                        {sub}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className="px-4 pt-4 border-t border-border mt-4">
            <a href="#" className="block py-2 font-medium" onClick={onClose}>
              About
            </a>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav className="container">
      <ul className="flex items-center justify-center gap-1 py-2">
        {navigationItems.map((item) => (
          <li key={item.label}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium hover:bg-accent rounded-sm transition-colors">
                  {item.label}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-popover z-50">
                {item.subcategories.map((sub) => (
                  <DropdownMenuItem key={sub} className="cursor-pointer">
                    {sub}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
        <li>
          <a
            href="#"
            className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-sm transition-colors inline-block"
          >
            About
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;