import React from 'react';
import { useRouter } from '../contexts/RouterContext';

const CodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);


const Footer: React.FC = () => {
  const { navigate } = useRouter();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('#/');
  };

  return (
    <footer className="border-t border-slate-800">
      <div className="container mx-auto px-6 py-12">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="#/" onClick={handleLogoClick} className="flex items-center gap-2 text-xl font-bold text-white">
              <CodeIcon className="w-8 h-8 text-amber-400" />
              <span>TechGold</span>
            </a>
            <p className="mt-4 text-slate-400 max-w-xs">Nền tảng học lập trình trực tuyến hàng đầu, giúp bạn chinh phục mọi thử thách công nghệ.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">Khóa học</h2>
              <ul className="text-slate-400">
                <li className="mb-4">
                  <a href="#" className="hover:text-amber-400">Frontend</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:text-amber-400">Backend</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:text-amber-400">DevOps</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">Về TechGold</h2>
              <ul className="text-slate-400">
                <li className="mb-4">
                  <a href="#" className="hover:text-amber-400">Về chúng tôi</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:text-amber-400">Liên hệ</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">Pháp lý</h2>
              <ul className="text-slate-400">
                <li className="mb-4">
                  <a href="#" className="hover:text-amber-400">Chính sách bảo mật</a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-400">Điều khoản & Điều kiện</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-slate-800 sm:mx-auto lg:my-8" />
        <div className="text-center text-sm text-slate-400">
          © {new Date().getFullYear()} TechGold™. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;