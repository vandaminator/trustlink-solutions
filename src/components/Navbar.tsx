import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Menu } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import type { navUser } from "@/lib/types";

function Navbar() {
  const [user, setUser] = useState<navUser>();
  const [open, setOpen] = useState(false);

  const closeNav = () => setOpen(false);
  const signOut = () => {
    sessionStorage.removeItem("user");
    window.location.reload()
  };

  useEffect(() => {
    const dbUser = sessionStorage.getItem("user");
    if (dbUser) {
      const info = JSON.parse(dbUser) as navUser;
      setUser(info);
      return;
    }

    const cookies = document.cookie.split("; ").map((v) => {
      const prop = v.split("=");
      return { key: prop[0], value: prop[1] };
    });

    const accessToken = cookies.find((v) => v.key === "sb-access-token");
    const refreshToken = cookies.find((v) => v.key === "sb-refresh-token");

    if (accessToken && refreshToken) {
      console.log("fresh");
      const load = async () => {
        const response = await fetch("/api/auth/user");
        if (response.ok) {
          const data: { user?: navUser } = await response.json();
          sessionStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }
      };

      load();
    }
  }, []);

  const links = [
    { href: "/plans", text: "Plans" },
    // { href: "/companies", text: "Companies" },
    { href: "/about", text: "About" },
  ];
  return (
    <header className="bg-black">
      <nav className="flex p-4 justify-between items-center bg-black text-white md:text-lg lg:text-xl md:w-[700px] lg:w-[1000px] xl:w-[1200px] mx-auto">
        <a href="/" className="flex" aria-label="TrustLink Solutions">
          <img
            src="/logo.png"
            alt="TrustLink Solutions"
            width={48}
            className="md:w-[60px] lg:w-[80px]"
          />
        </a>

        {/* Desktop */}
        <div className="max-md:hidden flex gap-3 lg:gap-5 font-bold">
          {links.map((l) => (
            <a href={l.href} key={l.href}>
              {l.text}
            </a>
          ))}
        </div>
        <div className="max-md:hidden">
          {user ? (
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <button>
                    <Avatar>
                      <AvatarImage
                        src={user.image}
                        alt={user.name.slice(0, 2)}
                      />
                      <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <p className="mb-4 font-bold">Hello {user.name}</p>
                  <Button className="font-bold" onClick={signOut} asChild>
                    <a href="/api/auth/signout">
                      Sign Out
                    </a>
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div>
              <form
                action="/api/auth/signin"
                method="post"
                data-astro-reload
                className="flex gap-3 justify-stretch"
              >
                <Button
                  className="grow font-semibold gap-3"
                  variant={"secondary"}
                  value="google"
                  name="provider"
                  type="submit"
                >
                  <img src="/google.svg" alt="google" width={18} />
                  Signup
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
              <Menu size={34} />
            </SheetTrigger>
            <SheetContent className="bg-black text-white border-black ">
              <SheetHeader className="hidden">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Links for navigation</SheetDescription>
              </SheetHeader>
              <aside className="pt-10">
                {links.map((l) => (
                  <div key={l.text}>
                    <a className="text-lg" href={l.href} onClick={closeNav}>
                      {l.text}
                    </a>
                    <Separator className="bg-white/60 my-4" />
                  </div>
                ))}
                {user && (
                  <div>
                    <a className="text-lg" href={"/account"} onClick={closeNav}>
                      Account
                    </a>
                    <Separator className="bg-white/60 my-4" />
                  </div>
                )}
              </aside>
              <SheetFooter>
                {user ? (
                  <div className="flex">
                    <Button
                      className="grow font-semibold"
                      variant={"secondary"}
                      asChild
                    >
                      <a href="/api/auth/signout" onClick={signOut}>
                        Sign Out
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <form
                      action="/api/auth/signin"
                      method="post"
                      data-astro-reload
                      className="flex gap-3 justify-stretch"
                    >
                      <Button
                        className="grow font-semibold gap-3"
                        variant={"secondary"}
                        value="google"
                        name="provider"
                        type="submit"
                        onClick={closeNav}
                      >
                        <img src="/google.svg" alt="google" width={18} />
                        Signup
                      </Button>
                    </form>
                  </div>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
