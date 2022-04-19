import React from "react";

const ImageBox = ({ index }: { index: number }) => {
  const imgUrl = `https://picsum.photos/id/${index + 110}/1024/576`;

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
