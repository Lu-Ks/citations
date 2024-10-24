"use client";

import { Italianno } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import citations from "../../../public/citations.json";

type Citation = {
  id: number;
  texte: string;
  auteur: string;
  date?: string;
};

const citationFont = Italianno({
  weight: "400",
  display: "swap",
  subsets: ["latin"],
});

const generateImages = async (
  citationsWithImages: (Citation & { imageData: string })[]
) => {
  const response = await fetch("/api/generate-images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ citations: citationsWithImages }),
  });

  const data = await response.json();
  console.log(data);
};

export default function GenerateImagesPage() {
  const citationRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const captureImages = async () => {
    const updatedCitations = [];

    for (let i = 0; i < citations.length; i++) {
      const citation = citations[i];
      setIndex(i);
      console.log("generating", citation);

      // Render the current citation
      await new Promise((resolve) => {
        setTimeout(resolve, 500); // Wait for rendering
      });

      if (citationRef.current) {
        const canvas = await html2canvas(citationRef.current);
        const imageData = canvas.toDataURL("image/png");

        updatedCitations.push({ ...citation, imageData });
      }
    }

    await generateImages(updatedCitations); // Send to the API route to save images
  };

  useEffect(() => {
    captureImages();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 px-4">
      <div ref={citationRef} className="text-center p-8 rounded-lg">
        <blockquote className="mb-6 text-2xl text-stone-800">
          <span className={`${citationFont.className} text-5xl`}>
            {citations[index].texte}
          </span>
        </blockquote>
        <cite className="flex justify-end text-sm text-stone-600">
          — {citations[index].auteur} {citations[index].date}
        </cite>
      </div>
    </div>
  );
}
