import React, { useEffect, useState } from "react";
import SiteHeader from "@/components/layout/partials/SiteHeader";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/router";

const URL = "/data/collection.json";

const CollectionPage = () => {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((d) => {
        console.log(d);
        setData(d);
      });
  }, []);

  return (
    <div>
      <SiteHeader title={data?.title} subtitle={data?.program} bottomRight={data?.location} />
      <Table>
        <TableBody>
          {data.content &&
            data.content.length > 0 &&
            data.content.map((item) => (
              <TableRow key={item.id} className="bg-background">
                <TableCell
                  className="py-2 cursor-pointer"
                  onClick={() => router.push(`${router.asPath.replace(/\/$/, "")}/${item.id}`)}
                >
                  {item.title}
                </TableCell>
                <TableCell
                  className="py-2 text-right cursor-pointer"
                  onClick={() => router.push(`${router.asPath.replace(/\/$/, "")}/${item.id}`)}
                >
                  {item.term}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CollectionPage;
