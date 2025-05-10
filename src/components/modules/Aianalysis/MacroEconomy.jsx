import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const MacroEconomy = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [macroValues, setMacroValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const baseURL = import.meta.env.VITE_API_BASE_URL;


  const baseData = [
    { title: '국내총생산', tag: 'GDP', description: '미국 경제 규모' },
    { title: '소비자물가지수', tag: 'CPI', description: '물가상승률' },
    { title: '실업률', tag: 'UNRATE', description: '노동시장 지표' },
    { title: '연방기금금리', tag: 'FEDFUNDS', description: '미국 기준금리' },
    { title: '미국 2년 국채', tag: 'DGS2', description: '단기 금리 지표' },
    { title: '1인당 국내총생산', tag: 'GDPC', description: '개인 경제력 지표' },
    { title: '무역수지', tag: 'TRADE_BALANCE', description: '수출입 균형 지표' },
    { title: '생산자물가지수', tag: 'PPI', description: '생산단계 물가지표' },
    { title: '자동차 PPI', tag: 'PPI_VEHICLE', description: '자동차 생산 물가' },
    { title: '전기 PPI', tag: 'PPI_ELECTRIC', description: '전기 생산 물가' },
    { title: '구매관리자지수', tag: 'PMI', description: '제조업 경기 지표' },
    { title: '개인소비지출', tag: 'PCE', description: '소비 동향 지표' },
    { title: '소비자신뢰지수', tag: 'CCI', description: '소비자 심리 지표' }
  ];

  useEffect(() => {
    const fetchMacroData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${baseURL}/api/economy/indicators`);
        const result = await response.json();
        if (result.success) {
          setMacroValues(result.response);
        }
      } catch (error) {
        console.error('거시경제 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMacroData();
  }, [baseURL]);

  const getUnit = (tag) => {
    switch (tag) {
      case 'GDP': return '조 달러';
      case 'GDPC': return ' 달러';
      case 'TRADE_BALANCE': return 'B 달러';
      case 'CPI':
      case 'UNRATE':
      case 'FEDFUNDS':
      case 'DGS2':
      case 'PPI':
      case 'PPI_VEHICLE':
      case 'PPI_ELECTRIC':
      case 'PCE':
        return '%';
      default:
        return '';
    }
  };

  const getChangeUnit = (tag) => {
    const unitlessTags = ['PMI', 'CCI'];
    return unitlessTags.includes(tag) ? '' : '%';
  };

  return (
    <OuterContainer>
      <InnerContainer>
        <Header onClick={() => setIsExpanded(!isExpanded)}>
          <Title>거시경제지표</Title>
          <ExpandButton>{isExpanded ? '접기 ∧' : '더보기 ∨'}</ExpandButton>
        </Header>

        <Content $expanded={isExpanded}>
          <Grid>
            {isLoading ? (
              <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
            ) : (
              baseData.map((item, index) => {
                const macro = macroValues[item.tag];
                return (
                  <MacroItem key={index}>
                    <ItemHeader>
                      <ItemTitle>{item.title}</ItemTitle>
                      <Tag>{item.tag}</Tag>
                    </ItemHeader>
                    <Value>
                      {macro?.value !== undefined
                        ? `${macro.value.toLocaleString()}${getUnit(item.tag)}`
                        : '-'}
                    </Value>
                    <Change $positive={macro?.change > 0}>
                      {macro?.change !== undefined
                        ? `${macro.change > 0 ? '+' : ''}${macro.change}${getChangeUnit(item.tag)}`
                        : '-'}
                    </Change>
                    <Description>{item.description}</Description>
                  </MacroItem>
                );
              })
            )}
          </Grid>
        </Content>
      </InnerContainer>
    </OuterContainer>
  );
};

export default MacroEconomy;

// ✅ 스타일 컴포넌트
const OuterContainer = styled.div`
  width: 100%;
  padding: 0 20px; /* 뷰포트 기준 좌우 여백 고정 */
  box-sizing: border-box;
`;

const InnerContainer = styled.div`
  max-width: 960px;
  margin: 10px auto;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 16px;
  margin: 0;
`;

const ExpandButton = styled.span`
  color: #666;
  font-size: 14px;
`;

const Content = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$expanded',
})`
  max-height: ${({ $expanded }) => ($expanded ? '1000px' : '150px')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;

  @media (max-width: 768px) {
    max-height: ${({ $expanded }) => ($expanded ? '600px' : '120px')};
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  @media (max-width: 480px) {
    max-height: ${({ $expanded }) => ($expanded ? '400px' : '100px')};
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const MacroItem = styled.div`
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ItemTitle = styled.span`
  font-size: 14px;
  color: #666;
`;

const Tag = styled.span`
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #888;
`;

const Value = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Change = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$positive',
})`
  color: ${({ $positive }) => ($positive ? '#2ecc71' : '#e74c3c')};
  font-size: 14px;
`;

const Description = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 5px;
`;

const LoadingMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
  color: #666;
`;
