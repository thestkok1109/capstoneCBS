import { listBannerAPI } from "@/apis/banner";
import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const response = await listBannerAPI();
      console.log("danh sach:", response.content);
      setBanners(response.content);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("banners", banners);

  return (
    <div>
      {/* Banner */}
      <section className="relative h-[100vh] mb-12">
        <Swiper
          modules={[Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          className="h-full"
          autoplay="true"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.maBanner}>
              <div
                className="w-full h-full bg-cover bg-center flex items-end "
                style={{ backgroundImage: `url(${banner.hinhAnh})` }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}
