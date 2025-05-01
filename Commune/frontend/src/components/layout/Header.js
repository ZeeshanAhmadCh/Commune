import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice.js';
import styled from 'styled-components';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaPlus, FaShieldAlt } from 'react-icons/fa';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <HeaderContainer>
      <div className="container">
        <HeaderWrapper>
          <Logo>
            <Link to="/">Commune</Link>
          </Logo>

          <MobileMenuButton onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </MobileMenuButton>

          <NavMenu className={menuOpen ? 'active' : ''}>
            <NavLinks>
              <li>
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              </li>
            </NavLinks>

            <AuthLinks>
              {user ? (
                <>
                  <li>
                    <Link to="/create-post" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                      <FaPlus /> New Post
                    </Link>
                  </li>
                  <li>
                    <Link to={`/profile/${user.username}`} onClick={() => setMenuOpen(false)}>
                      <FaUser /> Profile
                    </Link>
                  </li>
                  {user.isAdmin && (
                    <li>
                      <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>
                        <FaShieldAlt /> Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <Button onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                  </li>
                  <li>
                    <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </AuthLinks>
          </NavMenu>
        </HeaderWrapper>
      </div>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  background-color: #ffffff;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  
  a {
    color: #3b49df;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background-color: #ffffff;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    
    &.active {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
  }
`;

const NavLinks = styled.ul`
  display: flex;
  margin-right: 2rem;
  
  li {
    margin-left: 1.5rem;
    
    a {
      color: #333;
      font-weight: 500;
      transition: color 0.3s ease;
      
      &:hover {
        color: #3b49df;
      }
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    margin-right: 0;
    
    li {
      margin: 0.5rem 0;
      margin-left: 0;
    }
  }
`;

const AuthLinks = styled.ul`
  display: flex;
  align-items: center;
  
  li {
    margin-left: 1rem;
    
    a, button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-top: 1rem;
    
    li {
      margin: 0.5rem 0;
      margin-left: 0;
    }
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #3b49df;
  }
`;

export default Header; 