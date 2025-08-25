import { listCinemax } from "@/apis/cinemax";

import React, { useState } from "react";
import { useEffect } from "react";

export default function ListMovies() {
  const [cinema, setCinema] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCinema();
  }, []);

  const fetchCinema = async () => {
    try {
      setLoading(true);
      const response = await listCinemax();
      console.log("danh sach cinema:", response);
      setCinema(response);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-8 py-16 bg-gradient-to-b from-black to-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-8 text-center underline decoration-red-600">
        🎟️ RẠP CHIẾU PHIM
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cinema.map((theater) => (
          <div key={theater.maHeThongRap} className="flex gap-4">
            <img
              src={theater.logo}
              alt={theater.tenHeThongRap}
              className="w-40 h-28 object-cover rounded shadow"
            />
            <div>
              <h3 className="text-xl font-semibold">{theater.tenHeThongRap}</h3>
              <p className="text-gray-300 text-sm mt-1 line-clamp-3">
                {theater.biDanh}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
