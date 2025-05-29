import React, { useState } from "react";
import { roomsDummyData } from "../../assets/assets";
import Title from "../../components/Title";

export const ListRoom = () => {
  const [rooms, setRooms] = useState(roomsDummyData);

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        subTitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum debitis reiciendis natus quo dicta, porro ipsum assumenda nostrum voluptas sed ex eaque libero, sint, corrupti fugit quod sequi esse magnam?"
      />
      <p className="text-gray-500 mt-4">All Rooms</p>

      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-auto mt-3">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Facilty
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Price/night{" "}
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {rooms.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-grya-700 border-t border-gray-300">
                  {item.roomType}
                </td>

                <td className="px-4 py-3 text-gray-700 border-t border-gray-300">
                  {item.amenities.length === 1
                    ? item.amenities[0]
                    : item.amenities.slice(0, -1).join(", ") +
                      " and " +
                      item.amenities.slice(-1)}
                </td>

                <td className="px-4 py-3 text-gray-700 border-t border-gray-300 max-sm:hiden">
                  {item.pricePerNight}
                </td>

                <td className="px-4 py-3 text-center border-t border-gray-300 text-sm text-red-500">
                  <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable}
                      onChange={() => {
                        const updatedRooms = rooms.map((room, i) =>
                          i === index
                            ? { ...room, isAvailable: !room.isAvailable }
                            : room
                        );
                        setRooms(updatedRooms);
                      }}
                    />
                    <div className="relative w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-200">
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
