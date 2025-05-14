import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NextLink from "next/link";
import { RiSquareFill } from "@remixicon/react";

import NavigationMobile from "./NavigationMobile";

import { PageNameContext } from "@/context/PageNameContext";

import { useContext } from "react";

export default function Navigation() {
  const { t } = useTranslation("main");
  const { i18n } = useTranslation();

  const { pageName, setPageName } = useContext(PageNameContext);

  const renderName = () => {
    switch (pageName) {
      case "rfws":
        return (
          <NextLink href="https://rfws.studio">
            <RiSquareFill className="inline w-3" /> {pageName}
          </NextLink>
        );
      case "robert schnüll":
        return (
          <NextLink href="https://robertschnuell.de/portfolio">
             <RiSquareFill className="inline w-3" /> {pageName}
          </NextLink>
        );

      default:
        return (
          <NextLink href="/portfolio">
            <RiSquareFill className="inline w-3" /> {pageName}
          </NextLink>
        );
    }
  };

  return (
    <header className="flex flex-col items-center justify-between w-full h-12 font-normal  md:flex-row md:justify-between">
     <h1>rfws</h1>
     <h2>share</h2>
    </header>
  );
}
