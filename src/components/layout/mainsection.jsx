import React from 'react';
import './mainsection.css';

const HomeHero = () => {
  return (
    <section className="home-hero">
      <div className="hero-content">
        <h1>
          <span className="text-black">AI로 스마트한</span>
          <br />
          <span className="text-blue">금융 투자를 시작하세요</span>
        </h1>
        <p className="hero-description">
          인공지능이 분석한 맞춤형 투자 전략으로
          <br />
          더 현명한 자산 관리를 경험하세요.
        </p>
      </div>
    </section>
  );
};

export default HomeHero;
