import { userStore } from "@/userStore";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
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

  const links = [
    { href: "/plans", text: "Plans" },
    { href: "/company", text: "Company" },
    { href: "/about", text: "About" },
  ];
  return (
    <header className="bg-black">
      <nav className="flex p-4 justify-between items-center bg-black text-white md:text-lg lg:text-xl md:w-[700px] lg:w-[1000px] xl:w-[1200px] mx-auto">
        <a href="/" className="flex" aria-label="TrustLink Solutions">
          <img src="/logo.png" alt="TrustLink Solutions" width={48} className="md:w-[60px] lg:w-[80px]" />
        </a>

        {/* Desktop */}
        <div className="max-md:hidden flex gap-3 lg:gap-5 font-bold">
          {links.map((l) => (
            <a href={l.href}>{l.text}</a>
          ))}
        </div>
        <div className="max-md:hidden">
          {$userStore ? (
            <div>
              <Popover>
                <PopoverTrigger>
                  <Avatar>
                    <AvatarImage
                      src={$userStore.image}
                      alt={$userStore.name.slice(0, 2)}
                    />
                    <AvatarFallback>
                      {$userStore.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent>
                  <p className="mb-4 font-bold">Hello {$userStore.name}</p>
                  <Button className="font-bold" asChild>
                    <a href="/api/auth/signout">Sign Out</a>
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
          <Sheet>
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
                    <a className="text-lg" href={l.href}>
                      {l.text}
                    </a>
                    <Separator className="bg-white/60 my-4" />
                  </div>
                ))}
                {$userStore && (
                  <div>
                    <a className="text-lg" href={"/account"}>
                      Account
                    </a>
                    <Separator className="bg-white/60 my-4" />
                  </div>
                )}
              </aside>
              <SheetFooter>
                {$userStore ? (
                  <div className="flex">
                    <Button
                      className="grow font-semibold"
                      variant={"secondary"}
                      asChild
                    >
                      <a href="/api/auth/signout">Sign Out</a>
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
