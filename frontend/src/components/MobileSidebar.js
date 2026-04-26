import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  CreditCard,
  Settings,
  Home,
  Heart,
  ShoppingCart,
  LogOut,
  Moon,
  Sun,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Headphones,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleContact = () => setIsContactOpen(!isContactOpen);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/cakes', icon: ShoppingBag, label: 'Cakes' },
    { to: '/admin/orders', icon: Package, label: 'Orders' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/orders', icon: CreditCard, label: 'Payments' },
    { to: '/dashboard', icon: Settings, label: 'Settings' },
  ];

  const userLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/cart', icon: ShoppingCart, label: 'Cart' },
    { to: '/favorites', icon: Heart, label: 'Favorites' },
    { to: '/orders', icon: Package, label: 'Orders' },
    { to: '/dashboard', icon: Settings, label: 'Dashboard' },
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Hamburger Button - Mobile Only */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="md:hidden hover:bg-[#D0B8A8]/20"
        data-testid="hamburger-menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 h-[100dvh] bg-black/50 z-40 md:hidden touch-none"
            onClick={toggleSidebar}
            data-testid="sidebar-backdrop"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-[100dvh] w-80 bg-white dark:bg-[#3C2E26] shadow-2xl z-50 md:hidden flex flex-col overflow-hidden"
            data-testid="mobile-sidebar"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-[rgba(44,30,22,0.15)] shrink-0">
              <Link
                to="/"
                className="text-2xl font-bold text-[#2C1E16] dark:text-[#FAFAF7]"
                style={{ fontFamily: "'Playfair Display', serif" }}
                onClick={toggleSidebar}
              >
                GsweetHome
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hover:bg-[#D0B8A8]/20"
                data-testid="close-sidebar"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-6 border-b border-[rgba(44,30,22,0.15)] shrink-0">
                <p className="text-sm text-[#5C4A3D] dark:text-[#D0B8A8]">Logged in as</p>
                <p className="font-semibold text-[#2C1E16] dark:text-[#FAFAF7]">{user.name}</p>
                <p className="text-xs text-[#5C4A3D] dark:text-[#D0B8A8]">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="inline-block mt-2 px-3 py-1 bg-[#D0B8A8]/20 text-[#D0B8A8] text-xs rounded-full uppercase tracking-wide">
                    Admin
                  </span>
                )}
              </div>
            )}

            {/* Navigation Links - No Scroll */}
            <nav className="p-4 flex-1 overflow-hidden">
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={toggleSidebar}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive(link.to)
                          ? 'bg-[#D0B8A8] text-white'
                          : 'text-[#2C1E16] dark:text-[#FAFAF7] hover:bg-[#D0B8A8]/10'
                      }`}
                      data-testid={`sidebar-link-${link.label.toLowerCase()}`}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </li>
                ))}

                {/* Contact Us Dropdown */}
                <li>
                  <button
                    onClick={toggleContact}
                    className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-colors text-[#2C1E16] dark:text-[#FAFAF7] hover:bg-[#D0B8A8]/10"
                  >
                    <div className="flex items-center gap-3">
                      <Headphones className="h-5 w-5" />
                      <span className="font-medium">Contact Us</span>
                    </div>
                    {isContactOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#D0B8A8]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#D0B8A8]" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isContactOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mx-4 mt-1 mb-2 rounded-xl bg-[#F9F4F0] dark:bg-[#2C1E16] border border-[#D0B8A8]/30 overflow-hidden">
                          <a
                            href="tel:8482880257"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-[#D0B8A8]/10 transition-colors border-b border-[#D0B8A8]/20"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#D0B8A8]/20 flex items-center justify-center shrink-0">
                              <Phone className="h-4 w-4 text-[#D0B8A8]" />
                            </div>
                            <div>
                              <p className="text-xs text-[#5C4A3D] dark:text-[#D0B8A8]">Call Us</p>
                              <p className="text-sm font-semibold text-[#2C1E16] dark:text-[#FAFAF7]">8482880257</p>
                            </div>
                          </a>
                          <a
                            href="mailto:sanketchavan0257@gmail.com"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-[#D0B8A8]/10 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#D0B8A8]/20 flex items-center justify-center shrink-0">
                              <Mail className="h-4 w-4 text-[#D0B8A8]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-[#5C4A3D] dark:text-[#D0B8A8]">Email Us</p>
                              <p className="text-sm font-semibold text-[#2C1E16] dark:text-[#FAFAF7] truncate">sanketchavan0257@gmail.com</p>
                            </div>
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              </ul>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-[rgba(44,30,22,0.15)] bg-white dark:bg-[#3C2E26] shrink-0">
              <div className="flex gap-2 mb-3">
                <Button
                  variant="outline"
                  className="flex-1 border-[rgba(44,30,22,0.15)]"
                  onClick={() => {
                    toggleTheme();
                    toggleSidebar();
                  }}
                  data-testid="theme-toggle-sidebar"
                >
                  {isDark ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </>
                  )}
                </Button>
              </div>

              {user ? (
                <Button
                  variant="outline"
                  className="w-full border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F]/10"
                  onClick={() => {
                    logout();
                    toggleSidebar();
                  }}
                  data-testid="logout-sidebar"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1" onClick={toggleSidebar}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" className="flex-1" onClick={toggleSidebar}>
                    <Button className="w-full bg-[#D0B8A8] hover:bg-[#B89B88]">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
