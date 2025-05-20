import { useRouter } from "next/router";

const SiteHeader = ({ title = "", subtitle = "", topRight = "", bottomRight = "", showBackButton = true }) => {
  const router = useRouter();
  return (
    <div>
      {showBackButton && (
        <button type="button" className="mb-2 text-base text-muted-foreground hover:underline w-fit" onClick={() => router.back()}>
          ← Back
        </button>
      )}
      <div className="flex flex-col gap-2 pb-2 mb-8 border-b text-sm w-full text-xstext-xs">
        <div className="grid grid-cols-1 md:grid-cols-2  md:grid-rows-2 gap-0 md:gap-0 md:gap-y-0 md:gap-x-0 md:gap-4 w-full items-start">
          <h2 className="row-start-1 col-start-1">{title}</h2>
          <p className="row-start-2 col-start-1 pb-4 md:pb-0">{subtitle}</p>
          <div className="w-full text-left md:text-right row-start-3 md:row-start-1 col-start-1 md:col-start-2">{topRight}</div>
          <div className="w-full text-left md:text-right row-start-4 md:row-start-2 col-start-1 md:col-start-2">{bottomRight}</div>
        </div>
      </div>
    </div>
  );
};

export default SiteHeader;
