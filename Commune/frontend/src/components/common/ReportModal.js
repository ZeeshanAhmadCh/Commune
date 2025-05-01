import { useState } from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ReportModal = ({ onClose, onSubmit, contentType }) => {
  const [reason, setReason] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit(reason);
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            <FaExclamationTriangle /> Report {contentType}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <p>Please provide a reason for reporting this {contentType}:</p>
          
          <ReportForm onSubmit={handleSubmit}>
            <ReportOptions>
              <ReportOption>
                <input 
                  type="radio" 
                  id="spam" 
                  name="reportReason" 
                  value="Spam"
                  onChange={(e) => setReason(e.target.value)}
                  checked={reason === 'Spam'}
                />
                <label htmlFor="spam">Spam</label>
              </ReportOption>
              
              <ReportOption>
                <input 
                  type="radio" 
                  id="harassment" 
                  name="reportReason" 
                  value="Harassment"
                  onChange={(e) => setReason(e.target.value)}
                  checked={reason === 'Harassment'}
                />
                <label htmlFor="harassment">Harassment</label>
              </ReportOption>
              
              <ReportOption>
                <input 
                  type="radio" 
                  id="inappropriate" 
                  name="reportReason" 
                  value="Inappropriate content"
                  onChange={(e) => setReason(e.target.value)}
                  checked={reason === 'Inappropriate content'}
                />
                <label htmlFor="inappropriate">Inappropriate content</label>
              </ReportOption>
              
              <ReportOption>
                <input 
                  type="radio" 
                  id="other" 
                  name="reportReason" 
                  value="Other"
                  onChange={(e) => setReason(e.target.value)}
                  checked={reason === 'Other'}
                />
                <label htmlFor="other">Other</label>
              </ReportOption>
              
              {reason === 'Other' && (
                <OtherReasonInput
                  placeholder="Please specify..."
                  value={reason === 'Other' ? '' : reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              )}
            </ReportOptions>
            
            <ModalFooter>
              <CancelButton type="button" onClick={onClose}>Cancel</CancelButton>
              <SubmitButton type="submit" disabled={!reason}>Submit Report</SubmitButton>
            </ModalFooter>
          </ReportForm>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: #e53e3e;
  
  svg {
    color: #e53e3e;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #777;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
  
  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }
`;

const ReportForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const ReportOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ReportOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  input {
    margin: 0;
  }
  
  label {
    margin: 0;
    cursor: pointer;
  }
`;

const OtherReasonInput = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 0.5rem;
  resize: vertical;
  min-height: 80px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: #f1f1f1;
  color: #333;
  border: none;
  
  &:hover {
    background-color: #e1e1e1;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #e53e3e;
  color: white;
  border: none;
  
  &:disabled {
    background-color: #f5a9a9;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: #c53030;
  }
`;

export default ReportModal; 