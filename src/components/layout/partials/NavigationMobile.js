import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import NextLink from "next/link";
import { useRouter } from "next/router";
import { RiMenuLine, RiSquareFill } from "@remixicon/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const NavigationMobile = () => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <div className="flex items-center justify-between w-full mt-4">
        <h1 className="flex-grow text-1xl">
          <NextLink href="/portfolio">
            <RiSquareFill className="inline w-3" /> rfws
          </NextLink>
        </h1>
        <RiMenuLine
          className="w-6"
          onClick={() => {
            setOpen(!open);
          }}
        />
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="top" className="border-none bg-background pt-4">
          <h1 className="col-span-1 text-1xl mb-6">
            <NextLink href="/portfolio">
              <RiSquareFill className="inline w-3" /> rfws
            </NextLink>
          </h1>
          <ul className="flex flex-col">
            <li>
              <NextLink href="/info">info</NextLink>
            </li>
            <li>
              <NextLink href="/continuum">continuum</NextLink>
            </li>
            <li>
              <NextLink href="/archive">index</NextLink>
            </li>
            <li>
              <NextLink href="/contact">contact</NextLink>
            </li>
          </ul>
          <Button className="ml-auto p-0 mt-4" variant="ghost">
            EN
          </Button>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NavigationMobile;
