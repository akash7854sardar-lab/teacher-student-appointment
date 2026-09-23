import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Stack align="center" py={20} textAlign="center">
      <Heading size="4xl">404</Heading>
      <Text color="gray.600">The page you requested was not found.</Text>
      <Button asChild colorPalette="blue">
        <Link to="/">Go home</Link>
      </Button>
    </Stack>
  );
}