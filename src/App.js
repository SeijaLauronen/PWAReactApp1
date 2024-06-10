import {ThemeProvider, createGlobalStyle} from 'styled-components'
//import React from 'react';
import './App.css';
//Jostain syystä valittaa tästä, että on jo importattu, mutta pienellä kirjaimella button
import StyledButton, {FancyButton, SubmitButton} from './components/Button/Button'
import {DarkButton} from './components/Button/Button.styles'

const theme = {
  dark: {
    primary: 'black',
    text: 'white'
  },
  light: {
    primary: '#fff',
    text: '#000'
  },
  fontFamily: 'Segoe UI'
}

const GlobalStyle= createGlobalStyle`
button {
  /*font-family: 'Roboto';*/
  font-family: ${(props) => props.theme.fontFamily}
}
`

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div className="App">
        <p>ReactPWA 2 ServiceWorker</p>
        <p>
        <button>Button</button>
        </p>
        <StyledButton type='submit'>Styled Button</StyledButton>
        <div><br/></div>
        <StyledButton variant='outline'>Styled Button, outline</StyledButton>
        <div><br/></div>
        <FancyButton as='a'>Fancy Button, linkkinä</FancyButton>
        <div><br/></div>
        <SubmitButton>SubmitButton</SubmitButton>
        <div><br/></div>
        <DarkButton>DarkButton</DarkButton>
        
      </div>
    </ThemeProvider>
  );
}

export default App;
