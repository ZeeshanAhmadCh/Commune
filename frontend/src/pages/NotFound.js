import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundIcon>
        <FaExclamationTriangle />
      </NotFoundIcon>
      <NotFoundTitle>404 - Page Not Found</NotFoundTitle>
      <NotFoundText>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </NotFoundText>
      <HomeLink to="/">
        <FaHome /> Go to Homepage
      </HomeLink>
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60vh;
  padding: 2rem;
`;

const NotFoundIcon = styled.div`
  font-size: 4rem;
  color: #e53e3e;
  margin-bottom: 1rem;
`;

const NotFoundTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
`;

const NotFoundText = styled.p`
  color: #666;
  max-width: 500px;
  margin-bottom: 2rem;
`;

const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #3b49df;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #2a3ccd;
  }
`;

export default NotFound; 