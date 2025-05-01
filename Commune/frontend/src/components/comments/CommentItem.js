import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { upvoteComment, downvoteComment, deleteComment, reportComment } from '../../features/comments/commentSlice';
import CommentForm from './CommentForm';
import styled from 'styled-components';
import { FaArrowUp, FaArrowDown, FaReply, FaEdit, FaTrash, FaFlag } from 'react-icons/fa';
import moment from 'moment';
import ReportModal from '../common/ReportModal.js';

const CommentItem = ({ comment, postId, parentId = null }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleUpvote = () => {
    if (!user) return;
    dispatch(upvoteComment(comment._id));
  };

  const handleDownvote = () => {
    if (!user) return;
    dispatch(downvoteComment(comment._id));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment(comment._id));
    }
  };

  const handleReport = (reason) => {
    dispatch(reportComment({ commentId: comment._id, reason }));
    setShowReportModal(false);
  };
  
  const userUpvoted = user && comment.upvotes && comment.upvotes.includes(user.id);
  const userDownvoted = user && comment.downvotes && comment.downvotes.includes(user.id);

  
  const isAuthor = user && comment.author._id === user.id;
  const isAdmin = user && user.isAdmin;
  const canModify = isAuthor || isAdmin;

  return (
    <>
      <CommentContainer>
        <VoteSection>
          <VoteButton 
            onClick={handleUpvote} 
            active={userUpvoted}
            disabled={!user}
          >
            <FaArrowUp />
          </VoteButton>
          <VoteScore>{comment.score}</VoteScore>
          <VoteButton 
            onClick={handleDownvote} 
            active={userDownvoted}
            disabled={!user}
          >
            <FaArrowDown />
          </VoteButton>
        </VoteSection>
        
        <CommentContent>
          <CommentMeta>
            <Author to={`/profile/${comment.author.username}`}>
              {comment.author.username}
            </Author>
            <Timestamp>{moment(comment.createdAt).fromNow()}</Timestamp>
            
            <CommentActions>
              {canModify && (
                <>
                  {isAuthor && (
                    <ActionButton onClick={() => setShowEditForm(!showEditForm)}>
                      <FaEdit /> Edit
                    </ActionButton>
                  )}
                  
                  <ActionButton onClick={handleDelete}>
                    <FaTrash /> Delete
                  </ActionButton>
                </>
              )}
              
              {user && !isAuthor && (
                <ActionButton onClick={() => setShowReportModal(true)}>
                  <FaFlag /> Report
                </ActionButton>
              )}
            </CommentActions>
          </CommentMeta>
          
          {showEditForm ? (
            <CommentForm 
              postId={postId}
              commentId={comment._id}
              initialValue={comment.content}
              isEditing={true}
              onCancel={() => setShowEditForm(false)}
            />
          ) : (
            <CommentText>{comment.content}</CommentText>
          )}
          
          <CommentFooter>
            {user && !showReplyForm && (
              <ReplyButton onClick={() => setShowReplyForm(true)}>
                <FaReply /> Reply
              </ReplyButton>
            )}
          </CommentFooter>
          
          {showReplyForm && (
            <ReplyFormWrapper>
              <CommentForm 
                postId={postId}
                parentComment={comment._id}
                onSuccess={() => setShowReplyForm(false)}
                onCancel={() => setShowReplyForm(false)}
              />
            </ReplyFormWrapper>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <RepliesContainer>
              {comment.replies.map(reply => (
                <CommentItem 
                  key={reply._id} 
                  comment={reply} 
                  postId={postId}
                  parentId={comment._id}
                />
              ))}
            </RepliesContainer>
          )}
        </CommentContent>
      </CommentContainer>
      
      {showReportModal && (
        <ReportModal 
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReport}
          contentType="comment"
        />
      )}
    </>
  );
};

const CommentContainer = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
`;

const VoteSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1rem;
`;

const VoteButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#3b49df' : '#777'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  padding: 0.3rem;
  
  &:hover {
    color: ${props => props.disabled ? '#777' : '#3b49df'};
  }
`;

const VoteScore = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0.2rem 0;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`;

const Author = styled(Link)`
  font-weight: 600;
  color: #333;
  margin-right: 0.5rem;
  
  &:hover {
    color: #3b49df;
  }
`;

const Timestamp = styled.span`
  font-size: 0.8rem;
  color: #777;
`;

const CommentActions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #777;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    color: #3b49df;
  }
`;

const CommentText = styled.p`
  color: #333;
  line-height: 1.5;
  margin-bottom: 0.5rem;
  white-space: pre-wrap;
`;

const CommentFooter = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  color: #777;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    color: #3b49df;
  }
`;

const ReplyFormWrapper = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const RepliesContainer = styled.div`
  margin-top: 1rem;
  margin-left: 1.5rem;
  border-left: 2px solid #eee;
  padding-left: 1rem;
`;

export default CommentItem; 