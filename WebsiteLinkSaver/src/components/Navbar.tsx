import { Link, useLocation } from "react-router-dom";
import { Home, Plus, Heart } from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/add", label: "Add Link", icon: Plus },
    { path: "/favorites", label: "Favorites", icon: Heart },
  ].filter((item) => item.path !== "/add" || location.pathname !== "/");

  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#f4f1eb]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo className="h-6 w-6 text-neutral-950" />
            <span className="text-base font-medium text-neutral-950">Link Saver</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1 sm:space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? "bg-black/5 text-neutral-950"
                    : "text-neutral-500 hover:bg-black/5 hover:text-neutral-950"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
