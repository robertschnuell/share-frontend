import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DictionaryView from "@/components/layout/partials/DictionaryView";

const DICTIONARY_URL = "/data/cad-2d-3d_dictionary.json";

const DictionaryPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(DICTIONARY_URL)
      .then((res) => res.json())
      .then((dict) => {
        const arr = Object.entries(dict).map(([term, value]) => ({
          term,
          description: value.description,
          tags: value.tags,
        }));
        setData(arr);
      });
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <h1>Dictionary</h1>
      <DictionaryView content={data} />
    </div>
  );
};

export default DictionaryPage;
