import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { upvotePost, downvotePost, reportPost } from '../../features/posts/postSlice.js';
import styled from 'styled-components';
import { FaArrowUp, FaArrowDown, FaComment, FaFlag } from 'react-icons/fa';
import moment from 'moment';
import ReportModal from '../common/ReportModal.js';

const PostItem = ({ post }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleUpvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    dispatch(upvotePost(post._id));
  };

  const handleDownvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    dispatch(downvotePost(post._id));
  };

  const handleReport = (reason) => {
    dispatch(reportPost({ postId: post._id, reason }));
    setShowReportModal(false);
  };
  
  const userUpvoted = user && Array.isArray(post.upvotes) && post.upvotes.includes(user.id);
  const userDownvoted = user && Array.isArray(post.downvotes) && post.downvotes.includes(user.id);
  
  const commentCount = post.comments ? post.comments.length : 0;

  return (
    <>
      <PostItemContainer>
        <VoteSection>
          <VoteButton 
            onClick={handleUpvote} 
            active={userUpvoted}
            disabled={!user}
          >
            <FaArrowUp />
          </VoteButton>
          <VoteScore>{post.score}</VoteScore>
          <VoteButton 
            onClick={handleDownvote} 
            active={userDownvoted}
            disabled={!user}
          >
            <FaArrowDown />
          </VoteButton>
        </VoteSection>
        
        <PostContent>
          <Link to={`/post/${post._id}`}>
            <PostTitle>{post.title}</PostTitle>
          </Link>
          
          <PostCategory>
            {post.category}
          </PostCategory>
          
          <PostMeta>
            <span>Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link></span>
            <span>{moment(post.createdAt).fromNow()}</span>
            <span>
              <FaComment /> {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
            </span>
          </PostMeta>
          
          <PostExcerpt>
            {post.content.length > 200 
              ? `${post.content.substring(0, 200)}...` 
              : post.content}
          </PostExcerpt>
          
          <PostActions>
            <Link to={`/post/${post._id}`} className="btn btn-secondary">
              Read More
            </Link>
            {user && (
              <ReportButton onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowReportModal(true);
              }}>
                <FaFlag /> Report
              </ReportButton>
            )}
          </PostActions>
        </PostContent>
      </PostItemContainer>
      
      {showReportModal && (
        <ReportModal 
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReport}
          contentType="post"
        />
      )}
    </>
  );
};

const PostItemContainer = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
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

const PostContent = styled.div`
  padding: 1.5rem;
  width: 100%;
`;

const PostTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
  
  &:hover {
    color: #3b49df;
  }
`;

const PostCategory = styled.div`
  display: inline-block;
  background-color: #e9ecef;
  color: #555;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.8rem;
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;
  
  a {
    color: #3b49df;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PostExcerpt = styled.p`
  color: #555;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const PostActions = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const ReportButton = styled.button`
  background: none;
  border: none;
  color: #777;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    color: #e53e3e;
  }
`;

export default PostItem; 