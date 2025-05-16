import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getConfig from "next/config";

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
      <h1>Teaching</h1>
      <p>Welcome to the Teaching page!</p>
      <p>Section: {id}</p>
      {id && (
        <div>
          <h2>Section Data</h2>
          <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
        </div>
      )}
    </div>
  );
};

export default Teaching;
