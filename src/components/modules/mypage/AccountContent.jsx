import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import BrokerageContent from './BrokerageContent';
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

const UserInfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const Value = styled.span`
  color: #333;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #4A55A7;
  }
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background: #4A55A7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  align-self: flex-end;
  margin-top: 1rem;

  &:hover {
    background: #3c4688;
  }
`;

const EditableValue = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const AccountManagement = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const DeleteAccountButton = styled.button`
  padding: 0.75rem 0.75rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  width: fit-content;

  &:hover {
    background: #d32f2f;
  }
`;

const AccountContent = () => {
  const [userInfo, setUserInfo] = useState({ nickname: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editedNickname, setEditedNickname] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axiosInstance.get("/api/users/me");
        const { success, response } = res.data;
        if (success && response?.user) {
          setUserInfo(response.user);
          setEditedNickname(response.user.nickname);
        }
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleEdit = async () => {
    if (isEditing) {
      try {
        const res = await axiosInstance.put("/api/users/me", { nickname: editedNickname });
        const { success } = res.data;
        if (success) {
          setUserInfo((prev) => ({ ...prev, nickname: editedNickname }));
          setIsEditing(false);
        }
      } catch (err) {
        console.error("닉네임 수정 실패:", err);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <>
      <Section>
        <SectionTitle>기본 정보</SectionTitle>
        <UserInfoGrid>
          <InfoItem>
            <Label>닉네임</Label>
            {isEditing ? (
              <EditableValue>
                <Input
                  type="text"
                  value={editedNickname}
                  onChange={(e) => setEditedNickname(e.target.value)}
                />
              </EditableValue>
            ) : (
              <Value>{userInfo.nickname}</Value>
            )}
          </InfoItem>
          <InfoItem>
            <Label>이메일</Label>
            <Value>{userInfo.email}</Value>
          </InfoItem>
        </UserInfoGrid>
        <EditButton onClick={handleEdit}>
          {isEditing ? '저장' : '정보 수정'}
        </EditButton>
      </Section>

      <BrokerageContent />

      <Section>
        <SectionTitle>계정 관리</SectionTitle>
        <AccountManagement>
          회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
          <DeleteAccountButton>회원 탈퇴</DeleteAccountButton>
        </AccountManagement>
      </Section>
    </>
  );
};

export default AccountContent;
