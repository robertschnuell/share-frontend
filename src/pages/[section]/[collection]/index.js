import React, { useEffect, useState } from "react";
import SiteHeader from "@/components/layout/partials/SiteHeader";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/router";
import getConfig from "next/config";



const CollectionPage = () => {

  const router = useRouter();
  const section = router?.query?.section || "";
  const collection = router?.query?.collection || "";
  const [data, setData] = useState({});

  const lang = "de"

  const config = getConfig().publicRuntimeConfig;

  useEffect(() => {
    if (section && collection) {
      const fetchData = async () => {
        try {
          const url = `${config.api.host}:${config.api.port}/${section}/${collection}.json`;
          console.log("url", url);
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            console.log(data)
            setData(data);
          } else {
            setData({ error: "Failed to fetch data" });
          }
        } catch (err) {
          setData({ error: err.message });
        }
      };
      fetchData();
    }
  }, [section, collection, config]);

  // Helper to format date as DD.MM.YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    return d.toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Generate date string based on language and begin/end fields
  const generateDate = () => {
    const begin = data?.[lang]?.begin || data?.begin || "";
    const end = data?.[lang]?.end || data?.end || "";
    if (!begin) return "";
    const beginStr = formatDate(begin);
    const endStr = end ? formatDate(end) : "";
    return endStr ? `${beginStr} – ${endStr}` : beginStr;
  }




  return (
    <div>
      <SiteHeader
        title={data?.[lang]?.name}
        subtitle={data?.[lang]?.subtitle}
        bottomRight={data?.[lang]?.location}
        topRight={generateDate()}
      />
      <Table>
        <TableBody>
          {data.children &&
            Object.values(data.children).length > 0 &&
            Object.values(data.children).map((child) => {
              const translation = child.translations?.[lang]?.content;
              const content = translation || child.content || {};
              return (
                <TableRow key={child.id} className="bg-background">
                  <TableCell
                    className="py-2 px-0 cursor-pointer"
                    onClick={() => router.push(`${router.asPath.replace(/\/$/, "")}/${child.slug}`)}
                  >
                    {content.title}
                  </TableCell>
                  <TableCell
                    className="py-2 text-right cursor-pointer"
                    onClick={() => router.push(`${router.asPath.replace(/\/$/, "")}/${child.slug}`)}
                  >
                    {content.term || ""}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CollectionPage;
