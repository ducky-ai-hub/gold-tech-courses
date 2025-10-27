
import React from 'react';

const CodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const Header: React.FC = () => {
  const navLinks = [
    { name: 'Tính Năng', href: '#features' },
    { name: 'Khoá Học', href: '#courses' },
    { name: 'Đánh Giá', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#/" className="flex items-center gap-2 text-xl font-bold text-white">
          <CodeIcon className="w-8 h-8 text-amber-400" />
          <span>TechGold</span>
        </a>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-slate-300 hover:text-amber-400 transition-colors">
              {link.name}
            </a>
          ))}
        </nav>
        <a
          href="#courses"
          className="hidden md:inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
        >
          Đăng Ký Ngay
        </a>
        {/* Mobile menu button could be added here */}
      </div>
    </header>
  );
};

export default Header;