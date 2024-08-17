import { Box, Button, Text } from "@chakra-ui/react";

const NoFound = () => {
  null;
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100%"
    >
      <Text>Page you are looking for is not found</Text>
      <Button mt={4} onClick={() => window.history.back()}>
        Go back
      </Button>
    </Box>
  );
};

export default NoFound;
