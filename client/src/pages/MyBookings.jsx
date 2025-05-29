import React, { useEffect } from "react";
import Title from "../components/Title";
import { assets, userBookingsDummyData } from "../assets/assets";

const MyBookings = () => {
  const [bookings, setBookings] = React.useState([]);

  useEffect(() => {
    const fetchBookings = () => {
      const dummingBook = userBookingsDummyData;
      setBookings(dummingBook);
    };

    fetchBookings();
  }, []);

  return (
    <div className="py-20 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus voluptatum iusto suscipit incidunt ipsam ipsum deserunt! Tempora ducimus dolores earum expedita repellat illum provident laboriosam! Architecto minima odit voluptates amet?"
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800 mx-auto">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
          <div>Hotels</div>
          <div>Date & Timing</div>
          <div>Payment Status</div>
        </div>
      </div>

      {bookings.map((bookings, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
        >
          {/* ---- Hotel Details ---- */}
          <div className="flex flex-col md:flex-row items-center gap-1">
            <img
              src={bookings.room.images[0]}
              alt="hotel-image"
              className="md:w-44 rounded shadow object-cover"
            />
            <div className="flex flex-col gap-1.5 max-md:mt-3 md:ml-4">
              <p className="font-playfair text-gray-800 text-lg md:text-xl">
                {bookings.hotel.name}
                <span className="font-inter text-sm">
                  {" "}
                  ({bookings.room.roomType})
                </span>
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{bookings.hotel.address}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                <img src={assets.guestsIcon} alt="guest-icon" />
                <span>{bookings.guests}</span>
              </div>
              <p className="text-base">Total: ${bookings.totalPrice}</p>
            </div>
          </div>
          {/* ---- Date & Time ---- */}
          <div className="flex flex-row md:items-center md:gap-12 mt-13 gap-8">
            <div>
              <p>Check-In:</p>
              <p className="text-gray-500 text-sm">
                {new Date(bookings.checkInDate).toDateString()}
              </p>
            </div>
            <div>
              <p>Check-Out:</p>
              <p className="text-gray-500 text-sm">
                {new Date(bookings.checkOutDate).toDateString()}
              </p>
            </div>
          </div>
          {/* ---- Payment Status ---- */}
          <div className="flex flex-col justify-center pt-3 items-start">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  bookings.isPaid ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <p
                className={`text-sm ${
                  bookings.isPaid ? "text-green-500" : "text-red-500"
                }`}
              >
                {bookings.isPaid ? "Paid" : "Unpaid"}
              </p>
            </div>
            {!bookings.isPaid && (
              <button className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 teansition-all cursor-pointer">
                Pay Now
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
