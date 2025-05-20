import { Card } from "@/components/ui/card";
import { useRouter } from "next/router";
import { RiLock2Line } from "@remixicon/react";

const SessionCards = ({ title = "", content }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <div className=" pb-2 ">
        <h3>{title}</h3>
      </div>
      <div className="flex flex-row gap-4 overflow-x-auto overflow-y-hidden scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {content &&
          content.length > 0 &&
          content.map((c) => (
            <div key={c.id} className="flex flex-col items-center min-w-[180px]">
          
              <Card
                className={`flex items-center justify-center p-0 rounded-2xl border  shadow-none bg-transparent w-full aspect-square ${
                  c.titleimage || c.image ? "cursor-pointer" : "cursor-not-allowed opacity-60 text-muted-foreground border-muted"
                }`}
                onClick={c.titleimage || c.image ? () => router.push(`${router.asPath.replace(/\/$/, "")}/${c.id}`) : undefined}
                tabIndex={c.titleimage || c.image ? 0 : -1}
                aria-disabled={!(c.titleimage || c.image)}
              >
                {c.titleimage || c.image ? (
                  <img
                    src={c.titleimage || c.image}
                    alt={c.title}
                    className="object-cover w-full h-full rounded-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <RiLock2Line className="w-6 h-6 text-muted-foreground mb-1" />
                  </div>
                )}
              </Card>
              <div className="mt-2 w-full">
                <div className={`font-medium text-sm text-left ${!(c.titleimage || c.image) ? "text-muted-foreground" : ""} `}>
                  {c.title}
                </div>
                <div className={`${!(c.titleimage || c.image) ? "text-muted-foreground" : ""} text-xs  text-left`}>KW {c.kw}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SessionCards;
