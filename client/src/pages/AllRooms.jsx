import React, { useState } from "react";
import { assets, facilityIcons, roomsDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { Star } from "../components/Star";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        checked={selected}
        name="sortOption"
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const roomTypes = ["Single", "Double", "Suite", "Deluxe", "Family"];
  const priceRanges = ["0-500", "500-1000", "1000-1500", "1500-2000", "2000+"];
  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  const [openFilter, setOpenFilter] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState([]);
  const navigate = useNavigate();

  const handleSortChange = (option) => {
    setSelectedSortOption(option);
  };

  const handlePriceRangeChange = (checked, range) => {
    setSelectedPriceRange((prev) =>
      checked ? [...prev, range] : prev.filter((r) => r !== range)
    );
  };

  const handleRoomTypeChange = (checked, type) => {
    setSelectedRoomType((prev) =>
      checked ? [...prev, type] : prev.filter((r) => r !== type)
    );
  };

  const handleClearFilters = () => {
    setSelectedRoomType([]);
    setSelectedPriceRange([]);
    setSelectedSOrtOption("");
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div>
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum alias
            distinctio a voluptatibus maxime cupiditate quae. Rem incidunt
            minima, amet sequi culpa ratione, nam maiores fugit tempora est
            officia enim.
          </p>
        </div>

        {roomsDummyData.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-start gap-6 py-10 border-b border-gray-300 last:pb-30 last:border-0"
          >
            <img
              src={room.images[0]}
              alt="hotel-room-image"
              title="View Room Details"
              className="max-h-65 md:w-1/4 rounded-xl shadow-lg object-cover cursor-pointer"
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
            />
            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500">{room.hotel.city}</p>
              <p
                className="text-gray-800 text-3xl font-playfair cursor-pointer"
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
              >
                {room.hotel.name}
              </p>
              <div className="flex items-center">
                <Star />
                <p className="ml-2">200+ reviews</p>
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt="location-icon" />{" "}
                <span>{room.hotel.address}</span>
              </div>

              {/* Room Ammenities */}
              <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                {room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F7FF]/70"
                  >
                    <img
                      src={facilityIcons[item]}
                      alt={item}
                      className="w-5 h-5"
                    />
                    <p className="text-xs">{item}</p>
                  </div>
                ))}
              </div>

              {/* PPN */}
              <p className="text-xl font-medium text-gray-700">
                ${room.pricePerNight} /night
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Filters ---- */}
      <div className="bg-white w-80 border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16">
        <div
          className={`${
            openFilter && "border-b"
          } flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span
              className="lg:hidden"
              onClick={() => setOpenFilter(!openFilter)}
            >
              {openFilter ? "HIDE" : "SHOW"}
            </span>
            <span className="hidden lg:block" onClick={handleClearFilters}>
              CLEAR
            </span>
          </div>
        </div>

        <div
          className={`${
            openFilter ? "h-auto" : "h-0 lg:h-auto"
          } overflow-hidden transition-all duration-700`}
        >
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular filters</p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room}
                selected={selectedRoomType.includes(room)}
                onChange={handleRoomTypeChange}
              />
            ))}
          </div>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRanges.map((range, index) => (
              <CheckBox
                key={index}
                label={`$${range}`}
                selected={selectedPriceRange.includes(`$${range}`)}
                onChange={handlePriceRangeChange}
              />
            ))}
          </div>

          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSortOption == option}
                onChange={handleSortChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
