import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getConfig from "next/config";

const FullscreenSlide = () => {
  const router = useRouter();
  const { section, collection, course, session, slide } = router.query;
  const [slideData, setSlideData] = useState(null);
  const [slidesCount, setSlidesCount] = useState(0);

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

        // Find the slides child (usually only one)
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

        // Normalize slides for the UI
        const slides = slidesArr.map(slide => {
          if (slide.content && slide.content.image) {
            return {
              id: slide.id,
              thumbnail: Array.isArray(slide.content.image) ? slide.content.image[0] : slide.content.image,
              title: slide.content.caption || slide.content.alt || "Slide"
            };
          }
          if (slide.content && Array.isArray(slide.content.image)) {
            return {
              id: slide.id,
              thumbnail: slide.content.image[0],
              title: slide.content.caption || slide.content.alt || "Slide"
            };
          }
          return {
            id: slide.id,
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

  if (!slideData) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <img
        src={slideData.thumbnail}
        alt={slideData.title}
        className="max-w-full max-h-full object-contain"
      />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-lg bg-black/60 px-4 py-2 rounded">
        {slideData.title}
      </div>
    </div>
  );
};

export default FullscreenSlide;
