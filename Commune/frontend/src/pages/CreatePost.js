import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../features/posts/postSlice.js';
import Spinner from '../components/common/Spinner.js';
import styled from 'styled-components';
import { FaFeather } from 'react-icons/fa';
import config from '../config.js';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [error, setError] = useState('');
  
  const { title, content, category } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isLoading, isError, errorMessage } = useSelector(state => state.posts);
  
  const categories = config.CATEGORIES;
  
  const validateForm = () => {
    setError('');
    
    if (!title || !content || !category) {
      setError('Please fill in all fields');
      return false;
    }
    
    if (title.length < 5) {
      setError('Title must be at least 5 characters');
      return false;
    }
    
    if (content.length < 10) {
      setError('Content must be at least 10 characters');
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
      dispatch(createPost(formData))
        .unwrap()
        .then((data) => {
          navigate(`/post/${data.data._id}`);
        })
        .catch((error) => {
          setError(error);
        });
    }
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <CreatePostContainer>
      <CreatePostHeader>
        <FaFeather className="icon" />
        <h1>Create Post</h1>
        <p>Share your thoughts with the community</p>
      </CreatePostHeader>
      
      {(isError || error) && (
        <ErrorMessage>
          {errorMessage || error}
        </ErrorMessage>
      )}
      
      <CreatePostForm onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Title</FormLabel>
          <FormInput
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Give your post a title"
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Category</FormLabel>
          <FormSelect
            name="category"
            value={category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Content</FormLabel>
          <FormTextarea
            name="content"
            value={content}
            onChange={handleChange}
            placeholder="Write your post content here..."
            rows={10}
          />
        </FormGroup>
        
        <ButtonGroup>
          <SubmitButton type="submit">
            Create Post
          </SubmitButton>
          <CancelButton type="button" onClick={() => navigate('/')}>
            Cancel
          </CancelButton>
        </ButtonGroup>
      </CreatePostForm>
    </CreatePostContainer>
  );
};

const CreatePostContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const CreatePostHeader = styled.div`
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

const CreatePostForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
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

const FormSelect = styled.select`
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3b49df;
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 150px;
  
  &:focus {
    outline: none;
    border-color: #3b49df;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
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
  
  &:hover {
    background-color: #2a3ccd;
  }
`;

const CancelButton = styled.button`
  background-color: #f1f1f1;
  color: #333;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #e2e2e2;
  }
`;

export default CreatePost; 