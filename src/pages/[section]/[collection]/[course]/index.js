import React, { useEffect, useState } from "react";
import SiteHeader from "@/components/layout/partials/SiteHeader";
import SessionCards from "@/components/layout/partials/SessionCards";
import { Card } from "@/components/ui/card";
import { RiExpandDiagonalLine } from "@remixicon/react";
import { useRouter } from "next/router";
import DictionaryView from "@/components/layout/partials/DictionaryView";
import getConfig from "next/config";



const CoursePage = () => {

  const router = useRouter();
  const section = router?.query?.section || "";
  const collection = router?.query?.collection || "";
  const course = router?.query?.course || "";
  const [data, setData] = useState({});


  const lang = "de"

  const config = getConfig().publicRuntimeConfig;

  useEffect(() => {
    if (section && collection) {
      const fetchData = async () => {
        try {
          const url = `${config.api.host}:${config.api.port}/${section}/${collection}/${course}.json`;
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




  const [oldData, setOldData] = useState([]);
  const [dictionary, setDictionary] = useState([]);


  useEffect(() => {


    fetch("/data/cad-2d-3d_dictionary.json")
      .then((res) => res.json())
      .then((dict) => {
        const arr = Object.entries(dict).map(([term, value]) => ({
          term,
          description: value.description,
          tags: value.tags,
        }));
        setDictionary(arr);
      });
  }, []);

  return (
    <div>
      <SiteHeader title={oldData?.title} subtitle={oldData?.term} />

      <SessionCards
        title="sessions"
        content={
          data.children
            ? Object.values(data.children)
                .map((child) => {
                  const translation = child.translations?.[lang]?.content;
                  return {...translation, ...{titleimage:child?.titleimage, id: child.slug}} || child.content || {};
                })
                .sort((a, b) => {
                  const kwA = parseInt(a.kw) || 0;
                  const kwB = parseInt(b.kw) || 0;
                  return kwA - kwB;
                })
            : []
        }
      />

      <section className="grid grid-cols-1 md:grid-cols-10 gap-12 mt-12 w-full max-h-[80vh] md:max-h-[50vh]">
        <div className="md:col-span-3 flex flex-col h-full">
          <div className="mb-3 font-semibold text-muted flex items-center justify-between">
            <span>semesterthema</span>
            <button
              type="button"
              className="ml-auto flex items-center justify-center h-6"
              title="Expand Dictionary"
              onClick={() => router.push(`${router.asPath.replace(/\/$/, "")}/briefing`)}
            >
              <span className="sr-only">Expand Dictionary</span>
              <RiExpandDiagonalLine className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <Card className="rounded-xl border border-muted bg-background p-4 md:p-6 flex-1 h-full min-h-0 flex items-center justify-center">
            <img src="/assets/briefing.png" alt="Briefing" className="max-h-full max-w-full object-contain rounded-xl" />
          </Card>
        </div>

        <div className="md:col-span-5 flex flex-col h-full">
          <div className="mb-3 font-semibold text-muted flex items-center justify-between">
            <span>fachwortindex</span>
            <button
              type="button"
              className="ml-auto flex items-center justify-center h-6"
              title="Expand Dictionary"
              onClick={() => router.push(`${router.asPath.replace(/\/$/, "")}/dictionary`)}
            >
              <span className="sr-only">Expand Dictionary</span>
              <RiExpandDiagonalLine className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <Card className="rounded-xl border border-muted bg-background p-4 md:p-6 flex-1 h-full min-h-0">
            <div className="h-full min-h-0 max-h-[25vh] overflow-y-auto">
              <DictionaryView content={dictionary || []} fullscreen={false} />
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 flex flex-col h-full">
          {/* Only render assets card if assets exist and are not empty */}
          {data.assets && Object.keys(data.assets).length > 0 && (
            <>
              <div className="mb-3 font-semibold text-muted">assets</div>
              <Card className="rounded-xl border border-muted bg-background p-4 md:p-6 flex-1 h-full min-h-0">
                <div className="h-full min-h-0 max-h-[30vh] md:max-h-full overflow-y-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-left font-semibold">Name</th>
                        <th className="text-left font-semibold">Type</th>
                        <th className="text-left font-semibold">Size</th>
                        <th className="text-left font-semibold">Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(data.assets).map((asset) => (
                        <tr key={asset.id}>
                          <td>{asset.name || asset.filename}</td>
                          <td>{asset.extension}</td>
                          <td>{asset.niceSize}</td>
                          <td>
                            <a
                              href={asset.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Download
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CoursePage;
