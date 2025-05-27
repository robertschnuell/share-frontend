import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import getConfig from "next/config";
import { RiCloseLine } from "@remixicon/react";

const FullscreenSlide = () => {
  const router = useRouter();
  const { section, collection, course, session, slide } = router.query;
  const [slideData, setSlideData] = useState(null);
  const [slidesCount, setSlidesCount] = useState(0);
  const [showClose, setShowClose] = useState(false);
  const hideTimeout = useRef(null);
  const videoRef = useRef(null); // Video-Ref für Autoplay

  const lang = "de";
  const config = getConfig().publicRuntimeConfig;

  useEffect(() => {
    if (!section || !collection || !course || !session || slide === undefined) return;
    const fetchData = async () => {
      try {
        const url = `${config.api.host}:${config.api.port}/${section}/${collection}/${course}/${session}.json`;
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();

        const slidesChild = Array.isArray(json.children)
          ? json.children.find(child => child.slug === "slides")
          : null;

        let slidesArr = [];
        if (slidesChild) {
          if (lang === "de" && Array.isArray(slidesChild.slides_de)) {
            slidesArr = slidesChild.slides_de;
          } else if (lang === "en" && Array.isArray(slidesChild.slides_en)) {
            slidesArr = slidesChild.slides_en;
          } else if (slidesChild.content?.slides) {
            try {
              slidesArr = JSON.parse(slidesChild.content.slides);
            } catch (e) {
              slidesArr = [];
            }
          }
        }

        // Mapping für Video und Image
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
              controls: false,
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

        const idx = parseInt(slide, 10) || 0;
        setSlideData(slides[idx]);
        setSlidesCount(slides.length);
      } catch (e) {
        setSlideData(null);
        setSlidesCount(0);
      }
    };
    fetchData();
  }, [section, collection, course, session, slide, config]);

  // Autoplay Video wenn ausgewählt
  useEffect(() => {
    if (slideData && slideData.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [slideData]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "f" || e.key === "F") {
        router.back();
      }
      if (e.key === "ArrowLeft") {
        const current = parseInt(slide, 10) || 0;
        if (current > 0) {
          router.replace({
            pathname: router.pathname,
            query: { ...router.query, slide: String(current - 1) }
          }, undefined, { shallow: true });
        }
      }
      if (e.key === "ArrowRight") {
        const current = parseInt(slide, 10) || 0;
        if (slidesCount && current < slidesCount - 1) {
          router.replace({
            pathname: router.pathname,
            query: { ...router.query, slide: String(current + 1) }
          }, undefined, { shallow: true });
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [router, slide, slidesCount]);

  // Show/hide close icon on desktop based on mouse movement
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseMove = () => {
      if (window.innerWidth < 768) return; // Only for desktop
      setShowClose(true);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(() => setShowClose(false), 1000);
    };

    if (window.innerWidth >= 768) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Always show on mobile
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setShowClose(true);
    }
  }, []);

  if (!slideData) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Close icon: always on mobile, on desktop only if mouse is moving */}
      {showClose && (
        <button
          type="button"
          className="absolute top-4 right-4 z-10 bg-black/60 rounded-full p-2"
          aria-label="Schließen"
          onClick={() => router.back()}
          style={{ lineHeight: 0 }}
        >
          <RiCloseLine className="w-7 h-7 text-white" />
        </button>
      )}
      {slideData.type === "video" ? (
        <video
          ref={videoRef}
          src={slideData.videoUrl}
          poster={slideData.posterUrl}
          controls={false}
          autoPlay
          muted={slideData.muted}
          loop={slideData.loop}
          preload={slideData.preload}
          className="max-w-full max-h-full object-contain bg-black"
          style={{ background: "#000" }}
        />
      ) : (
        <img
          src={slideData.thumbnail}
          alt={slideData.title}
          className="max-w-full max-h-full object-contain"
        />
      )}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-lg bg-black/60 px-4 py-2 rounded">
        {slideData.title}
      </div>
    </div>
  );
};

export default FullscreenSlide;
