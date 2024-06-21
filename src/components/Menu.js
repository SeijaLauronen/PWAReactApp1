import React, { useState } from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  position: relative;
  z-index: 1000;
`;

const HamburgerIcon = styled.div`
  width: 30px;
  height: 30px;
  background-color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;
  border-radius: 4px;
`;

const Line = styled.div`
  width: 20px;
  height: 2px;
  background-color: black;
  margin: 2px 0;
`;

const DropdownMenu = styled.div`
  position: fixed;
  top: 50px;
  left: 10px;
  background-color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 999;
  display: ${props => (props.open ? 'block' : 'none')};
`;

const MenuItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  color: black;
  &:hover {
    background-color: #ddd;
  }
`;

const ConfirmDialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  color: black;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background-color: ${props => props.primary ? '#4CAF50' : '#f44336'};
  color: white;
  border-radius: 4px;
  &:hover {
    opacity: 0.8;
  }
`;

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDeleteDatabase = () => {
    setShowConfirmDialog(true);
  };

  const confirmDeleteDatabase = () => {
    const request = indexedDB.deleteDatabase('MyDatabase');
    request.onsuccess = () => {
      console.log('Database deleted successfully');
      window.location.reload();
    };
    request.onerror = (event) => {
      console.error('Error deleting database:', event.target.errorCode);
    };
    setShowConfirmDialog(false);
  };

  const cancelDeleteDatabase = () => {
    setShowConfirmDialog(false);
  };

  return (
    <MenuContainer>
      <HamburgerIcon onClick={handleMenuToggle}>
        <Line />
        <Line />
        <Line />
      </HamburgerIcon>
      <DropdownMenu open={menuOpen}>
        <MenuItem onClick={handleDeleteDatabase}>Delete Database</MenuItem>
      </DropdownMenu>
      {showConfirmDialog && (
        <ConfirmDialog>
          <div style={{ marginBottom: '20px' }}>Are you sure you want to delete the database?</div>
          <ButtonContainer>
            <Button onClick={confirmDeleteDatabase} primary>
              Delete
            </Button>
            <Button onClick={cancelDeleteDatabase}>
              Cancel
            </Button>
          </ButtonContainer>
        </ConfirmDialog>
      )}
    </MenuContainer>
  );
};

export default Menu;
