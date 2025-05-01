import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPost, upvotePost, downvotePost, deletePost, reset } from '../features/posts/postSlice.js';
import { getPostComments, addComment, reset as resetComments } from '../features/comments/commentSlice.js';
import Spinner from '../components/common/Spinner.js';
import styled from 'styled-components';
import { FaArrowUp, FaArrowDown, FaUser, FaTrash, FaEdit, FaReply } from 'react-icons/fa';
import moment from 'moment';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [commentContent, setCommentContent] = useState('');
  
  const { post, isLoading } = useSelector(state => state.posts);
  const { comments, isLoading: commentsLoading } = useSelector(state => state.comments);
  const { user } = useSelector(state => state.auth);
  
  useEffect(() => {
    dispatch(getPost(id));
    dispatch(getPostComments(id));
    
    return () => {
      dispatch(reset());
      dispatch(resetComments());
    };
  }, [dispatch, id]);
  
  const handleUpvote = () => {
    if (!user) return;
    dispatch(upvotePost(id));
  };
  
  const handleDownvote = () => {
    if (!user) return;
    dispatch(downvotePost(id));
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id))
        .unwrap()
        .then(() => {
          navigate('/');
        });
    }
  };
  
  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    if (!commentContent.trim()) return;
    
    dispatch(addComment({
      postId: id,
      content: commentContent.trim()
    }))
      .unwrap()
      .then(() => {
        setCommentContent('');
      });
  };
  
  if (isLoading || !post) {
    return <Spinner />;
  }
  
  
  const userUpvoted = user && post.upvotes.includes(user.id);
  const userDownvoted = user && post.downvotes.includes(user.id);
  
  
  const isAuthor = user && post.author._id === user.id;
  
  return (
    <PostDetailContainer>
      <PostWrapper>
        <VoteSection>
          <VoteButton 
            onClick={handleUpvote} 
            active={userUpvoted}
            disabled={!user}
            title={!user ? "Login to vote" : ""}
          >
            <FaArrowUp />
          </VoteButton>
          <VoteScore>{post.score}</VoteScore>
          <VoteButton 
            onClick={handleDownvote} 
            active={userDownvoted}
            disabled={!user}
            title={!user ? "Login to vote" : ""}
          >
            <FaArrowDown />
          </VoteButton>
        </VoteSection>
        
        <PostContentWrapper>
          <PostHeader>
            <PostTitle>{post.title}</PostTitle>
            
            <PostMeta>
              <PostCategory>{post.category}</PostCategory>
              <span>Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link></span>
              <span>{moment(post.createdAt).fromNow()}</span>
            </PostMeta>
          </PostHeader>
          
          <PostContent>
            {post.content}
          </PostContent>
          
          {isAuthor && (
            <PostActions>
              <ActionButton onClick={() => navigate(`/edit-post/${post._id}`)}>
                <FaEdit /> Edit
              </ActionButton>
              <ActionButton onClick={handleDelete} className="delete">
                <FaTrash /> Delete
              </ActionButton>
            </PostActions>
          )}
        </PostContentWrapper>
      </PostWrapper>
      
      <CommentsSection>
        <CommentsSectionHeader>
          <h2>Comments ({comments?.length || 0})</h2>
        </CommentsSectionHeader>
        
        {user ? (
          <CommentForm onSubmit={handleSubmitComment}>
            <CommentTextarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
              rows={4}
            />
            <CommentSubmitButton type="submit" disabled={!commentContent.trim()}>
              Post Comment
            </CommentSubmitButton>
          </CommentForm>
        ) : (
          <LoginPrompt>
            <Link to="/login">Log in</Link> to leave a comment.
          </LoginPrompt>
        )}
        
        {commentsLoading ? (
          <Spinner />
        ) : (
          <CommentsList>
            {comments && comments.length > 0 ? (
              comments.map(comment => (
                <CommentItem key={comment._id}>
                  <CommentMeta>
                    <CommentAuthor>
                      <FaUser />
                      <Link to={`/profile/${comment.author.username}`}>
                        {comment.author.username}
                      </Link>
                    </CommentAuthor>
                    <CommentDate>{moment(comment.createdAt).fromNow()}</CommentDate>
                  </CommentMeta>
                  <CommentContent>{comment.content}</CommentContent>
                </CommentItem>
              ))
            ) : (
              <NoComments>No comments yet. Be the first to comment!</NoComments>
            )}
          </CommentsList>
        )}
      </CommentsSection>
    </PostDetailContainer>
  );
};

const PostDetailContainer = styled.div`
  padding: 2rem 0;
`;

const PostWrapper = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const VoteSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #f5f5f5;
  padding: 1rem 0.5rem;
  min-width: 50px;
`;

const VoteButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#3b49df' : '#777'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  padding: 0.5rem;
  
  &:hover {
    color: ${props => props.disabled ? '#777' : '#3b49df'};
  }
`;

const VoteScore = styled.div`
  font-weight: 600;
  margin: 0.5rem 0;
`;

const PostContentWrapper = styled.div`
  padding: 1.5rem;
  width: 100%;
`;

const PostHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const PostTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  color: #666;
  
  a {
    color: #3b49df;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PostCategory = styled.span`
  display: inline-block;
  background-color: #e9ecef;
  color: #555;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
`;

const PostContent = styled.div`
  color: #333;
  line-height: 1.6;
  font-size: 1.1rem;
  white-space: pre-line;
`;

const PostActions = styled.div`
  display: flex;
  margin-top: 1.5rem;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f1f1f1;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background-color: #e2e2e2;
  }
  
  &.delete {
    color: #e53e3e;
    
    &:hover {
      background-color: #fff5f5;
    }
  }
`;

const CommentsSection = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const CommentsSectionHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
  }
`;

const CommentForm = styled.form`
  margin-bottom: 2rem;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3b49df;
  }
`;

const CommentSubmitButton = styled.button`
  background-color: #3b49df;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    background-color: #2a3ccd;
  }
`;

const LoginPrompt = styled.div`
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 2rem;
  
  a {
    color: #3b49df;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentItem = styled.div`
  padding: 1rem;
  border: 1px solid #edf2f7;
  border-radius: 4px;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const CommentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #666;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  a {
    color: #3b49df;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const CommentDate = styled.div``;

const CommentContent = styled.div`
  color: #333;
  white-space: pre-line;
`;

const NoComments = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 4px;
`;

export default PostDetail; 