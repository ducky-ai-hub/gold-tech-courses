
import React from 'react';

// SVG Icons as React components for better reusability and control
const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.375 3.375 0 0112 15.125c1.657 0 3.125-.85 3.969-2.088m-1.969-2.088a3.375 3.375 0 01-3.969 0M12 12.125v.007" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A9.006 9.006 0 0112 3c-1.255 0-2.443.322-3.482.875m6.964 1.339a9.006 9.006 0 01-6.964 0M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z" />
  </svg>
);

const CodeBracketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const LifebuoyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 3.75zM12 18.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 18.75zM5.02 6.094a.75.75 0 01.043 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06-.043zM17.906 17.906a.75.75 0 011.06.043l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 01.043-1.06zM20.25 12a.75.75 0 01-.75-.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM3.75 12a.75.75 0 01-.75-.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM6.094 17.906a.75.75 0 01-1.06.043l-1.06-1.06a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 01-.043 1.06zM18.97 5.02a.75.75 0 01-1.06-.043l-1.06-1.06a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 01.043 1.06z" />
  </svg>
);


const features = [
  {
    name: 'Giảng Viên Chuyên Gia',
    description: 'Học hỏi từ các kỹ sư và chuyên gia hàng đầu đang làm việc tại các tập đoàn công nghệ lớn.',
    icon: UserGroupIcon,
  },
  {
    name: 'Dự Án Thực Tế',
    description: 'Xây dựng portfolio ấn tượng qua các dự án thực chiến, mô phỏng theo quy trình làm việc chuyên nghiệp.',
    icon: CodeBracketIcon,
  },
  {
    name: 'Hỗ Trợ Tận Tình',
    description: 'Đội ngũ mentor luôn sẵn sàng giải đáp thắc mắc và hỗ trợ bạn 24/7 trong suốt quá trình học.',
    icon: LifebuoyIcon,
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Tại Sao Chọn TechGold?</h2>
          <p className="mt-4 text-lg text-slate-300">
            Chúng tôi mang đến một môi trường học tập toàn diện để bạn bứt phá.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-8">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center text-center p-8 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-amber-500">
                <feature.icon className="h-6 w-6 text-slate-900" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{feature.name}</h3>
              <p className="mt-2 text-base text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;