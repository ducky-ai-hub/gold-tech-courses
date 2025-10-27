
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32">
       <div className="absolute inset-0 bg-grid-slate-800/[0.05] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,white)]"></div>
       <div className="absolute inset-0 bg-gray-950 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-300 leading-tight">
          Mở Khóa Tương Lai Công Nghệ Của Bạn
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
          Trang bị cho bản thân những kỹ năng công nghệ hàng đầu với các khóa học thực chiến, được dẫn dắt bởi các chuyên gia đầu ngành.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#courses"
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 px-8 rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
          >
            Khám Phá Các Khóa Học
          </a>
          <a
            href="#"
            className="w-full sm:w-auto bg-transparent border-2 border-slate-700 hover:border-amber-400 hover:text-amber-400 text-slate-300 font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Tư Vấn Lộ Trình
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;