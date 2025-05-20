import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/router";
import getConfig from "next/config";
import SiteHeader from "@/components/layout/partials/SiteHeader";

const BriefingPage = () => {
  const router = useRouter();
  const section = router?.query?.section || "";
  const collection = router?.query?.collection || "";
  const course = router?.query?.course || "";
  const lang = "de";
  const config = getConfig().publicRuntimeConfig;

  const [briefing, setBriefing] = useState(null);

  useEffect(() => {
    if (section && collection && course) {
      const url = `${config.api.host}:${config.api.port}/${lang}/${section}/${collection}/${course}/briefing.json`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => setBriefing(data));
    }
  }, [section, collection, course, config]);

  if (!briefing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <SiteHeader title="briefing" />
      <div className="flex-1 w-full flex flex-col md:flex-row gap-8" style={{ minHeight: 0, height: "0" }}>

        <div className="w-full md:w-1/3 flex items-start h-full max-h-full order-1 md:order-2 mb-4 md:mb-0">
          <Card className="w-full md:mt-8 rounded-2xl h-[200px] md:h-full flex items-center justify-center p-0 overflow-hidden">
            <img
              src={
                typeof window !== "undefined" && window.innerWidth < 768
                  ? briefing.thumbnailLandscape	
                  : briefing.thumbnailPortrait
              }
              alt="Portrait"
              className="object-cover w-full h-full"
              style={{ aspectRatio: "3/4" }}
            />
          </Card>
        </div>

        <div className="md:w-2/3 w-full flex flex-col pr-2 h-full max-h-full overflow-y-auto order-2 md:order-1">
          <div className="w-full ">
            <h1 className="text-5xl md:text-8xl font-bold mb-2">{briefing.name}</h1>
            <h2 className="text-2xl md:text-4xl front-regular text-muted mb-4 md:max-w-[750px]">{briefing.subtitle}</h2>
            <div className="mb-6 md:w-5/6">
              <h3 className="text-lg font-bold mt-8 mb-2">Einleitung</h3>
              <div className="mb-6 leading-relaxed  md:columns-2">{briefing.intro}</div>
              <h3 className="text-lg font-bold mt-8 mb-2 md:mb-4">Inhalt</h3>
              <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                {Array.isArray(briefing.content) &&
                  briefing.content.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="w-full rounded-xl border border-muted bg-background p-4"
                      dangerouslySetInnerHTML={{ __html: item.content?.text || "" }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefingPage;
