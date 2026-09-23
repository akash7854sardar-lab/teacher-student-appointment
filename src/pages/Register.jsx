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
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearError, register } from "../features/auth/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await dispatch(register({ fullName, email, password }));

    if (register.fulfilled.match(result) && !result.payload.session) {
      navigate("/login", { replace: true });
    }
  }

  return (
    <Box maxW="440px" mx="auto" py={10}>
      <Stack gap={6}>
        <Box>
          <Heading size="xl">Create account</Heading>
          <Text color="gray.600" mt={2}>
            Start with your name, email, and a secure password.
          </Text>
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
              <Field.Label>Full name</Field.Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </Field.Root>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </Field.Root>

            <Button
              type="submit"
              colorPalette="blue"
              loading={loading}
              width="full"
            >
              Create account
            </Button>
          </Stack>
        </form>

        <ChakraLink asChild color="blue.600">
          <Link to="/login">Already have an account? Sign in</Link>
        </ChakraLink>
      </Stack>
    </Box>
  );
}