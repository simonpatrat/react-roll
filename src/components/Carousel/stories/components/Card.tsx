import React from "react";

const Card = ({ index }: { index: number }) => {
  const imgUrl = `https://picsum.photos/id/${index + 110}/768/432`;

  return (
    <div
      className="card"
      style={{
        width: "100%",
        background: "#fff",
        borderRadius: "5px",
        boxShadow: "2px 2px 10px 0 rgba(0,0,0, 0.2)",
        padding: "16px",
        overflow: "hidden",
      }}
    >
      <div
        className="card__image"
        style={{
          position: "relative",
          height: 0,
          paddingTop: "56.25%",
          background: "#343434",
          marginBottom: "16px",
        }}
      >
        <img
          src={imgUrl}
          alt=""
          style={{
            position: "absolute",
            maxWidth: "100%",
            height: "auto",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </div>
      <div className="card__header">
        <h3 className="card__title">
          <a href="https://google.com" target="_blank" rel="noreferrer">
            Lorem ipsum dolor sit.
          </a>
        </h3>
      </div>
      <div className="card__body">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus
        facilis quod architecto asperiores ipsum, ipsa, placeat molestiae rerum
        nulla nobis laboriosam quia a excepturi autem cum odio similique. Soluta
        facere, non ducimus fuga nobis sed praesentium.
        <button onClick={() => console.log("click")}>Click</button>
      </div>
    </div>
  );
};

export default Card;
