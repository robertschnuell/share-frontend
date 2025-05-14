import React, { useEffect, useState } from "react";
import SiteHeader from "@/components/layout/partials/SiteHeader";
import SessionCards from "@/components/layout/partials/SessionCards";
import { Card } from "@/components/ui/card";
import { RiExpandDiagonalLine } from "@remixicon/react";
import { useRouter } from "next/router";
import DictionaryView from "@/components/layout/partials/DictionaryView";

const URL = "/data/course.json";

const CoursePage = () => {
  const [data, setData] = useState([]);
  const [dictionary, setDictionary] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
      });

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
      <SiteHeader title={data?.title} subtitle={data?.term} />

      <SessionCards title="sessions" content={data.sessions || []} />

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
          <div className="mb-3 font-semibold text-muted">assets</div>
          <Card className="rounded-xl border border-muted bg-background p-4 md:p-6 flex-1 h-full min-h-0">
            <div className="h-full min-h-0 max-h-[30vh] md:max-h-full overflow-y-auto">{/* assets content here */}</div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default CoursePage;
