
import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-6">
        <div className="relative isolate overflow-hidden bg-slate-900 px-6 py-24 text-center shadow-2xl rounded-3xl sm:px-16 border border-slate-800">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Sẵn Sàng Nâng Tầm Sự Nghiệp?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Đừng chần chừ. Hãy tham gia cùng hàng ngàn học viên khác và bắt đầu hành trình chinh phục công nghệ của bạn ngay hôm nay.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#courses"
              className="rounded-md bg-amber-500 px-6 py-3 text-base font-semibold text-slate-900 shadow-sm hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              Bắt Đầu Học Ngay
            </a>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#gold-gradient)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="gold-gradient">
                <stop stopColor="#ca8a04" />
                <stop offset={1} stopColor="#facc15" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default CTASection;