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
  justify-content: center;
  background-color: var(--dark-blue);
  color: white;
  width: 100%;
  gap: 3%;

  @media only screen and (max-width: 480px) {
    justify-content: space-between;
    background-color: teal;
    gap: 0;
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

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 33%;
  height: 100%;
  align-items: center;
  justify-content: space-around;
`;

export const Category = styled.div`
  display: flex;
  width: 70%;
  height: 20%;
  max-height: 30%;
  align-items: center;
  justify-content: start;
  background-color: beige;
  overflow: auto;
`;
