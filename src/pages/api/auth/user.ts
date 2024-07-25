import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");

    if (!accessToken || !refreshToken) {
      return new Response(JSON.stringify({ user: null }));
    }

    const { data, error } = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });

    const { user } = data;

    if (!user) {
      return new Response(JSON.stringify({ user: null }));
    } else if (error) {
      throw Error("Error occured", { cause: error });
    }

    const email = user.email as string;
    const name = user.user_metadata.name as string | undefined;
    const image = user.user_metadata.picture as string | undefined;

    return new Response(
      JSON.stringify({
        user: { id: user.id, name: name ?? email[0] + email[1], image },
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        user: null,
      }),
      {
        status: 500,
        statusText: "Something went wrong",
      }
    );
  }
};
