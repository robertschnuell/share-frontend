import NextLink from "next/link";
import { useRouter } from "next/router";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";
import getConfig from "next/config";
import { useEffect, useState } from "react";
import { RiMoonLine, RiSunLine } from "@remixicon/react";

export default function Navigation() {
  const router = useRouter();
  const config = getConfig().publicRuntimeConfig;

  // Dark mode toggle logic
  const [darkMode, setDarkMode] = useState(false);

  // On mount, set darkMode from localStorage, default to false (light mode)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("darkMode");
      const root = window.document.documentElement;
      if (stored === "true") {
        setDarkMode(true);
        root.classList.add("dark");
        root.style.setProperty("--background", "255 255 255");
        root.style.setProperty("--foreground", "12 12 12");
      } else {
        setDarkMode(false);
        root.classList.remove("dark");
        root.style.setProperty("--background", "12 12 12");
        root.style.setProperty("--foreground", "255 255 255");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      if (darkMode) {
        root.classList.remove("dark");
        root.classList.remove("light");
        setDarkMode(false);
        localStorage.setItem("darkMode", "false");
        // Set dark mode variables (default)
        root.style.setProperty("--background", "12 12 12");
        root.style.setProperty("--foreground", "0 0% 89%");
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
        setDarkMode(true);
        localStorage.setItem("darkMode", "true");
        // Set light mode variables (from .light in styles.css)
        root.style.setProperty("--background", "255 255 255");
        root.style.setProperty("--foreground", "0 0% 12%");
      }
    }
  };

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

  return (
    <header className="w-full font-normal mt-8">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="flex justify-start md:justify-end mb-2 md:mb-0 order-1 md:order-2">
          <button
            type="button"
            aria-label="Toggle dark mode"
            className="rounded-full p-2 border border-muted bg-background text-foreground hover:bg-muted transition"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <RiSunLine className="w-3 h-3" />
            ) : (
              <RiMoonLine className="w-3 h-3" />
            )}
          </button>
        </div>
        <div className="order-2 md:order-1">
          <Breadcrumb className="ml-0 md:ml-0 mt-2 md:mt-0">
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
      </div>
    </header>
  );
}
