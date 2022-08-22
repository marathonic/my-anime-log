import styled, { css } from "styled-components";

export const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
`;

export const Headr = styled.header`
  display: flex;
  width: 100%;
  height: 10%;
  padding: 1%;
  color: white;
  background-color: var(--dark-blue);
  font-size: 1.5rem;
  justify-content: space-between;
`;

export const NavBar = styled.nav`
  display: flex;
  width: 100%;
  height: 10%;
  color: white;
  background-color: var(--darkblue);
  font-size 1.25rem;
  justify-content: space-between;
  align-items:center;
  font-size: 2rem;

  
`;

export const UList = styled.ul`
  display: flex;
  background-color: var(--dark-blue);
  color: white;
  width: 100%;

  @media only screen and (max-width: 480px) {
    background-color: teal;
  }
`;

export const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid rebeccapurple;
  color: rebeccapurple;
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;
`;
