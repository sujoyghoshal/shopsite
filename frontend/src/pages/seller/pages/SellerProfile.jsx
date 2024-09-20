import React from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { Paper, Typography, Avatar } from '@mui/material';

// Define keyframe animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// SellerProfile Component
const SellerProfile = () => {
  const { currentUser } = useSelector(state => state.user);

  return (
    <ProfileContainer>
      <ProfileHeader elevation={3}>
        <ProfileAvatar>
          <h1>{currentUser ? currentUser.name[0].toUpperCase() : ''}</h1>
        </ProfileAvatar>
        <ProfileName variant="h4">
          {currentUser ? currentUser.name : ''}
        </ProfileName>
        <ProfileText variant="h6">
          Email: {currentUser ? currentUser.email : ''}
        </ProfileText>
        <ProfileText variant="h6">
          Role: {currentUser ? currentUser.role : ''}
        </ProfileText>
      </ProfileHeader>
    </ProfileContainer>
  );
};

// Phone Shop Component
const PhoneShop = () => {
  return (
    <Container>
      <Header>
        <Title>Phone Shop</Title>
      </Header>
      <Main>
        <Card>
          <CardImage src="https://via.placeholder.com/150" alt="Phone" />
          <CardTitle>Awesome Phone</CardTitle>
          <CardDescription>High-quality phone with amazing features.</CardDescription>
          <CardPrice>$699</CardPrice>
        </Card>
      </Main>
      <Footer>
        <FooterText>&copy; 2024 Phone Shop. All rights reserved.</FooterText>
      </Footer>
    </Container>
  );
};

// Main App Component
const App = () => {
  return (
    <>
      <SellerProfile />
      <PhoneShop />
    </>
  );
};

export default App;

// Styled components

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #e0e0e0;
  min-height: 100vh;
`;

const ProfileHeader = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  animation: ${fadeIn} 1s ease-out;
  max-width: 500px;
  width: 100%;
`;

const ProfileAvatar = styled(Avatar)`
  padding: 20px;
  background-color: #3f51b5;
  color: #ffffff;
  margin-bottom: 10px;
  font-size: 2rem;
`;

const ProfileName = styled(Typography)`
  padding: 10px;
  font-weight: bold;
`;

const ProfileText = styled(Typography)`
  margin-bottom: 10px;
  color: #555;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Header = styled.header`
  background-color: #3f51b5;
  padding: 20px;
  color: #ffffff;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  padding: 20px;
  animation: ${fadeIn} 1s ease-in-out;
`;

const CardImage = styled.img`
  width: 100%;
  border-radius: 10px;
`;

const CardTitle = styled.h2`
  margin: 10px 0;
  font-size: 1.5rem;
`;

const CardDescription = styled.p`
  color: #666;
`;

const CardPrice = styled.p`
  font-size: 1.25rem;
  color: #3f51b5;
`;

const Footer = styled.footer`
  background-color: #3f51b5;
  padding: 10px;
  color: #ffffff;
  text-align: center;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.875rem;
`;
