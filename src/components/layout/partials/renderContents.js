import Vimeo from "@u-wave/react-vimeo";

const renderContents = (data) => {
  if (data?.content && data?.content.length > 0) {
    return data?.content.map((item, index) => {
      switch (item.type) {
        case "heading":
          return (
            <h3 id={item.id} key={index} className="mt-4 col-span-12">
              {item.text}
            </h3>
          );
        case "text":
          return (
            <div key={index} className="col-span-5 col-start-1">
              <p>{item.text}</p>
            </div>
          );
        case "image":
          return item?.image[0] ? (
            <figure className="col-span-5 col-start-1 mt-4 mb-8">
              <img key={index} src={item?.image[0]} alt={item.alt} />
            </figure>
          ) : null;
        case "gallery":
          return (
            <div key={index} className="col-span-5 col-start-1 grid grid-cols-3 gap-4 mt-12 mb-12">
              {item?.images?.map((image, imageIndex) => {
                return (
                  <figure key={imageIndex} className="overflow-hidden">
                    <img src={image} alt={item.alt} className="h-full w-full object-cover" />
                  </figure>
                );
              })}
            </div>
          );
        case "video":
          return (
            <figure className="col-span-5 col-start-1">
              <Vimeo responsive video={item?.url.split("https://vimeo.com/")[1]} />
            </figure>
          );
      }
    });
  }
};

export default renderContents;
