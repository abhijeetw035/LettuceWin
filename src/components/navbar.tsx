"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Add this import
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Mic, FileText, Home, BookOpen } from "lucide-react";

// Updated nav items with more relevant links
const NavItems = [
  { name: "Home", href: "/", icon: <Home size={16} /> },
  {
    name: "Practice",
    href: "/templates",
    icon: <Mic size={16} />,
  },
  {
    name: "Learn",
    href: "#",
    icon: <BookOpen size={16} />,
    dropdown: [
      { name: "Interview Tips", href: "/tips" },
      { name: "Common Questions", href: "/commonQuestions" }
    ]
  }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname(); // Get current path

  // Check if a link is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Check if any dropdown item is active
  const isDropdownActive = (items: { name: string, href: string }[]) => {
    return items.some(item => isActive(item.href));
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3 bg-black/60 backdrop-blur-lg shadow-lg border-b border-white/10" : "py-6 bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="relative z-50">
          <div className="font-bold text-2xl flex items-center">
            <span className="font-display text-white">Mock</span>
            <span className="font-display bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Master</span>


          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {NavItems.map((item) => (
            <div key={item.name} className="relative">
              {item.dropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-colors
                      ${activeDropdown === item.name || isDropdownActive(item.dropdown)
                        ? "bg-white/10 text-white"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {item.icon}
                    {item.name}
                    <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.name ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-1 w-48 bg-slate-900/95 backdrop-blur-lg border border-slate-700/50 rounded-lg shadow-lg overflow-hidden z-50"
                      >
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`block px-4 py-2 hover:bg-white/10 transition-colors
                              ${isActive(subItem.href)
                                ? "text-white bg-white/5 border-l-2 border-cyan-500"
                                : "text-slate-300 hover:text-white"
                              }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`px-4 py-2 flex items-center gap-2 transition-all rounded-lg
                    ${item.highlight
                      ? isActive(item.href)
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium"
                        : "bg-gradient-to-r from-cyan-500/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-600 text-white"
                      : isActive(item.href)
                        ? "bg-white/10 text-white font-medium"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {item.icon}
                  {item.name}
                  {isActive(item.href) && !item.highlight && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-cyan-500 rounded-full"></span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-white/5">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-cyan-500/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-600 text-white border-none font-semibold">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden relative z-50 text-slate-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 z-40 bg-slate-950/98 backdrop-blur-lg md:hidden"
            >
              <div className="flex flex-col h-full pt-20 px-6 pb-6">
                <div className="flex flex-col gap-4">
                  {NavItems.map((item) => (
                    <div key={item.name}>
                      {item.dropdown ? (
                        <div>
                          <button
                            onClick={() => toggleDropdown(item.name)}
                            className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-2 justify-between rounded-lg 
                              ${activeDropdown === item.name || isDropdownActive(item.dropdown)
                                ? "bg-white/5 text-white"
                                : "text-slate-300 hover:text-white hover:bg-white/5"
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              {item.icon}
                              {item.name}
                            </div>
                            <ChevronDown size={16} className={`transition-transform ${activeDropdown === item.name ? "rotate-180" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === item.name && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="ml-4 mt-1 border-l border-slate-700 pl-4"
                              >
                                {item.dropdown.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    className={`block px-4 py-2 transition-colors 
                                      ${isActive(subItem.href)
                                        ? "text-white border-l-2 border-cyan-500 pl-3"
                                        : "text-slate-400 hover:text-white"
                                      }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2 px-4 py-3 transition-colors rounded-lg
                            ${item.highlight
                              ? isActive(item.href)
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                                : "bg-gradient-to-r from-cyan-500/80 to-blue-600/80 text-white"
                              : isActive(item.href)
                                ? "bg-white/5 text-white border-l-2 border-cyan-500 pl-3"
                                : "text-slate-300 hover:text-white hover:bg-white/5"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-auto border-t border-slate-800 pt-6 flex flex-col gap-3">
                  <Button variant="outline" asChild className="w-full border-slate-700 text-slate-300 hover:text-white hover:border-slate-500">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                  </Button>
                  <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-none">
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}