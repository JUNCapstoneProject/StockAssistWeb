import React, { useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../../api/axiosInstance';

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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  color: #333;
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

const ChangePasswordButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #4A55A7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  width: fit-content;

  &:hover {
    background: #3c4688;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.85rem;
  margin-top: 1rem;
`;

const SuccessMessage = styled.div`
  color: green;
  font-size: 0.85rem;
  margin-top: 1rem;
`;

const SecurityContent = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axiosInstance.put('/api/users/me/password', {
        oldPassword,
        newPassword,
      });

      if (response.data.success) {
        setSuccess('비밀번호가 성공적으로 변경되었습니다.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <Section>
      <SectionTitle>비밀번호 변경</SectionTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>현재 비밀번호</FormLabel>
          <Input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>새 비밀번호</FormLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>새 비밀번호 확인</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormGroup>
        <ChangePasswordButton type="submit">비밀번호 변경</ChangePasswordButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </form>
    </Section>
  );
};

export default SecurityContent;
