import NextLink from "next/link";

import { useRouter } from "next/router";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";
import getConfig from "next/config";

export default function Navigation() {
  const router = useRouter();
  const config = getConfig().publicRuntimeConfig;

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
    <header className="flex flex-col items-center justify-between w-full font-normal md:flex-row md:justify-between mt-8">
      <div>
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
      <h1 className="font-normal">{config?.app?.name || "share"}</h1>
    </header>
  );
}
