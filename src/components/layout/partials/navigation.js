import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NextLink from "next/link";
import { RiSquareFill } from "@remixicon/react";

import { PageNameContext } from "@/context/PageNameContext";
import { useContext } from "react";
import { useRouter } from "next/router";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default function Navigation() {
  const { t } = useTranslation("main");
  const { i18n } = useTranslation();
  const { pageName, setPageName } = useContext(PageNameContext);
  const router = useRouter();

  // Breadcrumbs logic
  const pathSegments = router.asPath.split("?")[0].split("/").filter(Boolean);
  const breadcrumbs = [];
  let href = "";
  pathSegments.forEach((segment, idx) => {
    href += "/" + segment;
    breadcrumbs.push({
      label: segment,
      href,
      isLast: idx === pathSegments.length - 1,
    });
  });

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
    <header className="flex flex-col items-center justify-between w-full font-normal md:flex-row md:justify-between">
      <div className="flex flex-col md:flex-row md:items-center w-full">
        <div className="flex items-center gap-4">
          <h1>rfws</h1>
          <h2>share</h2>
        </div>
        <Breadcrumb className="ml-0 md:ml-8 mt-2 md:mt-0">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, idx) => (
              <BreadcrumbItem key={crumb.href}>
                <BreadcrumbLink asChild>
                  <NextLink href={crumb.href} aria-current={crumb.isLast ? "page" : undefined}>
                    {crumb.label}
                  </NextLink>
                </BreadcrumbLink>
                {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
