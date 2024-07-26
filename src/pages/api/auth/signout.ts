// With `output: 'hybrid'` configured:
// export const prerender = false;
import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const { error } = await supabase.auth.signOut()
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  return redirect("/");
};