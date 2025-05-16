import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const BRIEFING_URL = "/data/briefing.json";

const BriefingPage = () => {
  const [briefing, setBriefing] = useState(null);

  useEffect(() => {
    fetch(BRIEFING_URL)
      .then((res) => res.json())
      .then((data) => setBriefing(data));
  }, []);

  if (!briefing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-8" style={{ height: "80vh", maxHeight: "80vh" }}>
      {/* Left 2/3: Text */}
      <div className="md:w-2/3 w-full flex flex-col overflow-y-auto pr-2" style={{ maxHeight: "80vh" }}>
        <div className="w-full max-w-[750px]">
          <h1 className="text-8xl font-bold mb-2">{briefing.title}</h1>
          <h2 className="text-4xl front-regular italic mb-4">{briefing.subtitle}</h2>
          <div className="mb-6">
            <h3 className="text-lg font-bold mt-8 mb-2">Einleitung</h3>
            <div className="mb-6 leading-relaxed">{briefing.introduction}</div>
            <h3 className="text-lg font-bold mt-8 mb-2">Inhalt</h3>
            <div className="flex flex-col gap-4">
              {Array.isArray(briefing.content) &&
                briefing.content.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-full rounded-xl border border-muted bg-background p-4"
                  >
                    {item}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      {/* Right 1/3: Portrait Card */}
      <div className="md:w-1/3 w-full flex items-start">
        <Card className="w-full h-full flex items-center justify-center p-0 overflow-hidden">
          <img
            src={briefing.titlePortrait}
            alt="Portrait"
            className="object-cover w-full h-full"
            style={{ aspectRatio: "3/4" }}
          />
        </Card>
      </div>
    </div>
  );
};

export default BriefingPage;
