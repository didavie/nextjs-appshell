import styled from "styled-components";

export const MainContainer = styled.main`
  width: 80vw;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  height: 100vh;
  color: #000;
  --tw-bg-opacity: .5
  background-color: #ebebeb;

  @media (max-width: 768px) {
    width: 100%;
  }
`;
