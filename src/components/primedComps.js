import styled from "styled-components";

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
