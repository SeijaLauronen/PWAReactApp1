import styled from 'styled-components'

export const StyledButton = styled.button`
border: 2px solid #4caf50;
background-color: ${(props) => 
    props.variant ==='outline' ? '#FFF' : '#4caf50'};
color: ${(props) => 
    props.variant ==='outline' ? '#4caf50' : 'white'};
padding: 15px 32px;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: large;
cursor: pointer;
transition: 0.5s all ease-out;
&:hover {
    background-color: ${(props) => 
        props.variant !=='outline' ? '#FFF' : '#4caf50'};
    color: ${(props) => 
        props.variant !=='outline' ? '#4caf50' : 'white'};

}
`

export const FancyButton = styled(StyledButton)`
background-image: linear-gradient(to right, #f6d365 0% , #fda085 100% );
border:none;
`