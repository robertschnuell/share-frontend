import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DictionaryAccordionTable from "./DictionaryAccordionTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const DictionaryView = ({ content, fullscreen = true }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [tagFilter, setTagFilter] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredData = useMemo(() => {
    let result = content || [];
    if (globalFilter) {
      const s = globalFilter.toLowerCase();
      result = result.filter((item) => item.term.toLowerCase().includes(s) || item.description.toLowerCase().includes(s));
    }
    if (tagFilter) {
      result = result.filter((item) => item.tags.includes(tagFilter));
    }
    return result;
  }, [content, globalFilter, tagFilter]);

  const selected = useMemo(() => filteredData.find((item) => item.term === selectedTerm) || null, [filteredData, selectedTerm]);

  // Helper to detect mobile (tailwind 'md' breakpoint)
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

  // Open dialog on mobile when a term is selected
  React.useEffect(() => {
    if (isMobile && selectedTerm) setDialogOpen(true);
    else setDialogOpen(false);
    // eslint-disable-next-line
  }, [selectedTerm]);

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
          <Badge variant="default" className="cursor-pointer" onClick={() => setTagFilter(null)}>
            {tagFilter} ✕
          </Badge>
        )}
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        {/* Sidebar */}
        <div className="w-full md:w-1/2 flex-1 md:h-auto md:min-h-0 md:max-h-none md:flex-shrink-0">
          <div className="border-t border-b rounded-md bg-background h-[50vh] md:h-[calc(100vh-140px)] overflow-y-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul>
              {filteredData.length ? (
                filteredData.map((item) => (
                  <li
                    key={item.term}
                    className={`flex flex-col md:flex-row items-start md:items-center px-4 py-2 border-b last:border-b-0 cursor-pointer transition-colors text-xs ${
                      selectedTerm === item.term && !isMobile ? "bg-muted font-semibold" : "hover:bg-accent"
                    }`}
                    onClick={() => {
                      setSelectedTerm(item.term);
                      if (isMobile) setDialogOpen(true);
                    }}
                  >
                    <span className="truncate w-full md:w-auto">{item.term}</span>
                    <span
                      className="
                        flex flex-wrap gap-1 ml-0 mt-1 md:ml-auto md:mt-0
                      "
                    >
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer text-[10px] px-1 py-0.5 h-4"
                          onClick={(e) => {
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
        {/* Detail Card (desktop only) */}
        <div className="hidden md:flex md:w-1/2 w-full items-center justify-center min-h-0">
          {selected ? (
            <Card className="w-full max-w-xl mx-auto">
              <CardHeader>
                <CardTitle>{selected.term}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex flex-wrap gap-1">
                  {selected.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => setTagFilter(tag)}>
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div>{selected.description}</div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-muted-foreground text-center w-full">
              {filteredData.length ? "Bitte einen Begriff aus der Liste auswählen." : ""}
            </div>
          )}
        </div>
        {/* Mobile Dialog for detail card */}
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setSelectedTerm(null);
          }}
        >
          <DialogContent className="w-auto p-4 rounded-2xl bg-foreground text-background">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>{selected.term}</DialogTitle>
                </DialogHeader>
                <div className="mb-2 flex flex-wrap gap-1">
                  {selected.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer bg-background text-foreground border-foreground"
                      onClick={() => setTagFilter(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div>{selected.description}</div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default DictionaryView;
