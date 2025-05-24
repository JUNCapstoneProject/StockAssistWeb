import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import MyAccount from '../components/modules/Portfolio/MyAccount';
import MyStock from '../components/modules/Portfolio/MyStock';
import link from '../../public/images/unlink.svg';
import axiosInstance from '../api/axiosInstance';

const MyPortfolioLink = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const didFetch = useRef(false); // ✅ StrictMode에서 중복 방지용

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        const fetchPortfolio = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axiosInstance.get('/api/portfolio');
                setData(res.data);
            } catch (err) {
                setError('포트폴리오 정보를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolio();
    }, []); // ✅ 빈 배열로 첫 마운트에만 실행

    return (
        <Container>
            <Header>
                <Title>나의 포트폴리오</Title>
                <UnlinkButton>
                    <UnlinkIcon><img src={link} alt="link" /></UnlinkIcon>
                    증권사 연동 해제
                </UnlinkButton>
            </Header>
            <MyAccount 
                account={data}
                loading={loading}
                error={error}
            />
            <MyStock 
                stocks={data?.stocks || []}
                loading={loading}
                error={error}
            />
        </Container>
    );
};


const Container = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    padding: 24px 16px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: 600;
`;

const UnlinkButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 6px;
    background-color: #3D41FF;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;

    &:hover {
        background-color: #2f32cc;
    }
`;

const UnlinkIcon = styled.span`
    font-size: 16px;
`;

export default MyPortfolioLink;