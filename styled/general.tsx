import styled from "@emotion/styled";
import { Header } from "@mantine/core";

export const StyledHeader = styled(Header)`
  width: 100%;
  margin: auto;
  z-index: 1 !important;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  alignitems: center;
  justify-content: space-between;
  display: flex;
`;

export const StyledMain = styled.main`
  display: flex;
  flex-direction: row;
  max-height: calc(100vh);
  min-height: calc(100vh);
  overflow-y: auto;
`;

export const StyledNav = styled.div``;

export const StyledContent = styled.div`
  background-color: aliceblue;
  width: 100%;
  margin-top: 60px;
  border-radius: 0px 0px 10px 10px;
`;
