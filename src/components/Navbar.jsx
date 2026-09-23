import { Box, Button, Flex, Heading, Spacer } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  async function handleLogout() {
    await dispatch(logout());
    navigate("/login", { replace: true });
  }

  return (
    <Box borderBottomWidth="1px" bg="white">
      <Flex maxW="1100px" mx="auto" px={5} py={4} align="center">
        <Heading size="md">
          <Link to="/">My App</Link>
        </Heading>
        <Spacer />
        {user ? (
          <Button size="sm" colorPalette="red" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Flex gap={2}>
            <Button asChild size="sm" variant="ghost">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="sm" colorPalette="blue">
              <Link to="/register">Register</Link>
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}