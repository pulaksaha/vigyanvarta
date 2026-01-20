import { Link } from 'react-router-dom';

interface NavigationProps {
  mobile?: boolean;
  onClose?: () => void;
}

const navigationItems = [
  { label: 'Home', path: '/' },
  { label: 'Daily News', path: '/?category=daily-news' },
  { label: 'Article', path: '/?category=article' },
  { label: 'Weekly Newspaper', path: '/?category=weekly-newspaper' },
  { label: 'Others', path: '/?category=others' },
];

const Navigation = ({ mobile, onClose }: NavigationProps) => {
  if (mobile) {
    return (
      <nav className="py-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.label} className="px-4">
              <Link
                to={item.path}
                className="block py-2 font-medium hover:text-primary transition-colors"
                onClick={onClose}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav className="container">
      <ul className="flex items-center justify-center gap-1 py-2">
        {navigationItems.map((item) => (
          <li key={item.label}>
            <Link
              to={item.path}
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-sm transition-colors inline-block"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;