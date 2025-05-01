import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPosts, reset } from '../features/posts/postSlice.js';
import PostItem from '../components/posts/PostItem.js';
import Spinner from '../components/common/Spinner.js';
import styled from 'styled-components';
import { FaSortAmountDown, FaSortAmountUp, FaFilter } from 'react-icons/fa';
import config from '../config.js';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { posts, isLoading, pagination } = useSelector(state => state.posts);
  

  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category') || '';
  const sortParam = queryParams.get('sort') || '-createdAt';
  const pageParam = parseInt(queryParams.get('page')) || 1;
  
  const [category, setCategory] = useState(categoryParam);
  const [sort, setSort] = useState(sortParam);
  const [page, setPage] = useState(pageParam);
  
  const categories = [
    'All',
    ...config.CATEGORIES
  ];
  
  const sortOptions = [
    { value: '-createdAt', label: 'Newest', icon: <FaSortAmountDown /> },
    { value: 'createdAt', label: 'Oldest', icon: <FaSortAmountUp /> },
    { value: '-score', label: 'Most Popular', icon: <FaSortAmountDown /> },
    { value: 'score', label: 'Least Popular', icon: <FaSortAmountUp /> }
  ];
  
  useEffect(() => {
    const filters = {};
    
    if (category && category !== 'All') {
      filters.category = category;
    }
    
    if (sort) {
      filters.sort = sort;
    }
    
    if (page) {
      filters.page = page;
    }
    
    dispatch(getPosts(filters));
    
      const queryParams = new URLSearchParams();
    if (category && category !== 'All') queryParams.set('category', category);
    if (sort !== '-createdAt') queryParams.set('sort', sort);
    if (page !== 1) queryParams.set('page', page.toString());
    
    navigate({
      pathname: location.pathname,
      search: queryParams.toString() ? `?${queryParams.toString()}` : ''
    }, { replace: true });
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, category, sort, page, navigate, location.pathname]);
  
  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1); 
  };
  
  const handleSortChange = (value) => {
    setSort(value);
    setPage(1); 
  };
  
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.total) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <HomeContainer>
      <FiltersContainer>
        <CategoryFilters>
          <FilterLabel>
            <FaFilter /> Categories
          </FilterLabel>
          <CategoryList>
            {categories.map((cat) => (
              <CategoryItem 
                key={cat} 
                active={cat === 'All' ? !category || category === 'All' : category === cat}
                onClick={() => handleCategoryChange(cat === 'All' ? '' : cat)}
              >
                {cat}
              </CategoryItem>
            ))}
          </CategoryList>
        </CategoryFilters>
        
        <SortOptions>
          <FilterLabel>Sort By</FilterLabel>
          <SortList>
            {sortOptions.map((option) => (
              <SortItem 
                key={option.value} 
                active={sort === option.value}
                onClick={() => handleSortChange(option.value)}
              >
                {option.icon} {option.label}
              </SortItem>
            ))}
          </SortList>
        </SortOptions>
      </FiltersContainer>
      
      <ContentContainer>
        <Title>
          {category 
            ? `${category} Posts` 
            : 'Recent Posts'}
        </Title>
        
        {posts.length === 0 ? (
          <NoPosts>
            No posts found. Be the first to create a post in this category!
          </NoPosts>
        ) : (
          <PostsList>
            {posts.map(post => (
              <PostItem key={post._id} post={post} />
            ))}
          </PostsList>
        )}
        
        {pagination && pagination.total > 1 && (
          <Pagination>
            <PaginationButton 
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </PaginationButton>
            
            <PageInfo>
              Page {page} of {pagination.total}
            </PageInfo>
            
            <PaginationButton 
              disabled={page === pagination.total}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </PaginationButton>
          </Pagination>
        )}
      </ContentContainer>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FilterLabel = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CategoryFilters = styled.div`
  flex: 1;
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CategoryItem = styled.button`
  background-color: ${props => props.active ? '#3b49df' : '#e2e8f0'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#2a3ccd' : '#cbd5e1'};
  }
`;

const SortOptions = styled.div`
  min-width: 200px;
`;

const SortList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SortItem = styled.button`
  background: none;
  border: none;
  text-align: left;
  padding: 0.5rem;
  color: ${props => props.active ? '#3b49df' : '#555'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #3b49df;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #333;
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NoPosts = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: #666;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
`;

const PaginationButton = styled.button`
  background-color: #3b49df;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  
  &:disabled {
    background-color: #e2e8f0;
    color: #a0aec0;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    background-color: #2a3ccd;
  }
`;

const PageInfo = styled.div`
  color: #555;
  font-size: 0.9rem;
`;

export default Home; 