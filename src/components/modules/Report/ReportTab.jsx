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
  color: ${({ $active }) => ($active ? '#000' : '#666')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  background: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $active }) => ($active ? '#ffffff' : '#dfe6ee')};
  }
`;

export default ReportTab;
