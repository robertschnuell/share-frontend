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
    <header className="w-full font-normal mt-8">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center">
        <h1 className="font-bold md:font-normal mb-2 md:mb-0 order-1 md:order-2 text-left md:text-right">
          {config?.app?.name || "share"}
        </h1>
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
