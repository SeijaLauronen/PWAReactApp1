import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #f1f1f1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #ddd;
  z-index: 1000;
`;

const FooterButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const Footer = ({ setView }) => {
  return (
    <FooterContainer>
      <FooterButton onClick={() => setView('people')}>People</FooterButton>
      <FooterButton onClick={() => setView('cities')}>Cities</FooterButton>
    </FooterContainer>
  );
};

export default Footer;
