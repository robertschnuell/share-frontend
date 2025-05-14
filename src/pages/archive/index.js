import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { RiExpandDiagonal2Line, RiArrowRightLine } from "@remixicon/react";

import { useEffect, useState } from "react";

import getConfig from "next/config";

import NextLink from "next/link";

const ArchivePage = () => {
  const [data, setData] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverCategory, setHoverCategory] = useState(null);

  const categories = [
    { heading: "Topics", template: "cluster", textKey: "introTextClusters" },
    { heading: "Projects", template: "project", textKey: "introTextProjects" },
    {
      heading: "Publications/ Texts",
      template: "publication",
      textKey: "introTextTexts",
    },
    { heading: "Talks", template: "talk", textKey: "introTextTalks" },
    { heading: "Teaching", template: "teaching", textKey: "introTextTeaching" },
    { heading: "Early Works", template: "legacy", textKey: "introTextLegacy" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://${getConfig().publicRuntimeConfig.api.host}/archive.json`
        );

        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const renderTable = ({ data = [], title }) => {
    let d = data.map((item) => {
      if (!item.year && item.beginningYear) {
        item.year = item.beginningYear;
      }
      return item;
    });
    d = [...d].sort((a, b) => b.year - a.year);

    return (
      <Table>
        <TableHeader className="py-0">
          <TableRow className="font-normal text-xs pt-0 ">
            <TableHead className="w-[100px] text-left font-normal text-xs px-0 pt-0">Year</TableHead>
            <TableHead className="text-left px-0 pt-0">Name</TableHead>
            <TableHead className="text-left px-0 pt-0">{d.some((i) => i?.tags?.length > 0) ? "Tags" : ""}</TableHead>
            <TableHead className="text-left px-0 pt-0"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {d.map((item, index) => (
            <TableRow
              key={index}
              className={`text-xs p-0 cursor-pointer ${item.disabled === "true" ? "opacity-50" : ""}`}
              onMouseEnter={() => {
                item.titleImage.length > 0 ? setHoverCategory(title) : setHoverCategory(null);
                setHoveredItem(item);
              }}
              onMouseLeave={() => {
                setHoverCategory(null);
                setHoveredItem(null);
              }}
            >
              <TableCell className="py-2 px-0 flex justify-between  flex-shrink-0 w-[100px]">

                <NextLink
                  className={` ${item.disabled !== "true" ? "" : "cursor-not-allowed"}`}
                  href={item.disabled !== "true" ? item?.id : "#"}
                >
                  {item?.beginningYear && !item?.endingYear ? "since " : ""}
                  {item?.beginningYear}
                  {item?.endingYear ? "–" : ""}
                  {item?.endingYear}
                  {item?.year && !item?.beginningYear && !item?.endingYear ? item?.year : ""}
                </NextLink>
              </TableCell>
              <TableCell className="py-2 px-0 flex-grow">
                <NextLink
                  className={` ${item.disabled !== "true" ? "" : "cursor-not-allowed"}`}
                  href={item.disabled !== "true" ? item?.id : "#"}
                >
                  {item?.title}{" "}
                </NextLink>
              </TableCell>
              <TableCell className="py-2 px-0 flex-grow">
                <NextLink
                  className={` ${item.disabled !== "true" ? "" : "cursor-not-allowed"}`}
                  href={item.disabled !== "true" ? item?.id : "#"}
                >
                  {item?.tags}{" "}
                </NextLink>
              </TableCell>
              <TableCell className="py-2 px-0 flex-shrink-0 justify-end px-0 w-10 text-right">
                {item.disabled !== "true" && (
                  <NextLink href={item?.id}>
                    <RiArrowRightLine className="h-4 w-auto" />
                  </NextLink>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="w-full">
      {data &&
        data.clusters &&
        categories.map((category, index) => (
          <article className=" flex flex-col md:grid md:grid-cols-12 gap-8 mt-24" key={index}>
            <div className="col-span-4 relative flex flex-col items-center">
              <div className="w-full h-full">
                <h3 className="text-2xl font-normal">{category.heading}</h3>
                <div className="h-full ">
                  <div className="sticky top-14 ">
                    {!(hoverCategory === category.heading) && <div>{data[category.textKey]}</div>}
                    {hoveredItem &&
                      hoveredItem.template === category.template &&
                      hoveredItem.titleImage &&
                      hoveredItem.titleImage.length > 0 && (
                        <div className="flex justify-center items-center h-auto mt-4">
                          <img src={hoveredItem.titleImage[0]} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-6 col-start-7">
              {renderTable({
                title: category.heading,
                data: [...data["clusters"], ...data["entries"]].filter((item) => item.template === category.template),
              })}
            </div>
          </article>
        ))}
    </div>
  );
};

export default ArchivePage;
