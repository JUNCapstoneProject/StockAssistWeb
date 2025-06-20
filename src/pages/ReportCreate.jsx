/**
 * 리포트 작성 페이지 컴포넌트
 * 사용자가 새로운 투자 리포트를 작성할 수 있는 페이지
 * 제목, 내용, 작성자 정보를 입력받아 저장
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IoChevronBack } from 'react-icons/io5';
import axiosInstance from '../api/axiosInstance';
import Select from 'react-select';

const ReportCreate = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = [
    { value: '', label: '카테고리 선택' },
    { value: '기업분석', label: '기업 분석' },
    { value: '산업섹터', label: '산업/섹터' },
    { value: '시장전망', label: '시장 전망' },
    { value: '이슈테마', label: '이슈 테마' },
  ];

  const handleSubmit = async () => {
    // 입력값 검증
    if (!title.trim() || !content.trim() || !category) {
      alert('제목, 내용, 카테고리를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post('/api/reports', {
        title: title.trim(),
        content: content.trim(),
        category
      });

      if (response.data.success) {
        alert('리포트가 저장되었습니다!');
        navigate('/report?type=사용자 리포트&page=1');
      } else {
        throw new Error(response.data.error || '리포트 저장에 실패했습니다.');
      }
    } catch (error) {
      let errorMessage = '리포트 저장에 실패했습니다.';
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = '필수 입력값이 누락되었습니다.';
            break;
          case 401:
            errorMessage = '로그인이 필요합니다.';
            navigate('/login');
            break;
          case 403:
            errorMessage = '접근 권한이 없습니다.';
            break;
          case 415:
            errorMessage = '지원하지 않는 형식입니다.';
            break;
          case 429:
            errorMessage = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
            break;
          case 503:
            errorMessage = '서비스가 일시적으로 불가능합니다. 잠시 후 다시 시도해주세요.';
            break;
          default:
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/report')}>
          <IoChevronBack />
          리포트 목록 보기
        </BackButton>
      </Header>

      <ContentWrapper>
        <TopSection>
          <DateText>{new Date().toISOString().slice(0, 10)}</DateText>
          <Select
            options={categoryOptions}
            value={categoryOptions.find(opt => opt.value === category)}
            onChange={opt => setCategory(opt.value)}
            styles={{
              container: (base) => ({ ...base, width: 240 }),
              menu: (base) => ({ ...base, width: 240 }),
            }}
          />
        </TopSection>
        
        <TitleInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="리포트 제목을 입력하세요"
        />

        <ContentInput
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="리포트 내용을 입력하세요"
        />
      </ContentWrapper>

      <ButtonWrapper>
        <ButtonGroup>
          <CancelButton onClick={() => navigate('/report')} disabled={isSubmitting}>
            취소
          </CancelButton>
          <SaveButton onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '리포트 저장'}
          </SaveButton>
        </ButtonGroup>
      </ButtonWrapper>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 32px;
`;

const ContentWrapper = styled.div`
  padding: 0 32px;
  position: relative;
`;

const ButtonWrapper = styled.div`
  padding: 0 0px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    color: #333;
  }
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  margin-right: -65px;
  padding-right: 32px;
`;

const DateText = styled.div`
  color: #666;
  font-size: 14px;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 24px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 24px;
  outline: none;

  &::placeholder {
    color: #999;
  }

  &:focus {
    border-color: #4B50E6;
  }
`;

const ContentInput = styled.textarea`
  width: 100%;
  height: 400px;
  padding: 16px;
  font-size: 16px;
  line-height: 1.6;
  border: 1px solid #eee;
  border-radius: 8px;
  resize: none;
  outline: none;
  margin-bottom: 24px;

  &::placeholder {
    color: #999;
  }

  &:focus {
    border-color: #4B50E6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  min-width: 100px;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: #666;
  border: 1px solid #e0e0e0;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const SaveButton = styled(Button)`
  background-color: #4B50E6;
  color: white;
  border: none;

  &:hover {
    background-color: #3A3FB9;
  }
`;

export default ReportCreate;

