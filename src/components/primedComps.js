import styled, { css, keyframes } from "styled-components";

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
  padding: 0;
  margin: 0;
  
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

  ${(props) =>
    !props.isMobile &&
    css`
      width: 100%;
      overflow: auto;
      justify-content: space-around;
    `}
`;

export const LogCategory = styled.div`
  // justify-content: center;
  // padding-left: 5%;
  justify-items: space-between;
  align-items: center;
  flex-wrap: wrap;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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
      grid-template-columns: 1fr 1fr;
      background-color: #19173e;
      min-width: max-content;
      max-width: max-content;
      max-height: 38rem;
      overflow: auto;
    `};

  ${(props) =>
    !props.isMobile &&
    css`
      grid-template-columns: 1fr 1fr 1fr 1fr;
      background-color: transparent;
      min-width: max-content;
      max-width: max-content;
      max-height: 38rem;
      overflow: auto;
    `};

  // background-color: ${(props) => (props.isMobile ? "gray" : "goldenrod")};
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
  // gap: 3%;
  // height: 100%;
  padding-block: 2%;
  color: white;
  margin-block: 2%;
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
    props.isMobile &&
    css`
      width: 100%;
      display: flex;
      justify-content: center;
      height: auto;
      margin-bottom: auto;
    `};

  ${(props) =>
    props.isMobile === false &&
    css`
      width: 100%;
      display: flex;
      justify-content: center;
      height: 30rem;
      margin-bottom: 5%;
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

  ${(props) =>
    !props.isMobile &&
    css`
      width: 60%;
      height: 100%;
      position: relative;
      margin-top: 0;
      margin-bottom: 0;
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

  ${(props) =>
    !props.isMobile &&
    css`
      max-width: 60%;
      margin-bottom: 2%;
      margin-top: 5px;
    `}


  ${(props) =>
    props.isMobile &&
    css`
      margin-top: 0px;
      width: 100%;
      // max-width: 50%;
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
  background-color: transparent;
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

  ${(props) =>
    !props.isMobile &&
    css`
      max-width: 100%;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      margin-block: 3%;
      font-size: 1.6rem;
    `}
`;

// -----------+++++++++++++++++++++++++CONTINUE HERE -----------+++++++++++++++++++++++++++++++++++++
// ISSUE TO SOLVE: Result pics have different sizes on mobile (on phone hardware). We had only set 'width' here, test out min-width and max-width.
// We may wish to provide height measurements as well. If necessary, figure out what those would be.

export const ResultThumbnail = styled.img`
  width: ${(props) => (props.isMobile ? "30%" : "25%")};

  min-width: ${(props) => (props.isMobile ? "30%" : "25%")};
  max-width: ${(props) => (props.isMobile ? "30%" : "25%")};
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
  margin-bottom: ${(props) => (props.isBold && props.isMobile ? "3%" : 0)};
  ${(props) =>
    !props.isMobile &&
    css`
      margin-bottom: 0;
    `}
`;

export const OptionSelector = styled.option`
  font-size: 1rem;
  width: 100%;
  // justify-content: center;
  text-align: center;
`;

const animStar = keyframes`
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(600px);
  }
