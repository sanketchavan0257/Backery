import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ShoppingCart, User, Heart, Package, Moon, Sun, LogOut, LayoutDashboard, HelpCircle, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import MobileSidebar from './MobileSidebar';
import { toast } from 'sonner';

// Help / support contact number (WhatsApp + Call)
const HELP_PHONE = '7743819432';

const WhatsAppIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function HelpMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 px-2 sm:px-3 hover:bg-[#D0B8A8]/20"
          data-testid="help-button"
        >
          <HelpCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Help</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-72 p-0 overflow-hidden bg-white dark:bg-[#3C2E26] border-[rgba(44,30,22,0.15)]"
        data-testid="help-menu"
      >
        <div className="px-4 py-3 border-b border-[rgba(44,30,22,0.15)]">
          <p className="font-semibold text-[#2C1E16] dark:text-[#FAFAF7]">Need help?</p>
          <p className="text-xs text-[#5C4A3D] dark:text-[#D0B8A8]">Contact us on WhatsApp or call us</p>
        </div>

        <a
          href={`https://wa.me/91${HELP_PHONE}?text=${encodeURIComponent('Hello, I need help')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 hover:bg-[#D0B8A8]/10 transition-colors border-b border-[#D0B8A8]/20"
          data-testid="help-whatsapp"
        >
          <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
            <WhatsAppIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-[#5C4A3D] dark:text-[#D0B8A8]">WhatsApp</p>
            <p className="text-sm font-semibold text-[#2C1E16] dark:text-[#FAFAF7]">{HELP_PHONE}</p>
          </div>
        </a>

        <a
          href={`tel:+91${HELP_PHONE}`}
          className="flex items-center gap-3 px-4 py-3 hover:bg-[#D0B8A8]/10 transition-colors"
          data-testid="help-call"
        >
          <div className="w-9 h-9 rounded-full bg-[#D0B8A8]/20 flex items-center justify-center shrink-0">
            <Phone className="h-4 w-4 text-[#2C1E16] dark:text-[#FAFAF7]" />
          </div>
          <div>
            <p className="text-xs text-[#5C4A3D] dark:text-[#D0B8A8]">Call Us</p>
            <p className="text-sm font-semibold text-[#2C1E16] dark:text-[#FAFAF7]">{HELP_PHONE}</p>
          </div>
        </a>
      </PopoverContent>
    </Popover>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav
      data-testid="main-navbar"
      className="sticky top-0 z-50 backdrop-blur-xl bg-[#FAFAF7]/80 dark:bg-[#2C1E16]/80 border-b border-[rgba(44,30,22,0.15)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <MobileSidebar />
            <Link
              to="/"
              data-testid="logo-link"
              className="text-2xl font-bold text-[#2C1E16] dark:text-[#FAFAF7]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              GsweetHome
            </Link>
          </div>

          <div className="flex items-center gap-1 md:gap-4">
            <HelpMenu />
            <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="theme-toggle-button"
              className="hover:bg-[#D0B8A8]/20"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <>
                <Link to="/cart" data-testid="cart-link">
                  <Button variant="ghost" size="icon" className="hover:bg-[#D0B8A8]/20">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </Link>

                <Link to="/favorites" data-testid="favorites-link">
                  <Button variant="ghost" size="icon" className="hover:bg-[#D0B8A8]/20">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>

                <Link to="/orders" data-testid="orders-link">
                  <Button variant="ghost" size="icon" className="hover:bg-[#D0B8A8]/20">
                    <Package className="h-5 w-5" />
                  </Button>
                </Link>

                {user.role === 'admin' && (
                  <Link to="/admin" data-testid="admin-link">
                    <Button variant="ghost" size="icon" className="hover:bg-[#D0B8A8]/20">
                      <LayoutDashboard className="h-5 w-5" />
                    </Button>
                  </Link>
                )}

                <Link to="/dashboard" data-testid="dashboard-link">
                  <Button variant="ghost" size="icon" className="hover:bg-[#D0B8A8]/20">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    logout();
                    toast.success('Logout successful!');
                  }}
                  data-testid="logout-button"
                  className="hover:bg-[#E07A5F]/20"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" data-testid="login-link">
                  <Button variant="ghost" className="text-sm uppercase tracking-wide hover:bg-[#D0B8A8]/20">
                    Login
                  </Button>
                </Link>
                <Link to="/register" data-testid="register-link">
                  <Button className="text-sm uppercase tracking-wide bg-[#D0B8A8] hover:bg-[#B89B88] text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
