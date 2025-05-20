import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DictionaryAccordionTable from "./DictionaryAccordionTable";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
          placeholder="Search term or description …"
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
            <Table>
              <TableBody>
                {filteredData.length ? (
                  filteredData.map((item) => (
                    <TableRow
                      key={item.term}
                      className={`cursor-pointer text-xs font-semibold border-muted transition-colors ${
                        selectedTerm === item.term && !isMobile ? "bg-muted" : ""
                      }`}
                      onClick={() => {
                        setSelectedTerm(item.term);
                        if (isMobile) setDialogOpen(true);
                      }}
                    >
                      {/* Term cell: block & left on mobile, table-cell & left on desktop */}
                      <TableCell className="block md:table-cell w-full md:w-auto pl-0 pb-0 align-top md:pb-0 text-left">
                        <span className="block text-left">{item.term}</span>
                      </TableCell>
                      {/* Tags cell: block & left on mobile, table-cell & right on desktop */}
                      <TableCell className="block md:table-cell w-full md:w-auto pl-0 pr-0 pt-2 md:py-2  text-left md:text-right">
                        <span className="flex flex-wrap gap-1 justify-start md:justify-end mt-1 md:mt-0 w-full">
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="cursor-pointer text-xs border-muted px-3 py-3 font-normal h-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTagFilter(tag);
                              }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-muted-foreground text-xs">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Detail Card (desktop only) */}
        <div className="hidden md:flex md:w-1/2 w-full items-center justify-center max-h-full ">
          {selected ? (
            <Card className="w-full max-w-xl mx-auto aspect-[1.414/1] flex flex-col justify-center">
              <CardHeader className="pb-2">
                <CardTitle>{selected.term}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <div className="mb-4 flex flex-wrap gap-1">
                  {selected.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer text-muted text-xs border-muted  px-3 py-3 font-normal h-4 "
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
          <DialogContent className="w-4/5 aspect-square block  p-4 rounded-2xl bg-foreground text-background">
            {selected && (
              <>
                <DialogHeader className="mb-3">
                  <DialogTitle className="text-left pb-0 w-2/3">{selected.term}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="mb-4">
                  <div className="mb-2 mt-0 flex flex-wrap gap-1">
                    {selected.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className=" cursor-pointer text-background border-foreground text-xs border-muted  px-3 py-3 font-normal h-4 "
                        onClick={() => setTagFilter(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </DialogDescription>

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
