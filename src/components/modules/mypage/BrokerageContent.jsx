import React from 'react';
import styled from 'styled-components';

const Section = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const Value = styled.span`
  color: #333;
  font-size: 0.9rem;
`;

const BrokerageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 3rem;
`;

const BrokerageItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 4px;
`;

const BrokerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BrokerIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #4A55A7;
`;

const UnlinkButton = styled.button`
  padding: 0.25rem 0.75rem;
  background: white;
  color: #666;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #f8f9fa;
  }
`;

const AddBrokerButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: white;
  border: 1px dashed #dee2e6;
  border-radius: 4px;
  color: #4A55A7;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #f8f9fa;
  }
`;

const BrokerageContent = () => {
  return (
    <Section>
      <SectionTitle>증권사 연동 현황</SectionTitle>
      <BrokerageList>
        <BrokerageItem>
          <BrokerInfo>
            <BrokerIcon>미</BrokerIcon>
            <Value>미래에셋증권</Value>
          </BrokerInfo>
          <UnlinkButton>연동 해제</UnlinkButton>
        </BrokerageItem>
        <BrokerageItem>
          <BrokerInfo>
            <BrokerIcon>한</BrokerIcon>
            <Value>한국투자증권</Value>
          </BrokerInfo>
          <UnlinkButton>연동 해제</UnlinkButton>
        </BrokerageItem>
        <BrokerageItem>
          <BrokerInfo>
            <BrokerIcon>삼</BrokerIcon>
            <Value>삼성증권</Value>
          </BrokerInfo>
          <UnlinkButton>연동 해제</UnlinkButton>
        </BrokerageItem>
        <AddBrokerButton>+ 새 증권사 연동하기</AddBrokerButton>
      </BrokerageList>
    </Section>
  );
};

export default BrokerageContent; 