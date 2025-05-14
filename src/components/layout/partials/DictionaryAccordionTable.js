import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DictionaryAccordionTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  tagFilter,
  setTagFilter,
}) => {
  const [open, setOpen] = useState(null);

  return (
    <div>
      {/* No searchbar in compact mode */}
      <Accordion
        type="single"
        collapsible
        value={open}
        onValueChange={setOpen}
        className="w-full text-xs sm:text-sm"
      >
        {data.length ? (
          data.map((item) => {
            const isLong = item.term.length > 25;
            const isVeryLong = item.term.length > 40;
            const displayTerm = isVeryLong
              ? item.term.slice(0, 40) + "..."
              : item.term;
            const isOpen = open === item.term;
            return (
              <AccordionItem key={item.term} value={item.term}>
                <AccordionTrigger>
                  <div className="flex flex-row items-center w-full gap-2">
                    <span
                      className={`font-semibold text-foreground ${
                        isLong ? "text-xs" : ""
                      }`}
                    >
                      {isOpen ? item.term : displayTerm}
                    </span>
                    {/* Desktop: show badges in trigger */}
                    <div className="hidden sm:flex flex-wrap gap-1 ml-auto">
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[10px] px-1 py-0.5 h-4 select-none pointer-events-none"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {/* Mobile: show badges in content */}
                  <div className="flex flex-wrap gap-1 mb-2 sm:hidden">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-[10px] px-1 py-0.5 h-4 select-none pointer-events-none"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="py-2 text-xs text-foreground">{item.description}</div>
                </AccordionContent>
              </AccordionItem>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground text-xs">No results.</div>
        )}
      </Accordion>
    </div>
  );
};

export default DictionaryAccordionTable;
