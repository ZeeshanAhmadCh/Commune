import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/auth/authSlice.js';
import Spinner from '../components/common/Spinner.js';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');
  
  const { username, email, password, confirmPassword } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isLoading, isSuccess, isError, errorMessage } = useSelector(state => state.auth);
  
  useEffect(() => {
    
    if (user) {
      navigate('/');
    }
    
    
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);
  
  useEffect(() => {
    if (isSuccess) {
      navigate('/');
    }
  }, [isSuccess, navigate]);
  
  const validateForm = () => {
    setLocalError('');
    
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    
    if (!username || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return false;
    }
    
    if (!usernameRegex.test(username)) {
      setLocalError('Username must be 3-20 characters and can only contain letters, numbers, and underscores');
      return false;
    }
    
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }
    
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      
      const { confirmPassword, ...registerData } = formData;
      dispatch(register(registerData));
    }
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <FaUserPlus className="icon" />
          <h1>Register</h1>
          <p>Create your Commune account</p>
        </RegisterHeader>
        
        {(isError || localError) && (
          <ErrorMessage>
            {errorMessage || localError}
          </ErrorMessage>
        )}
        
        <RegisterForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>
              <FaUser />
              Username
            </FormLabel>
            <FormInput
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Choose a username"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <FaEnvelope />
              Email Address
            </FormLabel>
            <FormInput
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <FaLock />
              Password
            </FormLabel>
            <FormInput
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <FaLock />
              Confirm Password
            </FormLabel>
            <FormInput
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </FormGroup>
          
          <SubmitButton type="submit">
            Register
          </SubmitButton>
        </RegisterForm>
        
        <LoginPrompt>
          Already have an account? <Link to="/login">Login</Link>
        </LoginPrompt>
      </RegisterCard>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem 0;
`;

const RegisterCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 450px;
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  .icon {
    font-size: 2.5rem;
    color: #3b49df;
    margin-bottom: 1rem;
  }
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  p {
    color: #666;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fff5f5;
  color: #e53e3e;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #e53e3e;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #444;
`;

const FormInput = styled.input`
  padding: 0.8rem 1rem;
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
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background-color: #2a3ccd;
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #666;
  
  a {
    color: #3b49df;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Register; 