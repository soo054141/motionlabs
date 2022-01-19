import React from 'react';
import styled from "styled-components";
import Passenger from "./components/Passenger";
import Report from "./components/Report";

function App() {
 
  return (
    <Wrapper>
      <Container>
        <Header>
          <a href="/">
            <h2 className="logo">Motionlabs</h2>
          </a>
        </Header>
        <Report />
        <Passenger />
      </Container>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  margin: 0;
  background-color: #f1f3f9;
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 600px;
  min-height: 100vh;
  background-color: #fff;
`;

const Header = styled.header`
  height: 70px;
  background-color: #000;
  display: flex;
  align-items: center;

  .logo {
    margin-left: 20px;
    font-size: 1.5em;
    font-weight: bold;
    color: white;
  }
`;