import { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentProfile();
  }, []);

  async function loadStudentProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("student_details")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setStudent(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Box p={8}>
        <Text>Loading profile...</Text>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box maxW="900px" mx="auto" p={8}>
        <Stack gap={4} align="center">
          <Heading>No profile found</Heading>

          <Button
            colorPalette="blue"
            onClick={() => navigate("/student-details")}
          >
            Create Profile
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box maxW="1000px" mx="auto" p={{ base: 4, md: 8 }}>
      <Stack gap={6}>

        {/* PROFILE HEADER */}
        <Box
          borderWidth="1px"
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
          bg="white"
        >
          <Stack
            direction={{ base: "column", md: "row" }}
            align={{ base: "center", md: "center" }}
            gap={6}
          >
            <Avatar.Root size="2xl">
              {student.avatar_url && (
                <Avatar.Image
                  src={student.avatar_url}
                  alt={student.display_name}
                />
              )}

              <Avatar.Fallback>
                {student.display_name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </Avatar.Fallback>
            </Avatar.Root>

            <Stack
              gap={2}
              textAlign={{ base: "center", md: "left" }}
              flex="1"
            >
              <Heading size="2xl">
                {student.display_name || "Your Name"}
              </Heading>

              <Text color="gray.500" fontSize="lg">
                {student.course || "Student"}
              </Text>

              {student.institution && (
                <Text color="gray.500">
                  {student.institution}
                </Text>
              )}

              <Stack
                direction="row"
                justify={{ base: "center", md: "flex-start" }}
                gap={3}
                mt={2}
              >
                {student.qualification && (
                  <Badge colorPalette="blue">
                    {student.qualification}
                  </Badge>
                )}

                {student.passing_year && (
                  <Badge colorPalette="green">
                    {student.passing_year}
                  </Badge>
                )}
              </Stack>
            </Stack>

            <Button
              colorPalette="blue"
              onClick={() => navigate("/student-details")}
            >
              Edit Profile
            </Button>
          </Stack>
        </Box>

        {/* PERSONAL INFORMATION */}
        <Box
          borderWidth="1px"
          borderRadius="2xl"
          p={{ base: 5, md: 8 }}
          bg="white"
        >
          <Heading size="lg" mb={6}>
            Personal Information
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <InfoItem
              label="Full Name"
              value={student.display_name}
            />

            <InfoItem
              label="Phone"
              value={student.phone}
            />

            <InfoItem
              label="Date of Birth"
              value={student.date_of_birth}
            />

            <InfoItem
              label="Gender"
              value={student.gender}
            />

            <InfoItem
              label="City"
              value={student.city}
            />

            <InfoItem
              label="State"
              value={student.state}
            />

            <InfoItem
              label="Postal Code"
              value={student.postal_code}
            />

            <InfoItem
              label="Country"
              value={student.country}
            />

            <InfoItem
              label="Address"
              value={student.address}
              full
            />
          </SimpleGrid>
        </Box>

        {/* EDUCATION */}
        <Box
          borderWidth="1px"
          borderRadius="2xl"
          p={{ base: 5, md: 8 }}
          bg="white"
        >
          <Heading size="lg" mb={6}>
            Educational Information
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <InfoItem
              label="Qualification"
              value={student.qualification}
            />

            <InfoItem
              label="Course"
              value={student.course}
            />

            <InfoItem
              label="Specialization"
              value={student.specialization}
            />

            <InfoItem
              label="Institution"
              value={student.institution}
            />

            <InfoItem
              label="University"
              value={student.university}
            />

            <InfoItem
              label="Passing Year"
              value={student.passing_year}
            />

            <InfoItem
              label="Percentage"
              value={
                student.percentage
                  ? `${student.percentage}%`
                  : null
              }
            />
          </SimpleGrid>
        </Box>

      </Stack>
    </Box>
  );
}

function InfoItem({ label, value, full = false }) {
  return (
    <Box gridColumn={full ? "1 / -1" : undefined}>
      <Text
        fontSize="sm"
        color="gray.500"
        fontWeight="medium"
        mb={1}
      >
        {label}
      </Text>

      <Text fontSize="md" fontWeight="semibold">
        {value || "Not provided"}
      </Text>
    </Box>
  );
}