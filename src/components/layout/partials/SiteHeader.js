import { useRouter } from "next/router";

const SiteHeader = ({
  title = "",
  subtitle = "",
  topRight = "",
  bottomRight = "",
  showBackButton = true,
}) => {
  const router = useRouter();
  return (
    <div>
    {showBackButton && (
      <button
        type="button"
        className="mb-2 text-sm text-muted-foreground hover:underline w-fit"
        onClick={() => router.back()}
      >
        ← Back
      </button>
    )}
    <div className="flex flex-col gap-2 pb-2 mb-8 border-b border-muted w-full">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full">
        <div className="flex flex-col flex-1 mb-4 md:mb-0">
        
          <h2>{title}</h2>
          <p className="mt-1">{subtitle}</p>
        </div>
        <div className="flex flex-col flex-1 items-start md:items-end text-right justify-between min-h-[3.5rem]">
          <div className="w-full  text-left md:text-right min-h-[1.75rem]">{topRight}</div>
          <div className="w-full min-h-[1.75rem] text-left md:text-right">
            {bottomRight}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SiteHeader;
