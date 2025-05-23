import React from "react";

const HotelCard = ({ room, index }) => {
  return (
    <div>
      <Link
        to={"/rooms/" + room._id}
        onClick={() => scrollTo(0, 0)}
        key={room._id}
      ></Link>
    </div>
  );
};

export default HotelCard;
