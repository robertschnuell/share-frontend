import React from "react";
import { Separator } from "@/components/ui/separator";
import NextLink from "next/link";
import {
  RiGithubFill,
  RiCreativeCommonsFill,
  RiCreativeCommonsByFill,
  RiCreativeCommonsSaFill
} from "@remixicon/react";

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
            <RiCreativeCommonsFill className="h-4 w-4 mr-1" />
            <RiCreativeCommonsByFill className="h-4 w-4 mr-1" />
            <RiCreativeCommonsSaFill className="h-4 w-4" />
          </a>
        </div>
        <div className="flex items-center gap-2 flex-col ">
          <NextLink href="https://github.com/robertschnuell/share-frontend" target="_blank" rel="noopener noreferrer" className="ml-2">
            <RiGithubFill className="w-4 h-4" />
          </NextLink>
        </div>
      </div>
    </footer>
  );
}
