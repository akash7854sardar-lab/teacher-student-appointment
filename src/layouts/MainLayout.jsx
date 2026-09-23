import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <Box minH="100vh">
      <Navbar />
      <Box maxW="1100px" mx="auto" px={5} py={8}>
        {children}
      </Box>
    </Box>
  );
}