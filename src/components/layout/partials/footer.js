import React from "react";
import { Separator } from "@/components/ui/separator";
import NextLink from "next/link";
import { RiGithubFill } from "@remixicon/react";

export default function Footer() {
  return (
    <footer className="w-full ">

      <div className="flex flex-row items-center justify-between w-full  py-4 text-xs">

        <div className="flex items-center">
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            title="Creative Commons BY-SA 4.0"
            className="flex items-center"
          >
            <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="CC" className="h-6 w-6 mr-1" />
            <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="BY" className="h-6 w-6 mr-1" />
            <img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="SA" className="h-6 w-6" />
          </a>
        </div>
       
        <div className="flex items-center gap-2 flex-col ">

          <NextLink href="https://github.com/rfws" target="_blank" rel="noopener noreferrer" className="ml-2">
            <RiGithubFill className="w-6 h-6" />
          </NextLink>
        </div>
      </div>
    </footer>
  );
}
