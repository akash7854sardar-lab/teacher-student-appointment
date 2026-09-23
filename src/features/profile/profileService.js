import { supabase } from "../../lib/supabase";

export async function getMyProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, created_at, updated_at")
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateMyProfile(userId, updates) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: updates.full_name,
      avatar_url: updates.avatar_url || null,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}