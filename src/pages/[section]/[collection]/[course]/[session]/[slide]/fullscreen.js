import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const FullscreenSlide = () => {
  const router = useRouter();
  const { session, slide } = router.query;
  const [slideData, setSlideData] = useState(null);
  const [slidesCount, setSlidesCount] = useState(0);

  useEffect(() => {
    if (!session || slide === undefined) return;
    const sessionId = Array.isArray(session) ? session[0] : session;
    fetch(`/data/${sessionId}.json`)
      .then((res) => res.json())
      .then((json) => {
        const idx = parseInt(slide, 10) || 0;
        setSlideData(json.slides?.[idx]);
        setSlidesCount(json.slides?.length || 0);
      });
  }, [session, slide]);

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