`;

export const Stars = styled.div`
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: 1602px 661px #d2ea7a, 1779px 795px #d2ea7a, 1154px 812px #d2ea7a,
    1328px 800px #d2ea7a, 1262px 1251px #d2ea7a, 1976px 432px #d2ea7a,
    1650px 1853px #d2ea7a, 1001px 468px #d2ea7a, 609px 405px #d2ea7a,
    1842px 1576px #d2ea7a, 742px 1365px #d2ea7a, 321px 1286px #d2ea7a,
    462px 926px #d2ea7a, 481px 458px #d2ea7a, 484px 1952px #d2ea7a,
    380px 1267px #d2ea7a, 1122px 820px #d2ea7a, 1626px 1217px #d2ea7a,
    1953px 1255px #d2ea7a, 1728px 140px #d2ea7a, 1430px 1262px #d2ea7a,
    7px 463px #d2ea7a, 1664px 338px #d2ea7a, 63px 11px #d2ea7a,
    552px 438px #d2ea7a, 3px 783px #d2ea7a, 1247px 361px #d2ea7a,
    803px 121px #d2ea7a, 755px 1435px #d2ea7a, 659px 1572px #d2ea7a,
    462px 256px #d2ea7a, 654px 1979px #d2ea7a, 1747px 1521px #d2ea7a,
    1222px 1922px #d2ea7a, 1615px 1672px #d2ea7a, 980px 918px #d2ea7a,
    1477px 1509px #d2ea7a, 1311px 365px #d2ea7a, 286px 1255px #d2ea7a,
    897px 1108px #d2ea7a, 770px 330px #d2ea7a, 337px 598px #d2ea7a,
    1192px 711px #d2ea7a, 1656px 1284px #d2ea7a, 1808px 543px #d2ea7a,
    1099px 608px #d2ea7a, 1215px 157px #d2ea7a, 1670px 748px #d2ea7a,
    110px 734px #d2ea7a, 1513px 1678px #d2ea7a, 137px 1969px #d2ea7a,
    242px 1029px #d2ea7a, 670px 606px #d2ea7a, 1173px 1915px #d2ea7a,
    1730px 1946px #d2ea7a, 1617px 1395px #d2ea7a, 294px 1214px #d2ea7a,
    942px 1551px #d2ea7a, 327px 885px #d2ea7a, 1961px 128px #d2ea7a,
    314px 333px #d2ea7a, 845px 1457px #d2ea7a, 1293px 408px #d2ea7a,
    1058px 582px #d2ea7a, 1981px 1771px #d2ea7a, 1473px 311px #d2ea7a,
    1227px 955px #d2ea7a, 1937px 1262px #d2ea7a, 754px 624px #d2ea7a,
    266px 619px #d2ea7a, 182px 1621px #d2ea7a, 29px 802px #d2ea7a,
    1075px 298px #d2ea7a, 1986px 1900px #d2ea7a, 1770px 447px #d2ea7a,
    1291px 57px #d2ea7a, 782px 1535px #d2ea7a, 1312px 111px #d2ea7a,
    1194px 651px #d2ea7a, 899px 193px #d2ea7a, 282px 163px #d2ea7a,
    1341px 998px #d2ea7a, 379px 1540px #d2ea7a, 406px 1584px #d2ea7a,
    1227px 223px #d2ea7a, 1525px 402px #d2ea7a, 66px 1842px #d2ea7a,
    1531px 1873px #d2ea7a, 1303px 376px #d2ea7a, 1949px 1797px #d2ea7a,
    1093px 1018px #d2ea7a, 937px 886px #d2ea7a, 1954px 1675px #d2ea7a,
    1957px 304px #d2ea7a;
  animation-name: ${animStar};
  animation-duration: 50s;
  animation-iteration-count: linear infinite;
  &:after {
    content: " ";
    // position: absolute;
    // top: 2000px;
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: 1602px 661px #d2ea7a, 1779px 795px #d2ea7a, 1154px 812px #d2ea7a,
      1328px 800px #d2ea7a, 1262px 1251px #d2ea7a, 1976px 432px #d2ea7a,
      1650px 1853px #d2ea7a, 1001px 468px #d2ea7a, 609px 405px #d2ea7a,
      1842px 1576px #d2ea7a, 742px 1365px #d2ea7a, 321px 1286px #d2ea7a,
      462px 926px #d2ea7a, 481px 458px #d2ea7a, 484px 1952px #d2ea7a,
      380px 1267px #d2ea7a, 1122px 820px #d2ea7a, 1626px 1217px #d2ea7a,
      1953px 1255px #d2ea7a, 1728px 140px #d2ea7a, 1430px 1262px #d2ea7a,
      7px 463px #d2ea7a, 1664px 338px #d2ea7a, 63px 11px #d2ea7a,
      552px 438px #d2ea7a, 3px 783px #d2ea7a, 1247px 361px #d2ea7a,
      803px 121px #d2ea7a, 755px 1435px #d2ea7a, 659px 1572px #d2ea7a,
      462px 256px #d2ea7a, 654px 1979px #d2ea7a, 1747px 1521px #d2ea7a,
      1222px 1922px #d2ea7a, 1615px 1672px #d2ea7a, 980px 918px #d2ea7a,
      1477px 1509px #d2ea7a, 1311px 365px #d2ea7a, 286px 1255px #d2ea7a,
      897px 1108px #d2ea7a, 770px 330px #d2ea7a, 337px 598px #d2ea7a,
      1192px 711px #d2ea7a, 1656px 1284px #d2ea7a, 1808px 543px #d2ea7a,
      1099px 608px #d2ea7a, 1215px 157px #d2ea7a, 1670px 748px #d2ea7a,
      110px 734px #d2ea7a, 1513px 1678px #d2ea7a, 137px 1969px #d2ea7a,
      242px 1029px #d2ea7a, 670px 606px #d2ea7a, 1173px 1915px #d2ea7a,
      1730px 1946px #d2ea7a, 1617px 1395px #d2ea7a, 294px 1214px #d2ea7a,
      942px 1551px #d2ea7a, 327px 885px #d2ea7a, 1961px 128px #d2ea7a,
      314px 333px #d2ea7a, 845px 1457px #d2ea7a, 1293px 408px #d2ea7a,
      1058px 582px #d2ea7a, 1981px 1771px #d2ea7a, 1473px 311px #d2ea7a,
      1227px 955px #d2ea7a, 1937px 1262px #d2ea7a, 754px 624px #d2ea7a,
      266px 619px #d2ea7a, 182px 1621px #d2ea7a, 29px 802px #d2ea7a,
      1075px 298px #d2ea7a, 1986px 1900px #d2ea7a, 1770px 447px #d2ea7a,
      1291px 57px #d2ea7a, 782px 1535px #d2ea7a, 1312px 111px #d2ea7a,
      1194px 651px #d2ea7a, 899px 193px #d2ea7a, 282px 163px #d2ea7a,
      1341px 998px #d2ea7a, 379px 1540px #d2ea7a, 406px 1584px #d2ea7a,
      1227px 223px #d2ea7a, 1525px 402px #d2ea7a, 66px 1842px #d2ea7a,
      1531px 1873px #d2ea7a, 1303px 376px #d2ea7a, 1949px 1797px #d2ea7a,
      1093px 1018px #d2ea7a, 937px 886px #d2ea7a, 1954px 1675px #d2ea7a,
      1957px 304px #d2ea7a;
  }
