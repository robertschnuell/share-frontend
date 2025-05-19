import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getConfig from "next/config";
import SiteHeader from "@/components/layout/partials/SiteHeader";

const Teaching = () => {
  const router = useRouter();
  const id = router?.query?.section || "";
  const [data, setData] = useState(null);

  const config = getConfig().publicRuntimeConfig;

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const url = `${config.api.host}:${config.api.port}/${id}.json`;
          console.log("url", url);
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            setData(data);
          } else {
            setData({ error: "Failed to fetch data" });
          }
        } catch (err) {
          setData({ error: err.message });
        }
      };
      fetchData();
    }
  }, [id, config]);

  return (
    <div>
      <SiteHeader showBackButton={false} title={id} />
      <p>No public entries visible.</p>
      
    </div>
  );
};

export default Teaching;
