"use client";

import { AnimatePresence, motion } from "framer-motion";
// import { Share2 } from "lucide-react";
import { Italianno } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import citations from "../../public/citations.json";

export type Citation = {
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

const AnimatedText = ({
  className,
  text,
  isQuote = false,
}: {
  className?: string;
  text: string;
  isQuote?: boolean;
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration: 0.2,
        delay: isQuote ? 0.5 : 0,
        ease: [0.2, 0.65, 0.3, 0.9],
      }}
      className={`inline-block ${className}`}
    >
      {isQuote ? [`"`, ...text, `"`] : text}
    </motion.span>
  );
};

export default function CitationCalligrafiquePartageable() {
  const [citation, setCitation] = useState<Citation>({
    id: 0,
    texte: "...",
    auteur: "--",
    date: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [firstAnimation, setFirstAnimation] = useState(true);
  const [key, setKey] = useState(0);
  const citationRef = useRef<HTMLDivElement>(null);

  const chargerCitationAleatoire = () => {
    setIsLoading(true);
    setTimeout(
      () => {
        const citationAleatoire =
          citations[Math.floor(Math.random() * citations.length)];
        setCitation(citationAleatoire);
        setIsLoading(false);
        setKey((prevKey) => prevKey + 1);
      },
      firstAnimation ? 0 : 500
    );
  };

  useEffect(() => {
    chargerCitationAleatoire();
  }, []);

  useEffect(() => {
    setFirstAnimation(false);
  }, [isLoading]);

  // const shareImage = async () => {
  //   const imageUrl = `https://raw.githubusercontent.com/Lu-Ks/citations/refs/heads/main/public/citations/${citation.id}.png`;

  //   // Instagram URL Scheme for sharing to Stories
  //   const instagramUrl = `instagram://story?source_url=${encodeURIComponent(
  //     imageUrl
  //   )}`;

  //   // Open the Instagram app if installed
  //   window.open(instagramUrl, "_blank");
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 px-4">
      <div ref={citationRef} className="text-center p-8 rounded-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <blockquote className="mb-4 text-2xl text-stone-800">
              <AnimatedText
                className={`${citationFont.className} text-4xl`}
                text={citation.texte}
                isQuote={true}
              />
            </blockquote>
            <cite className="flex justify-end text-sm text-stone-600">
              —{" "}
              <AnimatedText
                text={` ${citation.auteur}${
                  citation.date ? ` ${citation.date}` : ""
                }`}
              />
            </cite>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex space-x-4 mt-8">
        <button
          onClick={chargerCitationAleatoire}
          disabled={isLoading}
          className="px-4 py-2 text-sm text-stone-400 hover:text-stone-600 transition-colors duration-300 focus:outline-none"
        >
          {isLoading ? "Chargement..." : "Nouvelle citation"}
        </button>
        {/* <button
          onClick={shareImage}
          className="px-4 py-2 text-sm text-stone-400 hover:text-stone-600 transition-colors duration-300 focus:outline-none flex items-center"
        >
          <Share2 className="w-4 h-4 mr-2" />
          <p>Partager</p>
        </button> */}
      </div>

      <div className="absolute bottom-2 right-2 text-xs text-stone-300">
        {citations.length} citations disponibles
      </div>
    </div>
  );
}