`;

export const Stars2 = styled.div`
  width: 1.6px;
  height: 1.6px;
  background: transparent;
  box-shadow: 743px 879px #d2ea7a, 1145px 1260px #d2ea7a, 1412px 672px #d2ea7a,
    507px 1211px #d2ea7a, 52px 89px #d2ea7a, 1045px 256px #d2ea7a,
    1022px 859px #d2ea7a, 1520px 413px #d2ea7a, 1575px 604px #d2ea7a,
    992px 877px #d2ea7a, 914px 960px #d2ea7a, 139px 685px #d2ea7a,
    720px 707px #d2ea7a, 1235px 945px #d2ea7a, 1256px 1153px #d2ea7a,
    1223px 641px #d2ea7a, 1810px 466px #d2ea7a, 1011px 1248px #d2ea7a,
    799px 1160px #d2ea7a, 770px 1135px #d2ea7a, 1000px 1841px #d2ea7a,
    1733px 385px #d2ea7a, 1142px 610px #d2ea7a, 1047px 487px #d2ea7a,
    1268px 1604px #d2ea7a, 1877px 835px #d2ea7a, 1003px 698px #d2ea7a,
    525px 714px #d2ea7a, 703px 960px #d2ea7a, 267px 1336px #d2ea7a,
    1343px 133px #d2ea7a, 230px 731px #d2ea7a, 1613px 1782px #d2ea7a,
    758px 1457px #d2ea7a, 1877px 1912px #d2ea7a, 1155px 1320px #d2ea7a,
    719px 932px #d2ea7a, 746px 69px #d2ea7a, 1148px 186px #d2ea7a,
    1642px 1323px #d2ea7a, 728px 1138px #d2ea7a, 815px 461px #d2ea7a,
    1281px 137px #d2ea7a, 132px 1620px #d2ea7a, 685px 500px #d2ea7a,
    1067px 1439px #d2ea7a, 101px 1941px #d2ea7a, 218px 857px #d2ea7a,
    181px 1464px #d2ea7a, 1403px 769px #d2ea7a, 744px 815px #d2ea7a,
    1052px 553px #d2ea7a, 1447px 1035px #d2ea7a, 814px 1090px #d2ea7a,
    1127px 1883px #d2ea7a, 689px 83px #d2ea7a, 1067px 1753px #d2ea7a,
    1948px 34px #d2ea7a, 676px 1749px #d2ea7a, 830px 1875px #d2ea7a,
    836px 512px #d2ea7a, 1847px 800px #d2ea7a, 920px 1950px #d2ea7a,
    368px 71px #d2ea7a, 1773px 818px #d2ea7a, 215px 1460px #d2ea7a,
    1246px 1249px #d2ea7a, 1078px 470px #d2ea7a, 401px 437px #d2ea7a,
    1711px 1570px #d2ea7a, 1345px 506px #d2ea7a, 397px 571px #d2ea7a,
    1610px 1971px #d2ea7a, 1134px 1569px #d2ea7a, 163px 322px #d2ea7a,
    1837px 371px #d2ea7a, 485px 424px #d2ea7a, 488px 1287px #d2ea7a,
    747px 354px #d2ea7a, 944px 939px #d2ea7a, 505px 100px #d2ea7a,
    470px 1438px #d2ea7a, 1222px 1874px #d2ea7a, 559px 316px #d2ea7a,
    1945px 1622px #d2ea7a, 1609px 1373px #d2ea7a, 901px 922px #d2ea7a,
    1413px 520px #d2ea7a, 1526px 1563px #d2ea7a;
  animation-name: ${animStar};
  animation-duration: 100s;
  animation-iteration-count: linear infinite;
  &:after {
    content: " ";
    // position: absolute;
    // top: 2000px;
    width: 1.6px;
    height: 1.6px;
    background: transparent;
    box-shadow: 743px 879px #d2ea7a, 1145px 1260px #d2ea7a, 1412px 672px #d2ea7a,
      507px 1211px #d2ea7a, 52px 89px #d2ea7a, 1045px 256px #d2ea7a,
      1022px 859px #d2ea7a, 1520px 413px #d2ea7a, 1575px 604px #d2ea7a,
      992px 877px #d2ea7a, 914px 960px #d2ea7a, 139px 685px #d2ea7a,
      720px 707px #d2ea7a, 1235px 945px #d2ea7a, 1256px 1153px #d2ea7a,
      1223px 641px #d2ea7a, 1810px 466px #d2ea7a, 1011px 1248px #d2ea7a,
      799px 1160px #d2ea7a, 770px 1135px #d2ea7a, 1000px 1841px #d2ea7a,
      1733px 385px #d2ea7a, 1142px 610px #d2ea7a, 1047px 487px #d2ea7a,
      1268px 1604px #d2ea7a, 1877px 835px #d2ea7a, 1003px 698px #d2ea7a,
      525px 714px #d2ea7a, 703px 960px #d2ea7a, 267px 1336px #d2ea7a,
      1343px 133px #d2ea7a, 230px 731px #d2ea7a, 1613px 1782px #d2ea7a,
      758px 1457px #d2ea7a, 1877px 1912px #d2ea7a, 1155px 1320px #d2ea7a,
      719px 932px #d2ea7a, 746px 69px #d2ea7a, 1148px 186px #d2ea7a,
      1642px 1323px #d2ea7a, 728px 1138px #d2ea7a, 815px 461px #d2ea7a,
      1281px 137px #d2ea7a, 132px 1620px #d2ea7a, 685px 500px #d2ea7a,
      1067px 1439px #d2ea7a, 101px 1941px #d2ea7a, 218px 857px #d2ea7a,
      181px 1464px #d2ea7a, 1403px 769px #d2ea7a, 744px 815px #d2ea7a,
      1052px 553px #d2ea7a, 1447px 1035px #d2ea7a, 814px 1090px #d2ea7a,
      1127px 1883px #d2ea7a, 689px 83px #d2ea7a, 1067px 1753px #d2ea7a,
      1948px 34px #d2ea7a, 676px 1749px #d2ea7a, 830px 1875px #d2ea7a,
      836px 512px #d2ea7a, 1847px 800px #d2ea7a, 920px 1950px #d2ea7a,
      368px 71px #d2ea7a, 1773px 818px #d2ea7a, 215px 1460px #d2ea7a,
      1246px 1249px #d2ea7a, 1078px 470px #d2ea7a, 401px 437px #d2ea7a,
      1711px 1570px #d2ea7a, 1345px 506px #d2ea7a, 397px 571px #d2ea7a,
      1610px 1971px #d2ea7a, 1134px 1569px #d2ea7a, 163px 322px #d2ea7a,
      1837px 371px #d2ea7a, 485px 424px #d2ea7a, 488px 1287px #d2ea7a,
      747px 354px #d2ea7a, 944px 939px #d2ea7a, 505px 100px #d2ea7a,
      470px 1438px #d2ea7a, 1222px 1874px #d2ea7a, 559px 316px #d2ea7a,
      1188px 1154px #d2ea7a, 136px 11px #d2ea7a, 1213px 1280px #d2ea7a,
      335px 422px #d2ea7a, 1849px 388px #d2ea7a, 181px 1449px #d2ea7a,
      1945px 1622px #d2ea7a, 1609px 1373px #d2ea7a, 901px 922px #d2ea7a,
      1413px 520px #d2ea7a, 1526px 1563px #d2ea7a;
  }
