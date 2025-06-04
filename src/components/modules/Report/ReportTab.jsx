import styled from 'styled-components';

const ReportTab = ({ onTabChange, currentTab }) => {
  return (
    <TabContainer>
      <TabWrapper>
        <TabItem 
          $active={currentTab === '전문가 리포트'} 
          onClick={() => onTabChange('전문가 리포트')}
        >
          전문가 리포트 
        </TabItem>
        <TabItem 
          $active={currentTab === '사용자 리포트'} 
          onClick={() => onTabChange('사용자 리포트')}
        >
          사용자 리포트
        </TabItem>
      </TabWrapper>
    </TabContainer>
  );
};

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 20px;
`;

const TabWrapper = styled.div`
  display: flex;
  background: #eef2f7;
  border-radius: 8px;
  overflow: hidden;
  width: 800px;
  justify-content: space-between;

  @media (max-width: 840px) {
    width: 100%;
    max-width: 800px;
  }
`;

const TabItem = styled.div`
  flex: 1;
  min-width: 400px;
  text-align: center;
  padding: 14px 20px;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#000' : '#666')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  background: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  border-radius: 8px;
  transition: all 0.3s ease;

  @media (max-width: 840px) {
    min-width: auto;
    padding: 14px 10px;
  }

  &:hover {
    background: ${({ $active }) => ($active ? '#ffffff' : '#dfe6ee')};
  }
`;

export default ReportTab;
