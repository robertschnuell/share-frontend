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
    <div className="flex flex-col gap-2  pb-2 mb-8 border-b border-muted">
      <div className="flex flex-row gap-8 w-full">
        <div className="flex flex-col flex-1">
          {showBackButton && (
            <button
              type="button"
              className="mb-2 text-sm text-muted-foreground hover:underline w-fit"
              onClick={() => router.back()}
            >
              ← Back
            </button>
          )}
          <h2>{title}</h2>
          <p className="mt-1">{subtitle}</p>
        </div>
        <div className="flex flex-col flex-1 items-end text-right justify-between min-h-[3.5rem]">
          <div className="w-full min-h-[1.75rem]">{topRight}</div>
          <div className="w-full min-h-[1.75rem]">{bottomRight}</div>
        </div>
      </div>
    </div>
  );
};

export default SiteHeader;
