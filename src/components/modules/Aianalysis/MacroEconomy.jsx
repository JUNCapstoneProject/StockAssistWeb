import React, { useState } from 'react';
import styled from 'styled-components';

const MacroEconomy = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const macroData = [
    {
      title: '국내총생산',
      value: '24.3조 달러',
      change: '+2.1%',
      tag: 'GDP',
      description: '미국 경제 규모'
    },
    {
      title: '소비자물가지수',
      value: '3.2%',
      change: '-0.1%',
      tag: 'CPI',
      description: '물가상승률'
    },
    {
      title: '1인당 국내총생산 (GCDP)',
      value: '1.8%',
      change: '+0.2%',
      tag: 'GCDP',
      description: '경제 성장률'
    },
    {
      title: '미국 2년 국채 (DGS2)',
      value: '4.29%',
      change: '+0.1%',
      tag: 'DGS2',
      description: '국채 금리'
    },
    {
      title: '미국 10년 국채 (DGS10)',
      value: '3.45%',
      change: '-0.2%',
      tag: 'DGS10',
      description: '국채 금리'
    },
    {
      title: '미국 30년 국채 (DGS30)',
      value: '3.87%',
      change: '+0.1%',
      tag: 'DGS30',
      description: '국채 금리'
    }
  ];

  return (
    <Container>
      <Header onClick={() => setIsExpanded(!isExpanded)}>
        <Title>거시경제지표</Title>
        <ExpandButton>{isExpanded ? '접기 ∧' : '더보기 ∨'}</ExpandButton>
      </Header>
      
      <Content $isExpanded={isExpanded}>
        <Grid>
          {macroData.map((item, index) => (
            <MacroItem key={index}>
              <ItemHeader>
                <ItemTitle>{item.title}</ItemTitle>
                <Tag>{item.tag}</Tag>
              </ItemHeader>
              <Value>{item.value}</Value>
              <Change $isPositive={item.change.includes('+')}>
                {item.change}
              </Change>
              <Description>{item.description}</Description>
            </MacroItem>
          ))}
        </Grid>
      </Content>
    </Container>
  );
};

const Container = styled.div`
   border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  margin: 10px auto;
  min-height: 100px;
  max-width: 900px;
`;
const Header = styled.div`  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
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

const Content = styled.div`
  max-height: ${({ $isExpanded }) => ($isExpanded ? '1000px' : '150px')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
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

const Change = styled.div`
  color: ${({ $isPositive }) => ($isPositive ? '#2ecc71' : '#e74c3c')};
  font-size: 14px;
`;

const Description = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 5px;
`;

export default MacroEconomy;

