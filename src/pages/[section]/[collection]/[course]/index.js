import React, { useEffect, useState } from "react";
import SiteHeader from "@/components/layout/partials/SiteHeader";
import SessionCards from "@/components/layout/partials/SessionCards";
import { Card } from "@/components/ui/card";
import { RiExpandDiagonalLine } from "@remixicon/react";
import { useRouter } from "next/router";
import DictionaryView from "@/components/layout/partials/DictionaryView";
import getConfig from "next/config";
import AssetsTable from "@/components/layout/partials/AssetsTable";

const CoursePage = () => {
  const router = useRouter();
  const section = router?.query?.section || "";
  const collection = router?.query?.collection || "";
  const course = router?.query?.course || "";
  const [data, setData] = useState({});

  console.log(data);

  const lang = "de";

  const config = getConfig().publicRuntimeConfig;

  useEffect(() => {
    if (section && collection) {
      const fetchData = async () => {
        try {
          const url = `${config.api.host}:${config.api.port}/${lang}/${section}/${collection}/${course}.json`;
          console.log("url", url);
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
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

  const [dictionary, setDictionary] = useState([]);
  const [showDictionary, setShowDictionary] = useState(false);

  useEffect(() => {
    // Only fetch dictionary if data.dictionary and data.dictionary.url exist
    if (data && data.dictionary && data.dictionary.id) {
      setShowDictionary(true);
      fetch(`${config.api.host}:${config.api.port}/${lang}/${data.dictionary.id}.json`)
        .then((res) => res.json())
        .then((dict) => {
          const arr = Array.isArray(dict.entries)
            ? dict.entries.map((entry) => ({
                term: entry.name,
                description: entry.beschreibung,
                tags: entry.tags,
                session: entry.session,
                image: entry.bild,
              }))
            : [];
          setDictionary(arr);
        });
    } else {
      setShowDictionary(false);
      setDictionary([]);
    }
  }, [data]);

  // Extract briefing thumbnail from API data
  const briefingThumbnail =
    data?.briefing?.[0]?.thumbnail ||
    data?.briefing?.[0]?.translations?.[lang]?.content?.thumbnail ||
    null;

  return (
    <div>
      <SiteHeader title={data?.title || ""} subtitle={data?.[lang]?.term?.toLowerCase() || ""} />

      <SessionCards
        title="sessions"
        content={
          data.children
            ? Object.values(data.children)
                .map((child) => {
                  const translation = child.translations?.[lang]?.content;
                  return { ...translation, ...{ titleimage: child?.titleimage, id: child.slug } } || child.content || {};
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
              title="Expand Briefing"
              onClick={() => router.push(`${router.asPath.replace(/\/$/, "")}/briefing`)}
            >
              <span className="sr-only">Expand Briefing</span>
              <RiExpandDiagonalLine className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <Card className="rounded-xl border border-muted bg-background p-4 md:p-6 flex-1 h-full min-h-0 flex items-center justify-center">
            <img
              src={briefingThumbnail || "/assets/briefing.png"}
              alt="Briefing"
              className="max-h-full max-w-full object-contain rounded-xl"
            />
          </Card>
        </div>
        {showDictionary && (
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
        )}

        <div className="md:col-span-2 flex flex-col h-full md:pb-0 pb-12 ">
          <AssetsTable assets={data.assets} />
        </div>
      </section>
    </div>
  );
};

export default CoursePage;
