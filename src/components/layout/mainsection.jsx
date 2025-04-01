/**
 * 홈페이지의 메인 섹션 컴포넌트
 * 웹사이트의 메인 히어로 섹션을 표시하며, AI 투자 서비스의 주요 가치 제안을 보여줌
 */

import React from 'react';
import './mainsection.css';

const HomeHero = () => {
  return (
    <section className="home-hero">
      <div className="hero-content">
        {/* 메인 타이틀 */}
        <h1>
          <span className="text-black">AI로 스마트한</span>
          <br />
          <span className="text-blue">금융 투자를 시작하세요</span>
        </h1>
        {/* 서비스 설명 */}
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
