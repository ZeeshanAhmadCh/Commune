import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterContainer>
      <div className="container">
        <FooterWrapper>
          <FooterLogo>
            <Link to="/">Commune</Link>
          </FooterLogo>
          
          <FooterContent>
            <FooterSection>
              <h3>Categories</h3>
              <ul>
                <li><Link to="/?category=General">General</Link></li>
                <li><Link to="/?category=Technology">Technology</Link></li>
                <li><Link to="/?category=Science">Science</Link></li>
                <li><Link to="/?category=Entertainment">Entertainment</Link></li>
                <li><Link to="/?category=Sports">Sports</Link></li>
              </ul>
            </FooterSection>
            
            <FooterSection>
              <h3>Community</h3>
              <ul>
                <li><Link to="/create-post">Create Post</Link></li>
                <li><Link to="/">Guidelines</Link></li>
                <li><Link to="/">FAQ</Link></li>
              </ul>
            </FooterSection>
            
            <FooterSection>
              <h3>Legal</h3>
              <ul>
                <li><Link to="/">Privacy Policy</Link></li>
                <li><Link to="/">Terms of Service</Link></li>
                <li><Link to="/">Code of Conduct</Link></li>
              </ul>
            </FooterSection>
          </FooterContent>
        </FooterWrapper>
        
        <FooterBottom>
          <p>&copy; {new Date().getFullYear()} Commune. All rights reserved.</p>
        </FooterBottom>
      </div>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 3rem 0 1rem;
  margin-top: 3rem;
`;

const FooterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FooterLogo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  
  a {
    color: #ffffff;
  }
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const FooterSection = styled.div`
  min-width: 120px;
  
  h3 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #ffffff;
  }
  
  ul {
    list-style: none;
    
    li {
      margin-bottom: 0.5rem;
      
      a {
        color: #b3b3b3;
        transition: color 0.3s ease;
        
        &:hover {
          color: #ffffff;
        }
      }
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid #333;
  color: #b3b3b3;
  font-size: 0.9rem;
`;

export default Footer; 