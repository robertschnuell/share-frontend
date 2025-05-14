import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DictionaryAccordionTable from "./DictionaryAccordionTable";

const DictionaryView = ({ content, fullscreen = true }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [tagFilter, setTagFilter] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);

  const filteredData = useMemo(() => {
    let result = content || [];
    if (globalFilter) {
      const s = globalFilter.toLowerCase();
      result = result.filter(
        (item) =>
          item.term.toLowerCase().includes(s) ||
          item.description.toLowerCase().includes(s)
      );
    }
    if (tagFilter) {
      result = result.filter((item) => item.tags.includes(tagFilter));
    }
    return result;
  }, [content, globalFilter, tagFilter]);

  const selected = useMemo(
    () => filteredData.find((item) => item.term === selectedTerm) || null,
    [filteredData, selectedTerm]
  );

  if (!fullscreen) {
    return (
      <DictionaryAccordionTable
        data={filteredData}
        globalFilter={undefined}
        setGlobalFilter={undefined}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
      />
    );
  }

  return (
    <>
      <div className="my-4 flex gap-2 flex-shrink-0">
        <Input
          placeholder="Search term or description..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        {tagFilter && (
          <Badge
            variant="default"
            className="cursor-pointer"
            onClick={() => setTagFilter(null)}
          >
            {tagFilter} ✕
          </Badge>
        )}
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        {/* Sidebar */}
        <div className="md:w-1/2 w-full h-1 md:h-auto md:min-h-0 md:max-h-none md:flex-shrink-0">
          <div className="border-t border-b rounded-md bg-background h-full md:h-[calc(100vh-140px)] overflow-y-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul>
              {filteredData.length ? (
                filteredData.map((item) => (
                  <li
                    key={item.term}
                    className={`flex items-center px-4 py-2 border-b last:border-b-0 cursor-pointer transition-colors text-xs ${
                      selectedTerm === item.term
                        ? "bg-muted font-semibold"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setSelectedTerm(item.term)}
                  >
                    <span className="truncate">{item.term}</span>
                    <span className="flex flex-wrap gap-1 ml-auto">
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer text-[10px] px-1 py-0.5 h-4"
                          onClick={e => {
                            e.stopPropagation();
                            setTagFilter(tag);
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-center py-8 text-muted-foreground text-xs">No results.</li>
              )}
            </ul>
          </div>
        </div>
        {/* Detail Card */}
        <div className="md:w-1/2 w-full flex items-center justify-center min-h-0">
          {selected ? (
            <Card className="w-full max-w-xl mx-auto">
              <CardHeader>
                <CardTitle>{selected.term}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex flex-wrap gap-1">
                  {selected.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setTagFilter(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div>{selected.description}</div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-muted-foreground text-center w-full">
              {filteredData.length
                ? "Bitte einen Begriff aus der Liste auswählen."
                : ""}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DictionaryView;
