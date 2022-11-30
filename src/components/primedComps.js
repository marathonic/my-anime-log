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
  justify-content: space-evenly;
  background-color: var(--dark-blue);
  color: white;
  width: 100%;
  gap: 3%;
  padding-block: 0.7%;

  @media only screen and (max-width: 480px) {
    justify-content: space-between;
    gap: 0;
    padding: 1.75%;
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
  background-color: #3f3351;
  // background-color: rgba(255, 255, 255, 0.1);
  overflow: hidden;

  ${(props) =>
    props.isMobile &&
    css`
      width: 100%;
      overflow: auto;
    `}
`;

export const LogCategory = styled.div`
  // justify-content: center;
  // padding-left: 5%;
  justify-items: space-between;
  align-items: center;
  flex-wrap: wrap;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 20%;
  max-height: 30%;
  background-color: #19172b;
  overflow: hidden;
  // gap: 10%;
  // padding: 5%;
  ${(props) =>
    props.isMobile &&
    css`
      background-color: #19173e;
      min-width: max-content;
      max-width: max-content;
      max-height: 38rem;
      overflow: auto;
    `};
`;

export const AnimeCard = styled.div`
  width: 100%;
  min-height: max-content;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  margin-block: 6%;
  color: white;

  ${(props) =>
    props.isMobile &&
    css`
      width: 100%;
      min-height: max-content;
      display: flex;
      flex-direction: column;
      justify-items: center;
      align-items: center;
      margin-block: 6%;
      color: white;
    `}
`;

export const CardThumbnail = styled.img`
  max-width: 100%;
  margin: 0;
  padding: 0;

  ${(props) =>
    props.isMobile &&
    css`
      max-width: 50%;
      // padding: 2.6%;
    `}
`;

export const CardDetails = styled.ul`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  background-color: #3f3351;
  justify-items: space-evenly;
  align-items: center;
  gap: 3%;
  padding-block: 5%;
  color: white;
  margin-block: 3%;
  font-size: 1.3rem;

  ${(props) =>
    props.isMobile &&
    css`
      max-width: 50%;
    `}
`;

export const CardTitle = styled.span`
  max-width: 70%;
  display: flex;
  flex-wrap: wrap;
`;

export const TrailerContainer = styled.div`
  min-height: max-content;
  min-width: max-content;
  display: flex;
  justify-content: center;

  ${(props) =>
    props.isMobile === false &&
    css`
      width: 100%;
      display: flex;
      justify-content: center;
      height: auto;
    `};

  ${(props) =>
    props.isModalOpen &&
    css`
      display: none;
    `}
`;

export const VideoFrame = styled.iframe`
  position: absolute;
  height: 40vh;
  width: 50%;
  border: transparent;

  ${(props) =>
    props.isMobile &&
    css`
      width: 72%;
      height: 100%;
      position: relative;
      margin-top: 1rem;
      margin-bottom: 3rem;
    `}
`;

export const AnimeSynopsis = styled.div`
  opacity: 93%;
  background-color: var(--mint-white);
  max-width: 95%;
  font-size: 1.5rem;
  margin-bottom: 20%;
  display: block;
  transform: translateY(-1);
  transition: visibility 0s, opacity 0.5s, linear;

  ${(props) =>
    !props.showSynopsis &&
    css`
      display: none;
      opacity: 0;
    `}
`;

export const SynopsisBar = styled.span`
  width: 100%;
  height: max-content;
  display: flex;
  flex-direction: ${(props) => (props.showSynopsis ? "row" : "column")}
  justify-content: center;
  align-items: center;
  background-color: var(--bebop-blue);
  z-index: 99;
  /* position: -webkit-sticky; */
  position: sticky;
  top: 0;
`;

export const ResultSpan = styled.span`
  width: 100%;
  display: flex;
  color: white;
  font-size: 1.2rem;
  justify-content: flex-start;
  align-items: center;
  margin-block: 3%;
`;

export const ResultThumbnail = styled.img`
  width: ${(props) => (props.isMobile ? "30%" : "10%")};
`;

export const Selector = styled.select`
  width: 70%;
  height: 1.8rem;
  // text-align-last: right;
  padding-left: 5%;
  // direction: rtl;
  font-size: 1.1rem;
  text-align: center;

  // background-color: #e9a6a6;
  background-color: whitesmoke;
  // background-color: palegoldenrod;

  // conditional: Selector is used in the Modal and the UsersAnimeLog. We want the following styles only when in UsersAnimeLog:
  font-size: ${(props) => (props.isBold ? "1.3rem" : "1rem")};
  color: #19172b;
  // color: none <-- works the same
  font-weight: ${(props) => (props.isBold ? "bold" : 100)};
  margin-bottom: ${(props) => (props.isBold ? "3%" : 0)};
`;

export const OptionSelector = styled.option`
  font-size: 1rem;
  width: 100%;
  // justify-content: center;
  text-align: center;
`;
