import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFlaggedContent, unflagPost, unflagComment } from '../features/admin/adminSlice.js';
import styled from 'styled-components';
import { FaExclamationTriangle, FaCheck, FaTrash, FaEye } from 'react-icons/fa';
import Spinner from '../components/common/Spinner.js';
import moment from 'moment';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector(state => state.auth);
  const { flaggedContent, isLoading } = useSelector(state => state.admin);
  
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/admin/login');
      return;
    }
    
    dispatch(getFlaggedContent());
  }, [user, navigate, dispatch]);
  
  const handleUnflagPost = (postId) => {
    if (window.confirm('Are you sure you want to unflag this post?')) {
      dispatch(unflagPost(postId));
    }
  };
  
  const handleUnflagComment = (commentId) => {
    if (window.confirm('Are you sure you want to unflag this comment?')) {
      dispatch(unflagComment(commentId));
    }
  };
  
  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      // Handle post deletion
      console.log('Delete post:', postId);
    }
  };
  
  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment? This cannot be undone.')) {
      // Handle comment deletion
      console.log('Delete comment:', commentId);
    }
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Admin Dashboard</h1>
        <AdminInfo>
          Logged in as <strong>{user?.username}</strong>
        </AdminInfo>
      </DashboardHeader>
      
      <ReportsSummary>
        <ReportCard onClick={() => setActiveTab('posts')} active={activeTab === 'posts'}>
          <ReportIcon>
            <FaExclamationTriangle />
          </ReportIcon>
          <ReportCount>{flaggedContent?.posts?.length || 0}</ReportCount>
          <ReportLabel>Reported Posts</ReportLabel>
        </ReportCard>
        
        <ReportCard onClick={() => setActiveTab('comments')} active={activeTab === 'comments'}>
          <ReportIcon>
            <FaExclamationTriangle />
          </ReportIcon>
          <ReportCount>{flaggedContent?.comments?.length || 0}</ReportCount>
          <ReportLabel>Reported Comments</ReportLabel>
        </ReportCard>
      </ReportsSummary>
      
      <ContentTabs>
        <TabButton 
          active={activeTab === 'posts'} 
          onClick={() => setActiveTab('posts')}
        >
          Reported Posts
        </TabButton>
        <TabButton 
          active={activeTab === 'comments'} 
          onClick={() => setActiveTab('comments')}
        >
          Reported Comments
        </TabButton>
      </ContentTabs>
      
      <ContentPanel>
        {activeTab === 'posts' ? (
          <ReportedItems>
            {flaggedContent?.posts?.length === 0 ? (
              <NoItems>No reported posts to review.</NoItems>
            ) : (
              flaggedContent?.posts?.map(post => (
                <ReportedItem key={post._id}>
                  <ItemHeader>
                    <ItemTitle>{post.title}</ItemTitle>
                    <ItemCategory>{post.category}</ItemCategory>
                  </ItemHeader>
                  
                  <ItemDetails>
                    <ItemAuthor>Posted by: {post.author.username}</ItemAuthor>
                    <ItemDate>Posted: {moment(post.createdAt).format('MMM D, YYYY')}</ItemDate>
                    <ItemReportCount>
                      {post.reports.length} report(s)
                    </ItemReportCount>
                  </ItemDetails>
                  
                  <ItemContent>
                    {post.content.length > 200 
                      ? `${post.content.substring(0, 200)}...` 
                      : post.content}
                  </ItemContent>
                  
                  <ReportsList>
                    <ReportListTitle>Reports:</ReportListTitle>
                    {post.reports.map((report, index) => (
                      <ReportItem key={index}>
                        <strong>{report.reportedBy.username}</strong>: {report.reason} ({moment(report.createdAt).fromNow()})
                      </ReportItem>
                    ))}
                  </ReportsList>
                  
                  <ItemActions>
                    <ActionButton 
                      className="view"
                      onClick={() => window.open(`/post/${post._id}`, '_blank')}
                    >
                      <FaEye /> View
                    </ActionButton>
                    <ActionButton 
                      className="approve" 
                      onClick={() => handleUnflagPost(post._id)}
                    >
                      <FaCheck /> Unflag
                    </ActionButton>
                    <ActionButton 
                      className="delete" 
                      onClick={() => handleDeletePost(post._id)}
                    >
                      <FaTrash /> Delete
                    </ActionButton>
                  </ItemActions>
                </ReportedItem>
              ))
            )}
          </ReportedItems>
        ) : (
          <ReportedItems>
            {flaggedContent?.comments?.length === 0 ? (
              <NoItems>No reported comments to review.</NoItems>
            ) : (
              flaggedContent?.comments?.map(comment => (
                <ReportedItem key={comment._id}>
                  <ItemHeader>
                    <ItemTitle>Comment on: {comment.post.title}</ItemTitle>
                  </ItemHeader>
                  
                  <ItemDetails>
                    <ItemAuthor>By: {comment.author.username}</ItemAuthor>
                    <ItemDate>Posted: {moment(comment.createdAt).format('MMM D, YYYY')}</ItemDate>
                    <ItemReportCount>
                      {comment.reports.length} report(s)
                    </ItemReportCount>
                  </ItemDetails>
                  
                  <ItemContent>
                    {comment.content}
                  </ItemContent>
                  
                  <ReportsList>
                    <ReportListTitle>Reports:</ReportListTitle>
                    {comment.reports.map((report, index) => (
                      <ReportItem key={index}>
                        <strong>{report.reportedBy.username}</strong>: {report.reason} ({moment(report.createdAt).fromNow()})
                      </ReportItem>
                    ))}
                  </ReportsList>
                  
                  <ItemActions>
                    <ActionButton 
                      className="view"
                      onClick={() => window.open(`/post/${comment.post._id}`, '_blank')}
                    >
                      <FaEye /> View in post
                    </ActionButton>
                    <ActionButton 
                      className="approve" 
                      onClick={() => handleUnflagComment(comment._id)}
                    >
                      <FaCheck /> Unflag
                    </ActionButton>
                    <ActionButton 
                      className="delete" 
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      <FaTrash /> Delete
                    </ActionButton>
                  </ItemActions>
                </ReportedItem>
              ))
            )}
          </ReportedItems>
        )}
      </ContentPanel>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 2rem 0;
  max-width: 1000px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    margin: 0;
    color: #333;
  }
