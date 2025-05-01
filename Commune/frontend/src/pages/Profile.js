import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, getUserPosts, getUserComments, reset } from '../features/users/userSlice.js';
import Spinner from '../components/common/Spinner.js';
import styled from 'styled-components';
import PostItem from '../components/posts/PostItem.js';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';
import moment from 'moment';

const Profile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { profile, userPosts, isLoading } = useSelector(state => state.users);
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    dispatch(getUserProfile(username));
    dispatch(getUserPosts({ username, page: 1 }));
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, username]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    if (tab === 'posts' && userPosts.length === 0) {
      dispatch(getUserPosts({ username, page: 1 }));
    } else if (tab === 'comments') {
      dispatch(getUserComments({ username, page: 1 }));
    }
  };

  if (isLoading || !profile) {
    return <Spinner />;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileAvatar>
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.username} />
          ) : (
            <FaUser />
          )}
        </ProfileAvatar>
        
        <ProfileInfo>
          <ProfileUsername>{profile.username}</ProfileUsername>
          
          <ProfileMeta>
            <ProfileMetaItem>
              <FaCalendarAlt />
              <span>Joined {moment(profile.createdAt).format('MMMM YYYY')}</span>
            </ProfileMetaItem>
          </ProfileMeta>
          
          {profile.bio && <ProfileBio>{profile.bio}</ProfileBio>}
        </ProfileInfo>
      </ProfileHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'posts'} 
          onClick={() => handleTabChange('posts')}
        >
          Posts
        </Tab>
        <Tab 
          active={activeTab === 'comments'} 
          onClick={() => handleTabChange('comments')}
        >
          Comments
        </Tab>
      </TabsContainer>
      
      <ProfileContent>
        {activeTab === 'posts' && (
          <>
            {userPosts.length === 0 ? (
              <EmptyState>
                No posts yet.
              </EmptyState>
            ) : (
              userPosts.map(post => (
                <PostItem key={post._id} post={post} />
              ))
            )}
          </>
        )}
        
        {activeTab === 'comments' && (
          <EmptyState>
            Comments will be displayed here.
          </EmptyState>
        )}
      </ProfileContent>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  padding: 2rem 0;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    font-size: 3rem;
    color: #94a3b8;
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileUsername = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ProfileMeta = styled.div`
  display: flex;
  margin-bottom: 1rem;
  color: #64748b;
`;

const ProfileMetaItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ProfileBio = styled.p`
  color: #475569;
  line-height: 1.5;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#3b49df' : 'transparent'};
  color: ${props => props.active ? '#3b49df' : '#64748b'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  
  &:hover {
    color: #3b49df;
  }
`;

const ProfileContent = styled.div``;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: #666;
`;

export default Profile; 