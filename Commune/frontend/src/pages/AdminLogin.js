import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, reset } from '../features/auth/authSlice.js';
import styled from 'styled-components';
import { FaLock } from 'react-icons/fa';
import Spinner from '../components/common/Spinner.js';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { username, password } = formData;
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isLoading, isSuccess, isError, errorMessage } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (isSuccess && user && user.isAdmin) {
      navigate('/admin/dashboard');
    }
    
    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, navigate, dispatch]);
  
  const onChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      username,
      password
    };
    
    dispatch(adminLogin(userData));
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <AdminLoginContainer>
      <LoginFormContainer>
        <FormHeader>
          <FormIcon>
            <FaLock />
          </FormIcon>
          <FormTitle>Admin Login</FormTitle>
        </FormHeader>
        
        {isError && <ErrorMessage>{errorMessage}</ErrorMessage>}
        
        <LoginForm onSubmit={onSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Enter your admin username"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isLoading}>
            Login
          </SubmitButton>
          
          <HelpText>
            Use admin credentials provided by the system administrator.
            <br />
            Demo credentials: username: "admin", password: "admin123"
          </HelpText>
        </LoginForm>
      </LoginFormContainer>
    </AdminLoginContainer>
  );
};

const AdminLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
`;

const LoginFormContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const FormIcon = styled.div`
  font-size: 2.5rem;
  color: #3b49df;
  margin-bottom: 1rem;
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3b49df;
  }
`;

const SubmitButton = styled.button`
  background-color: #3b49df;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: #2a3ccd;
  }
  
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fed7d7;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const HelpText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #666;
`;

export default AdminLogin; 