import React from 'react';
import './App.css';
//Jostain syystä valittaa tästä, että on jo importattu, mutta pienellä kirjaimella button
import StyledButton, {FancyButton, SubmitButton} from './components/Button/Button'

function App() {
  return (
    <div className="App">
      <p>ReactPWA 2 ServiceWorker</p>
      <p>
      <button>Button</button>
      </p>
      <StyledButton type='submit'>Styled Button</StyledButton>
      <div><br/></div>
      <StyledButton variant='outline'>Styled Button</StyledButton>
      <div><br/></div>
      <FancyButton as='a'>Fancy Button, linkkinä</FancyButton>
      <div><br/></div>
      <SubmitButton>SubmitButton</SubmitButton>
    </div>
  );
}

export default App;
