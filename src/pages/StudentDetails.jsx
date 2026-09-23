import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Field,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const initialForm = {
  display_name: "",
  phone: "",
  date_of_birth: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",

  qualification: "",
  course: "",
  specialization: "",
  institution: "",
  university: "",
  passing_year: "",
  percentage: "",

  avatar_url: "",
};

export default function StudentDetails() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadStudentDetails();
  }, []);

  async function loadStudentDetails() {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      navigate("/login");
      return;
    }

    setUser(user);

    const { data, error } = await supabase
      .from("student_details")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error(error);
      setMessage("Unable to load student details.");
    } else if (data) {
      setForm({
        display_name: data.display_name || "",
        phone: data.phone || "",
        date_of_birth: data.date_of_birth || "",
        gender: data.gender || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        postal_code: data.postal_code || "",
        country: data.country || "India",

        qualification: data.qualification || "",
        course: data.course || "",
        specialization: data.specialization || "",
        institution: data.institution || "",
        university: data.university || "",
        passing_year: data.passing_year || "",
        percentage: data.percentage || "",

        avatar_url: data.avatar_url || "",
      });
    }

    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
async function handleImageUpload(event) {
  try {
    const file = event.target.files?.[0];

    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Image must be smaller than 2MB.");
      return;
    }

    setUploading(true);
    setMessage("");

    const filePath = `${user.id}/profile`;

    // 1. Remove old photo from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove([filePath]);

    if (deleteError) {
      console.error("Old image delete error:", deleteError);
    }

    // 2. Upload new photo
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      throw uploadError;
    }

    // 3. Get new public URL
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const newAvatarUrl = `${publicUrl}?t=${Date.now()}`;

    // 4. Save URL in student_details
    const { error: updateError } = await supabase
      .from("student_details")
      .update({
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      throw updateError;
    }

    setForm((prev) => ({
      ...prev,
      avatar_url: newAvatarUrl,
    }));

    setMessage("Profile photo updated successfully.");
  } catch (error) {
    console.error(error);
    setMessage(error.message || "Image upload failed.");
  } finally {
    setUploading(false);
    event.target.value = "";
  }
}

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("student_details")
      .update({
        display_name: form.display_name,
        phone: form.phone,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender,
        address: form.address,
        city: form.city,
        state: form.state,
        postal_code: form.postal_code,
        country: form.country,

        qualification: form.qualification,
        course: form.course,
        specialization: form.specialization,
        institution: form.institution,
        university: form.university,
        passing_year: form.passing_year
          ? Number(form.passing_year)
          : null,
        percentage: form.percentage
          ? Number(form.percentage)
          : null,

        avatar_url: form.avatar_url || null,

        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      setMessage(error.message);
    } else {
      setMessage("Student profile saved successfully.");
    }

    setSaving(false);
  }

  if (loading) {
    return <Box p={8}>Loading...</Box>;
  }

  return (
    <Box maxW="900px" mx="auto" p={{ base: 4, md: 8 }}>
      <Stack gap={8}>
        <Stack gap={1}>
          <Heading size="xl">Student Profile</Heading>
          <Text color="gray.500">
            Manage your personal and educational information.
          </Text>
        </Stack>

        {/* PROFILE IMAGE */}
        <Box
          p={6}
          borderWidth="1px"
          borderRadius="xl"
          bg="white"
        >
          <Stack
            direction={{ base: "column", sm: "row" }}
            align={{ base: "center", sm: "center" }}
            gap={5}
          >
            <Avatar.Root size="2xl">
              {form.avatar_url && (
                <Avatar.Image
                  src={form.avatar_url}
                  alt={form.display_name}
                />
              )}
              <Avatar.Fallback>
                {form.display_name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar.Fallback>
            </Avatar.Root>

            <Stack gap={2}>
              <Heading size="md">Profile Photo</Heading>

              <Text fontSize="sm" color="gray.500">
                JPG, PNG or WEBP. Maximum 2MB.
              </Text>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />

              <Button
                colorPalette="blue"
                loading={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
            </Stack>
          </Stack>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack gap={8}>
            {/* PERSONAL INFORMATION */}
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="xl"
              bg="white"
            >
              <Stack gap={5}>
                <Heading size="lg">Personal Information</Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                  <Field.Root>
                    <Field.Label>Display Name</Field.Label>
                    <Input
                      name="display_name"
                      value={form.display_name}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Phone</Field.Label>
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Date of Birth</Field.Label>
                    <Input
                      type="date"
                      name="date_of_birth"
                      value={form.date_of_birth}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Gender</Field.Label>
                    <Input
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>City</Field.Label>
                    <Input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>State</Field.Label>
                    <Input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Postal Code</Field.Label>
                    <Input
                      name="postal_code"
                      value={form.postal_code}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Country</Field.Label>
                    <Input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                    />
                  </Field.Root>
                </SimpleGrid>

                <Field.Root>
                  <Field.Label>Address</Field.Label>
                  <Textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </Field.Root>
              </Stack>
            </Box>

            {/* EDUCATION */}
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="xl"
              bg="white"
            >
              <Stack gap={5}>
                <Heading size="lg">Educational Information</Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                  <Field.Root>
                    <Field.Label>Qualification</Field.Label>
                    <Input
                      name="qualification"
                      value={form.qualification}
                      onChange={handleChange}
                      placeholder="e.g. B.Tech"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Course</Field.Label>
                    <Input
                      name="course"
                      value={form.course}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Specialization</Field.Label>
                    <Input
                      name="specialization"
                      value={form.specialization}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Institution</Field.Label>
                    <Input
                      name="institution"
                      value={form.institution}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>University</Field.Label>
                    <Input
                      name="university"
                      value={form.university}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Passing Year</Field.Label>
                    <Input
                      type="number"
                      name="passing_year"
                      value={form.passing_year}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Percentage</Field.Label>
                    <Input
                      type="number"
                      step="0.01"
                      name="percentage"
                      value={form.percentage}
                      onChange={handleChange}
                    />
                  </Field.Root>
                </SimpleGrid>
              </Stack>
            </Box>

            {message && (
              <Text color="green.600">
                {message}
              </Text>
            )}

            <Stack direction={{ base: "column", sm: "row" }}>
              <Button
                type="submit"
                colorPalette="blue"
                loading={saving}
              >
                Save Profile
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}