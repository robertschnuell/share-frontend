import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RiFullscreenLine, RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import getConfig from "next/config";

function SlidesGrid({ slides, selectedIndex, setSelectedIndex }) {
  const gridRef = React.useRef(null);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement !== gridRef.current) return;
      if (e.key === "ArrowLeft") {
        setSelectedIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "ArrowRight") {
        setSelectedIndex((i) => Math.min(slides.length - 1, i + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedIndex, slides.length]);

  return (
    <div className="w-2/3 h-full flex flex-col">
      <div
        className="p-6 bg-background border-none overflow-y-auto flex-1"
        tabIndex={0}
        ref={gridRef}
        style={{ outline: "none" }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {slides.map((slide, idx) => (
            <div key={idx} className="flex flex-col items-start">
              <div
                className={`cursor-pointer rounded-2xl border ${
                  selectedIndex === idx ? "border-foreground" : "border-muted"
                } bg-background p-2 flex flex-col items-center transition`}
                onClick={() => setSelectedIndex(idx)}
              >
                <img
                  src={slide.thumbnail}
                  alt={slide.title}
                  className="w-[120px] h-24 object-contain rounded-2xl"
                  style={{ background: "#f9f9f9" }}
                />
              </div>
              <div className={`mt-2 text-xs ${selectedIndex === idx ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {slide.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideControls({ selectedIndex, slidesLength, setSelectedIndex, onFullscreen }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4 w-full">
      <button
        type="button"
        className="p-1 rounded"
        onClick={() => setSelectedIndex((i) => Math.max(0, i - 1))}
        disabled={selectedIndex === 0}
        title="Vorheriges Slide"
      >
        <RiArrowLeftSLine className="w-4 h-4 text-muted-foreground" />
      </button>
      <span className="text-xs text-muted-foreground">
        {selectedIndex + 1} / {slidesLength}
      </span>
      <button
        type="button"
        className="p-1 rounded"
        onClick={() => setSelectedIndex((i) => Math.min(slidesLength - 1, i + 1))}
        disabled={selectedIndex === slidesLength - 1}
        title="Nächstes Slide"
      >
        <RiArrowRightSLine className="w-4 h-4 text-muted-foreground" />
      </button>
      <span className="flex-1" />
      <button
        className="rounded-full p-2 shadow"
        title="Fullscreen"
        type="button"
        onClick={onFullscreen}
      >
        <RiFullscreenLine className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
}

function SlidesSection({ slides, selectedIndex, setSelectedIndex }) {
  const router = useRouter();
  const selectedSlide = slides[selectedIndex];

  const handleFullscreen = () => {
    // slideId kann aus slide.id oder selectedIndex generiert werden
    const slideId = selectedSlide?.id ?? String(selectedIndex);
    router.push({
      pathname: `${router.asPath.replace(/\/$/, "")}/${slideId}/fullscreen`
    });
  };

  return (
    <div className="flex flex-1 min-h-0 gap-4">
      <SlidesGrid slides={slides} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
      <Separator orientation="vertical" className="mx-4" />
      <div className="w-1/3 flex flex-col items-center justify-center">
        <Card className="w-full bg-background border border-muted p-4 relative flex items-center justify-center">
          {selectedSlide && (
            <img
              src={selectedSlide.thumbnail}
              alt={selectedSlide.title}
              className="w-full  object-contain rounded-xl shadow"
            />
          )}
        </Card>
        <SlideControls
          selectedIndex={selectedIndex}
          slidesLength={slides.length}
          setSelectedIndex={setSelectedIndex}
          onFullscreen={handleFullscreen}
        />
      </div>
    </div>
  );
}

const SessionPage = () => {
  const router = useRouter();
  const section = router?.query?.section || "";
  const collection = router?.query?.collection || "";
  const course = router?.query?.course || "";
  const session = router?.query?.session || "";
  const [data, setData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const lang = "de";
  const config = getConfig().publicRuntimeConfig;

  useEffect(() => {
    if (section && collection && course && session) {
      const fetchData = async () => {
        try {
          const url = `${config.api.host}:${config.api.port}/${section}/${collection}/${course}/${session}.json`;
          const res = await fetch(url);
          if (res.ok) {
            const json = await res.json();
            setData(json);
          } else {
            setData({ error: "Failed to fetch data" });
          }
        } catch (err) {
          setData({ error: err.message });
        }
      };
      fetchData();
    }
  }, [section, collection, course, session, config]);

  if (!data) return <div>Loading...</div>;
  if (data.error) return <div>Error: {data.error}</div>;

  // Find the slides child (usually only one)
  const slidesChild = Array.isArray(data.children)
    ? data.children.find(child => child.slug === "slides")
    : null;

  // Prefer language-specific slides, fallback to default
  let slidesArr = [];
  if (slidesChild) {
    // Try language-specific slides array
    if (lang === "de" && Array.isArray(slidesChild.slides_de)) {
      slidesArr = slidesChild.slides_de;
    } else if (lang === "en" && Array.isArray(slidesChild.slides_en)) {
      slidesArr = slidesChild.slides_en;
    }
    // Fallback: try parsing slides from content
    else if (slidesChild.content?.slides) {
      try {
        slidesArr = JSON.parse(slidesChild.content.slides);
      } catch (e) {
        slidesArr = [];
      }
    }
  }

  // Normalize slides for the UI
  const slides = slidesArr.map(slide => {
    // If slide is from slides_de/slides_en, image is in slide.content.image (string or array)
    if (slide.content && slide.content.image) {
      return {
        id: slide.id,
        thumbnail: Array.isArray(slide.content.image) ? slide.content.image[0] : slide.content.image,
        title: slide.content.caption || slide.content.alt || "Slide"
      };
    }
    // If slide is from parsed JSON, image is in slide.content.image (array)
    if (slide.content && Array.isArray(slide.content.image)) {
      return {
        id: slide.id,
        thumbnail: slide.content.image[0],
        title: slide.content.caption || slide.content.alt || "Slide"
      };
    }
    // fallback
    return {
      id: slide.id,
      thumbnail: "",
      title: "Slide"
    };
  });

  return (
    <div className="flex flex-col h-screen gap-4 overflow-hidden">
      <Card className="flex flex-col justify-center items-start p-0 bg-background border-none">
        <h1 className="text-3xl font-bold mb-2 text-foreground">{data.title}</h1>
        <div className="max-w-2xl">
          <p className="text-muted-foreground">{data.abstract}</p>
        </div>
      </Card>
      <Separator className="mt-4 mb-4" />
      <SlidesSection slides={slides} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
    </div>
  );
};

export default SessionPage;
