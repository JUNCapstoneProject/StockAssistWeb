import React from 'react';
import styled from 'styled-components';
import MyAccount from '../components/modules/Portfolio/MyAccount';
import MyStock from '../components/modules/Portfolio/MyStock';
import link from '../../public/images/unlink.svg';

const MyPortfolioLink = () => {
    return (
        <Container>
            <Header>
                <Title>나의 포트폴리오</Title>
                <UnlinkButton>
                    <UnlinkIcon><img src={link} alt="link" /></UnlinkIcon>
                    증권사 연동 해제
                </UnlinkButton>
            </Header>
            <MyAccount />
            <MyStock />
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