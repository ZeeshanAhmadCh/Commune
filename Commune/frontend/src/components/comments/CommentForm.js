import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment, updateComment } from '../../features/comments/commentSlice';
import styled from 'styled-components';

const CommentForm = ({ 
  postId, 
  parentComment = null, 
  commentId = null,
  initialValue = '', 
  isEditing = false,
  onSuccess = () => {},
  onCancel = () => {}
}) => {
  const [content, setContent] = useState(initialValue);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (content.trim() === '') {
      setError('Comment cannot be empty');
      return;
    }
    
    if (content.length > 2000) {
      setError('Comment is too long (max 2000 characters)');
      return;
    }
    
    if (isEditing) {

      dispatch(updateComment({ 
        id: commentId,
        content
      }))
        .unwrap()
        .then(() => {
          onSuccess();
        })
        .catch(error => {
          setError(error);
        });
    } else {
      dispatch(addComment({ 
        postId, 
        parentComment, 
        content 
      }))
        .unwrap()
        .then(() => {
          setContent('');
          onSuccess();
        })
        .catch(error => {
          setError(error);
        });
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <TextArea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={isEditing ? 3 : 4}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormGroup>
      
      <FormActions>
        <CancelButton type="button" onClick={onCancel}>
          Cancel
        </CancelButton>
        <SubmitButton type="submit">
          {isEditing ? 'Update Comment' : 'Post Comment'}
        </SubmitButton>
      </FormActions>
    </FormContainer>
  );
};

const FormContainer = styled.form`
  margin-bottom: 1rem;
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b49df;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const SubmitButton = styled(Button)`
  background-color: #3b49df;
  color: white;
  
  &:hover {
    background-color: #2a3ccd;
  }
`;

const CancelButton = styled(Button)`
  background-color: #e2e8f0;
  color: #333;
  
  &:hover {
    background-color: #cbd5e1;
  }
`;

export default CommentForm; 