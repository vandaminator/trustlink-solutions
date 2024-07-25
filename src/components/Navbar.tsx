import { userStore } from "@/userStore";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

function Navbar() {
  const $userStore = useStore(userStore);

  useEffect(() => {
    const cookies = document.cookie.split("; ").map((v) => {
      const prop = v.split("=");
      return { key: prop[0], value: prop[1] };
    });

    const accessToken = cookies.find((v) => v.key === "sb-access-token");
    const refreshToken = cookies.find((v) => v.key === "sb-refresh-token");

    if (accessToken && refreshToken && !$userStore) {
      const load = async () => {
        const response = await fetch("/api/auth/user");
        if (response.ok) {
          const data: {
            user: {
              id: string;
              name: string;
              image?: string;
            } | null;
          } = await response.json();
          userStore.set(data.user);
        }
      };

      load();
    }
  });
  return (
    <nav className="flex p-4 justify-between">
      <a href="/" className="">
        TrustLink Solutions
      </a>

      {$userStore ? <p>{$userStore.name}</p> : <p>sign in</p>}
    </nav>
  );
}

export default Navbar;
