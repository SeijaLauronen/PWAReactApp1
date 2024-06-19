import React from 'react';
import styled from 'styled-components';
/*
const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  padding: 10px 20px;
`;

const MenuButton = styled.button`
  background-color: #f1f1f1;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
`;

const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: absolute;
  background-color: #f9f9f9;
  min-width: 120px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
`;

const MenuItem = styled.li`
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;
*/

const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  padding: 10px 20px;
`;

const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
`;

const MenuItem = styled.li`
  padding: 0 10px;
  text-decoration: none;
  color: white;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;




const Menu = ({ onDeleteDatabase }) => {
    const handleDeleteDatabase = () => {
      onDeleteDatabase();
    };
  
    return (
      <MenuContainer>
        <MenuList>
          <MenuItem onClick={handleDeleteDatabase}>Delete Database</MenuItem>
          {/* Lisää muita valikon vaihtoehtoja tarvittaessa */}
          <MenuItem >Jotain</MenuItem>
        </MenuList>
      </MenuContainer>
    );
  };
  

export default Menu;
