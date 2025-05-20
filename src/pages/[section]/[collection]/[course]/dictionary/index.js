import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DictionaryView from "@/components/layout/partials/DictionaryView";
import SiteHeader from "@/components/layout/partials/SiteHeader";
import getConfig from "next/config";

const DictionaryPage = () => {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const router = useRouter();
  const config = getConfig().publicRuntimeConfig;
  const lang = "de";

  useEffect(() => {
    const { section, collection, course } = router.query;
    if (!section || !collection || !course) return;
    const courseUrl = `${config.api.host}:${config.api.port}/${lang}/${section}/${collection}/${course}.json`;
    fetch(courseUrl)
      .then((res) => res.json())
      .then((courseJson) => {
        if (courseJson && courseJson.dictionary && courseJson.dictionary.id) {
          setTitle(courseJson.title || "Dictionary");
          const dictUrl = `${config.api.host}:${config.api.port}/${lang}/${courseJson.dictionary.id}.json`;
          fetch(dictUrl)
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
              setData(arr);
            });
        } else {
          setTitle(courseJson.title || "Dictionary");
          setData([]);
        }
      });
  }, [router.query.section, router.query.collection, router.query.course, config]);

  return (
    <div className=" h-full overflow-hidden">
      <SiteHeader title={"Dictionary"} subtitle={title} />
      <DictionaryView content={data} />
    </div>
  );
};

export default DictionaryPage;
