import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Stack gap={10} py={{ base: 8, md: 16 }}>
      <Box>
        <Text fontWeight="bold" color="blue.600" mb={2}>
          FULL-STACK STARTER
        </Text>
        <Heading size={{ base: "2xl", md: "4xl" }} mb={4}>
          React + Chakra UI + Redux Toolkit + Supabase
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="700px">
          A clean foundation for authentication, protected routes, Redux
          state, PostgreSQL data, and responsive UI.
        </Text>
      </Box>

      <Stack direction={{ base: "column", sm: "row" }} gap={3}>
        <Button asChild colorPalette="blue">
          <Link to="/register">Create account</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/login">Sign in</Link>
        </Button>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
        {[
          ["Authentication", "Supabase email/password authentication."],
          ["State", "Redux Toolkit for predictable global state."],
          ["Database", "Supabase PostgreSQL with Row Level Security."],
        ].map(([title, description]) => (
          <Box key={title} p={6} bg="white" borderWidth="1px" rounded="xl">
            <Heading size="md" mb={2}>
              {title}
            </Heading>
            <Text color="gray.600">{description}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Stack>
  );
}