`;

export const Stars3 = styled.div`
  width: 1.3px;
  height: 1.3px;
  background: transparent;
  box-shadow: 1703px 1208px #d2ea7a, 381px 207px #d2ea7a, 1516px 1990px #d2ea7a,
    1960px 982px #d2ea7a, 922px 1278px #d2ea7a, 689px 1766px #d2ea7a,
    538px 554px #d2ea7a, 802px 1529px #d2ea7a, 871px 1805px #d2ea7a,
    228px 1830px #d2ea7a, 353px 186px #d2ea7a, 1873px 1154px #d2ea7a,
    494px 1244px #d2ea7a, 1415px 261px #d2ea7a, 1020px 1990px #d2ea7a,
    1924px 1169px #d2ea7a, 1205px 464px #d2ea7a, 596px 830px #d2ea7a,
    1319px 504px #d2ea7a, 953px 1850px #d2ea7a, 408px 1360px #d2ea7a,
    569px 1704px #d2ea7a, 1367px 729px #d2ea7a, 807px 1845px #d2ea7a,
    572px 825px #d2ea7a, 523px 1089px #d2ea7a, 1405px 1622px #d2ea7a,
    1352px 423px #d2ea7a, 1247px 1758px #d2ea7a, 1117px 920px #d2ea7a,
    983px 352px #d2ea7a, 175px 1351px #d2ea7a, 962px 260px #d2ea7a,
    918px 1530px #d2ea7a, 1184px 935px #d2ea7a, 201px 473px #d2ea7a,
    90px 1759px #d2ea7a, 211px 933px #d2ea7a, 1887px 171px #d2ea7a,
    177px 101px #d2ea7a, 844px 346px #d2ea7a, 283px 1821px #d2ea7a,
    1236px 1225px #d2ea7a, 173px 1875px #d2ea7a, 24px 1776px #d2ea7a,
    277px 804px #d2ea7a, 1714px 715px #d2ea7a, 937px 1882px #d2ea7a,
    1708px 1405px #d2ea7a, 173px 1847px #d2ea7a, 1902px 1160px #d2ea7a,
    1725px 1270px #d2ea7a, 36px 18px #d2ea7a, 1612px 1467px #d2ea7a,
    1390px 1733px #d2ea7a, 927px 1315px #d2ea7a, 1907px 1337px #d2ea7a,
    1855px 1454px #d2ea7a, 1033px 1425px #d2ea7a, 1450px 1359px #d2ea7a,
    1422px 771px #d2ea7a, 256px 343px #d2ea7a, 1581px 340px #d2ea7a,
    1180px 247px #d2ea7a, 191px 882px #d2ea7a, 372px 1171px #d2ea7a,
    1509px 937px #d2ea7a, 1018px 1829px #d2ea7a, 121px 152px #d2ea7a,
    327px 767px #d2ea7a, 1438px 1421px #d2ea7a, 321px 905px #d2ea7a,
    616px 245px #d2ea7a, 1957px 1520px #d2ea7a, 1811px 1924px #d2ea7a,
    1454px 1778px #d2ea7a, 1507px 822px #d2ea7a, 649px 218px #d2ea7a,
    362px 1567px #d2ea7a, 1637px 145px #d2ea7a, 115px 466px #d2ea7a,
    345px 935px #d2ea7a, 112px 1019px #d2ea7a, 1440px 1910px #d2ea7a,
    1280px 1367px #d2ea7a, 1505px 890px #d2ea7a, 788px 927px #d2ea7a,
    753px 1273px #d2ea7a, 1924px 1714px #d2ea7a, 495px 1149px #d2ea7a,
    267px 1851px #d2ea7a, 1293px 1431px #d2ea7a, 1159px 433px #d2ea7a,
    1725px 1170px #d2ea7a;
  animation-name: ${animStar};
  animation-duration: 150s;
  animation-iteration-count: linear infinite;
  &:after {
    content: " ";
    // position: absolute;
    // top: 2000px;
    width: 1.3px;
    height: 1.3px;
    background: transparent;
    box-shadow: 1703px 1208px #fff, 381px 207px #fff, 1516px 1990px #fff,
      1960px 982px #fff, 922px 1278px #fff, 689px 1766px #fff, 538px 554px #fff,
      802px 1529px #fff, 871px 1805px #fff, 228px 1830px #fff, 353px 186px #fff,
      1873px 1154px #fff, 494px 1244px #fff, 1415px 261px #fff,
      1020px 1990px #fff, 1924px 1169px #fff, 1205px 464px #fff,
      596px 830px #fff, 1319px 504px #fff, 953px 1850px #fff, 408px 1360px #fff,
      569px 1704px #fff, 1367px 729px #fff, 807px 1845px #fff, 572px 825px #fff,
      523px 1089px #fff, 1405px 1622px #fff, 1352px 423px #fff,
      1247px 1758px #fff, 1117px 920px #fff, 983px 352px #fff, 175px 1351px #fff,
      962px 260px #fff, 918px 1530px #fff, 1184px 935px #fff, 201px 473px #fff,
      90px 1759px #fff, 211px 933px #fff, 1887px 171px #fff, 177px 101px #fff,
      844px 346px #fff, 283px 1821px #fff, 1236px 1225px #fff, 173px 1875px #fff,
      24px 1776px #fff, 277px 804px #fff, 1714px 715px #fff, 937px 1882px #fff,
      1708px 1405px #fff, 173px 1847px #fff, 1902px 1160px #fff,
      1725px 1270px #fff, 36px 18px #fff, 1612px 1467px #fff, 1390px 1733px #fff,
      927px 1315px #fff, 1907px 1337px #fff, 1855px 1454px #fff,
      1033px 1425px #fff, 1450px 1359px #fff, 1422px 771px #fff,
      256px 343px #fff, 1581px 340px #fff, 1180px 247px #fff, 191px 882px #fff,
      372px 1171px #fff, 1509px 937px #fff, 1018px 1829px #fff, 121px 152px #fff,
      327px 767px #fff, 1438px 1421px #fff, 321px 905px #fff, 616px 245px #fff,
      1957px 1520px #fff, 1811px 1924px #fff, 1454px 1778px #fff,
      1507px 822px #fff, 649px 218px #fff, 362px 1567px #fff, 1637px 145px #fff,
      115px 466px #fff, 345px 935px #fff, 112px 1019px #fff, 1440px 1910px #fff,
      1280px 1367px #fff, 1505px 890px #fff, 788px 927px #fff, 753px 1273px #fff,
      1924px 1714px #fff, 495px 1149px #fff, 267px 1851px #fff,
      1293px 1431px #fff, 1159px 433px #fff, 1725px 1170px #fff;
  }
`;
