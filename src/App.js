import React, { useState } from 'react';
import styled from 'styled-components';
import Menu from './components/Menu';
import Footer from './components/Footer';
import PeopleView from './components/PeopleView';
import CitiesView from './components/CitiesView';

const Container = styled.div`
  padding: 20px;
  padding-top: 60px; /* For the fixed header */
  padding-bottom: 60px; /* For the fixed footer */
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  z-index: 1000;
`;

const Title = styled.h1`
  margin: 0;
`;

const Content = styled.div`
  padding-top: 20px;
`;

const App = () => {
  const [view, setView] = useState('people');

  const handleViewChange = newView => {
    setView(newView);
  };

  return (
    <>
      <Header>
        <Title>IndexedDB with React</Title>
        <Menu onViewChange={handleViewChange} />
      </Header>
      <Container>
        <Content>
          {view === 'people' ? <PeopleView /> : <CitiesView />}
        </Content>
      </Container>
      <Footer setView={setView} />
    </>
  );
};

export default App;
