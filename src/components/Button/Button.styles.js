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

/*export const SubmitButton = styled(StyledButton).attrs({*/
/* Yllä oleva toimii ok, kun tässä attrs osassa ei käytetä propsia, jos käytettäisiiin, tulisi se näin:*/
export const SubmitButton = styled(StyledButton).attrs((props)=>({
    type: 'submit',
}))` /* ja tästä sulku pois jos ei propsia*/
    box-shadow: 0 9px #999;
    &:active {
        background-color: ${(props) => 
        props.variant !=='outline' ? '#FFF' : '#4caf50'};
        box-shadow: 0 5px #666;
        transform:translateY(4px)
    }
`

export const DarkButton = styled(StyledButton)`
border: 2px solid ${(props) => props.theme.dark.primary};
background-color: ${(props) => props.theme.dark.primary};
color: ${(props) => props.theme.dark.text};
`