`;

const AdminInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ReportsSummary = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ReportCard = styled.div`
  flex: 1;
  background-color: ${props => props.active ? '#3b49df' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : '#333'};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ReportIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #e53e3e;
`;

const ReportCount = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ReportLabel = styled.div`
  font-size: 1rem;
`;

const ContentTabs = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const TabButton = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.active ? '#3b49df' : '#777'};
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.active ? '#3b49df' : 'transparent'};
  }
  
  &:hover {
    color: #3b49df;
  }
`;

const ContentPanel = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const ReportedItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const NoItems = styled.div`
  text-align: center;
  padding: 3rem;
  color: #777;
`;

const ReportedItem = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #f9f9f9;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ItemTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const ItemCategory = styled.span`
  background-color: #e9ecef;
  color: #555;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
`;

const ItemDetails = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const ItemAuthor = styled.span``;

const ItemDate = styled.span``;

const ItemReportCount = styled.span`
  color: #e53e3e;
  font-weight: 500;
`;

const ItemContent = styled.p`
  margin: 0;
  margin-bottom: 1rem;
  line-height: 1.5;
  color: #333;
`;

const ReportsList = styled.div`
  margin-bottom: 1rem;
  background-color: #fff;
  border-radius: 4px;
  padding: 1rem;
  border: 1px solid #eee;
`;

const ReportListTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ReportItem = styled.div`
  font-size: 0.9rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &.view {
    background-color: #e2e8f0;
    color: #4a5568;
    
    &:hover {
      background-color: #cbd5e0;
    }
  }
  
  &.approve {
    background-color: #4299e1;
    color: white;
    
    &:hover {
      background-color: #3182ce;
    }
  }
  
  &.delete {
    background-color: #e53e3e;
    color: white;
    
    &:hover {
      background-color: #c53030;
    }
  }
`;

export default AdminDashboard; 