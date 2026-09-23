import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Field,
  Heading,
  Input,
  Link as ChakraLink,
  Stack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login, clearError } from "../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    }
  }, [user, navigate, location.state]);

  async function handleSubmit(event) {
    event.preventDefault();
    await dispatch(login({ email, password }));
  }

  return (
    <Box maxW="440px" mx="auto" py={10}>
      <Stack gap={6}>
        <Box>
          <Heading size="xl">Welcome back</Heading>
        </Box>

        {error && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap={5}>
            <Field.Root required>
              <Field.Label>Email</Field.Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Password</Field.Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field.Root>

            <Button
              type="submit"
              colorPalette="blue"
              loading={loading}
              width="full"
            >
              Sign in
            </Button>
          </Stack>
        </form>

        <ChakraLink asChild color="blue.600">
          <Link to="/register">Don't have an account? Register</Link>
        </ChakraLink>
      </Stack>
    </Box>
  );
}