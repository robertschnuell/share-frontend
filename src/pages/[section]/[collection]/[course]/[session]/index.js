import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RiFullscreenLine, RiArrowLeftSLine, RiArrowRightSLine, RiPlayLine, RiFileTextLine, RiFileZipLine } from "@remixicon/react";
import getConfig from "next/config";
import SiteHeader from "@/components/layout/partials/SiteHeader";

function SlidesGrid({ slides, selectedIndex, setSelectedIndex }) {
  const gridRef = useRef(null);
  const slideRefs = useRef([]);

  useEffect(() => {
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


  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      const ref = slideRefs.current[selectedIndex];
      if (ref && ref.scrollIntoView) {
        ref.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }
    }
  }, [selectedIndex]);

  return (
    <div className=" h-full flex flex-col">
      <div
        className="p-0 bg-background border-none overflow-y-auto flex-1"
        tabIndex={0}
        ref={gridRef}
        style={{ outline: "none" }}
      >
        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-5
            gap-4
            gap-y-8
          "
        >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start w-full"
              ref={el => slideRefs.current[idx] = el}
            >
              <div
                className={`
                  cursor-pointer rounded-2xl border
                  ${selectedIndex === idx ? "border-foreground" : "border-muted"}
                  bg-background p-0 flex flex-col items-center transition
                  w-full
                `}
                onClick={() => setSelectedIndex(idx)}
              >
                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                  {/* Zeige Poster für Video, sonst Thumbnail */}
                  {slide.type === "video" ? (
                    <img
                      src={slide.posterUrl}
                      alt={slide.title}
                      className="
                        absolute inset-0 w-full h-full object-cover rounded-xl
                      "
                      style={{ background: "#f9f9f9" }}
                    />
                  ) : (
                    <img
                      src={slide.thumbnail}
                      alt={slide.title}
                      className="
                        absolute inset-0 w-full h-full object-cover rounded-xl
                      "
                      style={{ background: "#f9f9f9" }}
                    />
                  )}
                </div>
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

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const videoRef = useRef(null);

  useEffect(() => {
    if (selectedSlide && selectedSlide.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [selectedSlide]);

  const handleTouchStart = (e) => {
    if (window.innerWidth >= 768) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (window.innerWidth >= 768) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (window.innerWidth >= 768) return;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchEndX.current - touchStartX.current;
      if (Math.abs(deltaX) > 50) {
        if (deltaX < 0 && selectedIndex < slides.length - 1) {
          setSelectedIndex(selectedIndex + 1); 
        } else if (deltaX > 0 && selectedIndex > 0) {
          setSelectedIndex(selectedIndex - 1);
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleFullscreen = () => {

    const slideId =  String(selectedIndex);
    router.push({
      pathname: `${router.asPath.replace(/\/$/, "")}/${slideId}/fullscreen`
    });
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-0 gap-4">
      <div className="w-full md:w-2/3 flex flex-col">
        <SlidesGrid slides={slides} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
      </div>
      <Separator orientation="horizontal" className="block md:hidden my-4 bg-muted" />
      <Separator orientation="vertical" className="hidden md:block mx-4 bg-muted" />
      <div className="w-full md:w-1/3 flex flex-col items-center justify-start">
        <Card className="w-full bg-background border border-muted p-0 relative flex rounded-xl items-center justify-center">
          {selectedSlide && (
            selectedSlide.type === "video" ? (
              <video
                ref={videoRef}
                src={selectedSlide.videoUrl}
                poster={selectedSlide.posterUrl}
                controls={false}
                autoPlay
                muted={selectedSlide.muted}
                loop={selectedSlide.loop}
                preload={selectedSlide.preload}
                className="w-full object-cover rounded-xl shadow"
                style={{ background: "#000" }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            ) : (
              <img
                src={selectedSlide.thumbnail}
                alt={selectedSlide.title}
                className="w-full object-cover rounded-xl shadow"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            )
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

  const slidesChild = Array.isArray(data.children)
    ? data.children.find(child => child.slug === "slides")
    : null;

  let slidesArr = [];
  if (slidesChild) {
    if (lang === "de" && Array.isArray(slidesChild.slides_de)) {
      slidesArr = slidesChild.slides_de;
    } else if (lang === "en" && Array.isArray(slidesChild.slides_en)) {
      slidesArr = slidesChild.slides_en;
    }
    else if (slidesChild.content?.slides) {
      try {
        slidesArr = JSON.parse(slidesChild.content.slides);
      } catch (e) {
        slidesArr = [];
      }
    }
  }

  const slides = slidesArr.map(slide => {

    if (slide.type === "video" && slide.content && slide.content.url) {
      return {
        id: slide.id,
        type: "video",
        videoUrl: slide.content.url,
        posterUrl: slide.content.posterUrl || "",
        title: slide.content.caption || slide.content.alt || "Video",
        autoplay: slide.content.autoplay === "true",
        muted: slide.content.muted === "true",
        loop: slide.content.loop === "true",
        controls: slide.content.controls !== "false", // default true
        preload: slide.content.preload || "auto"
      };
    }

    if (slide.content && slide.content.image) {
      return {
        id: slide.id,
        type: "image",
        thumbnail: Array.isArray(slide.content.image) ? slide.content.image[0] : slide.content.image,
        title: slide.content.caption || slide.content.alt || "Slide"
      };
    }
    if (slide.content && Array.isArray(slide.content.image)) {
      return {
        id: slide.id,
        type: "image",
        thumbnail: slide.content.image[0],
        title: slide.content.caption || slide.content.alt || "Slide"
      };
    }
    return {
      id: slide.id,
      type: "image",
      thumbnail: "",
      title: "Slide"
    };
  });


  const scriptFile =
    (lang === "de" && data.script_de?.fileUrl) ||
    (lang === "en" && data.script_en?.fileUrl) ||
    null;
  const slidesFile =
    (lang === "de" && data.slides_de?.fileUrl) ||
    (lang === "en" && data.slides_en?.fileUrl) ||
    null;

  return (
    <div className="flex flex-col md:h-screen gap-4 overflow-hidden">
      <div>
      <SiteHeader
        title={data.title}
        subtitle={"KW " + data.kw || ""}
        showBackButton={true}
      />
      <Card className="flex flex-col justify-center items-start p-0 bg-background border-none">
        <div className="max-w-xl">
          <p className="text-foreground">{data.abstract}</p>

          <div className="flex gap-2 mt-4">
            {/* Play Button */}
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded border border-primary bg-primary-foreground text-primary font-medium shadow transition"
              onClick={() => {
                if (slides.length > 0) {
                  router.push({
                    pathname: `${router.asPath.replace(/\/$/, "")}/0/fullscreen`
                  });
                }
              }}
            >
              <RiPlayLine className="w-5 h-5" />
              Play
            </button>
            {/* Script Button */}
            {scriptFile ? (
              <a
                href={scriptFile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded border border-primary bg-primary-foreground text-primary font-medium shadow transition"
                style={{ color: "#171717" }}
                download
              >
                <RiFileTextLine className="w-5 h-5" style={{ color: "#171717" }} />
                Script
              </a>
            ) : (
              <span
                className="flex items-center gap-2 px-4 py-2 rounded border border-muted text-muted-foreground font-medium pointer-events-none select-none"
                style={{ background: "transparent" }}
              >
                <RiFileTextLine className="w-5 h-5" />
                Script
              </span>
            )}
            {/* Slides Button */}
            {slidesFile ? (
              <a
                href={slidesFile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded border border-primary bg-primary-foreground text-primary font-medium shadow transition"
                style={{ color: "#171717" }}
                download
              >
                <RiFileZipLine className="w-5 h-5" style={{ color: "#171717" }} />
                Slides
              </a>
            ) : (
              <span
                className="flex items-center gap-2 px-4 py-2 rounded border border-muted text-muted-foreground font-medium pointer-events-none select-none"
                style={{ background: "transparent" }}
              >
                <RiFileZipLine className="w-5 h-5" />
                Slides
              </span>
            )}
          </div>
          {/* --- Ende Button-Leiste --- */}
        </div>
      </Card>
      </div>
      <Separator className="mt-4 mb-4 bg-muted" />
      <SlidesSection slides={slides} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
    </div>
  );
};

export default SessionPage;
