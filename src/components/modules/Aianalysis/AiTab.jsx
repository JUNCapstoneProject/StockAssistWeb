import React, { useState } from 'react';
import styled from 'styled-components';

const AiTab = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('뉴스');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <TabContainer>
      <TabWrapper>
        <TabItem 
          active={activeTab === '뉴스'} 
          onClick={() => handleTabChange('뉴스')}
        >
          뉴스
        </TabItem>
        <TabItem 
          active={activeTab === '재무제표'} 
          onClick={() => handleTabChange('재무제표')}
        >
          재무제표
        </TabItem>
      </TabWrapper>
    </TabContainer>
  );
};

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const TabWrapper = styled.div`
  display: flex;
  background: #eef2f7;
  border-radius: 8px;
  overflow: hidden;
  width: 800px;
  justify-content: space-between;
`;

const TabItem = styled.div`
  flex: 1;
  min-width: 400px;
  text-align: center;
  padding: 14px 20px;
  cursor: pointer;
  color: ${props => props.active ? '#000' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  background: ${props => props.active ? '#ffffff' : 'transparent'};
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#ffffff' : '#dfe6ee'};
  }
`;

export default AiTab;