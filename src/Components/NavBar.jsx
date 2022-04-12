import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  margin: 5%;
`;

const Heading1 = styled.h1`
  font-size: 36px;
`;

const Heading2 = styled.h2`
  font-size: 24px;
`;

const NavBar = () => {
  return (
    <Wrapper>
      <Link to="/">Home</Link>
      <Heading1>CopilotIQ Frontend Offline Exercise</Heading1>
      <Heading2>by Michael Yang</Heading2>
      <hr />
    </Wrapper>
  );
};

export default NavBar;
