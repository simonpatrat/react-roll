import React from "react";

const ImageBox = ({
  index,
  fullSize,
}: {
  index: number;
  fullSize?: boolean;
}) => {
  const imageSize = fullSize ? "1920/1080" : "1024/576";
  const imgUrl = `https://picsum.photos/id/${index + 110}/${imageSize}`;

  return (
    <div>
      <img
        src={imgUrl}
        alt=""
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  );
};

export default ImageBox;
