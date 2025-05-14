const SiteHeader = ({ title = "", subtitle = "", topRight = "", bottomRight = "" }) => {
  return (
    <div className="flex flex-col gap-2  pb-4 mb-2">
      <div className="flex flex-row gap-8 w-full">
        <div className="flex flex-col flex-1">
          <h2>{title}</h2>
          <p>{subtitle}</p>
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
