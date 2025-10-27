
import React from 'react';
import type { FAQItem as FAQItemType } from '../types';
import FAQItem from './FAQItem';

const faqs: FAQItemType[] = [
  {
    question: 'Mình chưa có kiến thức về lập trình, có tham gia được không?',
    answer: 'Hoàn toàn được! Chúng tôi có các khóa học được thiết kế riêng cho người mới bắt đầu, đi từ những khái niệm cơ bản nhất với lộ trình bài bản và sự hỗ trợ tận tình từ mentor.',
  },
  {
    question: 'Khóa học có cấp chứng chỉ sau khi hoàn thành không?',
    answer: 'Có. Sau khi hoàn thành tất cả các bài học và dự án cuối khóa, bạn sẽ nhận được chứng chỉ từ TechGold, có giá trị để thêm vào CV và hồ sơ LinkedIn của bạn.',
  },
  {
    question: 'Hình thức học là online hay offline?',
    answer: 'Tất cả các khóa học của TechGold hiện tại đều là hình thức học online 100%. Bạn có thể học mọi lúc, mọi nơi với các video bài giảng đã được quay sẵn và được hỗ trợ trực tuyến qua nền tảng của chúng tôi.',
  },
  {
    question: 'Mình sẽ được hỗ trợ như thế nào trong quá trình học?',
    answer: 'Bạn sẽ được tham gia vào cộng đồng học viên riêng, nơi có các giảng viên và mentor luôn sẵn sàng giải đáp thắc mắc. Ngoài ra, sẽ có các buổi livestream chữa bài và hỏi-đáp hàng tuần.',
  },
];

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-20 sm:py-24 bg-gray-950/70">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Câu Hỏi Thường Gặp</h2>
          <p className="mt-4 text-lg text-slate-300">
            Có thắc mắc? Chúng tôi đã có câu trả lời cho bạn.
          </p>
        </div>
        <div className="mt-16 space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} item={faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;