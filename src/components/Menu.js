import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
`;

const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: fixed;
  top: 50px; /* Alkaa menupalkin alapuolelta */
  left: 0;
  width: 250px;
  height: calc(100% - 50px); /* Korkeus suhteutettu menupalkkiin */
  background-color: white;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease-in-out;
  z-index: 999;
`;

const MenuItem = styled.li`
  padding: 10px;
  text-decoration: none;
  color: black;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

const MenuIcon = styled.div`
  cursor: pointer;
  color: white;
  font-size: 24px;
`;

const Menu = ({ onDeleteDatabase }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteDatabase = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete the database? This action cannot be undone.');
    if (confirmDelete) {
      onDeleteDatabase();
      //setIsOpen(false); // Close menu after deleting database
    }
    setIsOpen(false); //Suljetaan menu joka tapauksessa
  };

  return (
    <>
      <MenuContainer>
        <MenuIcon onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faBars} />
        </MenuIcon>
      </MenuContainer>
      <MenuList isOpen={isOpen}>
        <MenuItem onClick={handleDeleteDatabase}>Delete Database</MenuItem>
        {/* Add other menu options as needed */}
        <MenuItem >Testi menuitem</MenuItem>
        <MenuItem >Testi menuitem2</MenuItem>
      </MenuList>
    </>
  );
};

export default Menu;
