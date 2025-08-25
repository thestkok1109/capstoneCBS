import fetcher from "./fetcher";
import { useNavigate } from "react-router-dom";

export const getShowtimesByMovie = async (movieId) => {
  try {
    const response = await fetcher.get(
      `QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${movieId}`
    );
    return response.data.content;
  } catch (error) {
    console.error(`Error fetching showtimes for movie ${movieId}:`, error);
    throw error;
  }
};

export const createShowTime = async (data) => {
  // data: {tenPhim, trailer, moTa, ngayKhoiChieu, dangChieu, sapChieu, hot, danhGia, hinhAnh, maNhom}
  try {
    const response = await fetcher.post("QuanLyDatVe/TaoLichChieu", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding movie:", error);
    throw error;
  }
};

export const getHeThongRap = () =>
  fetcher.get("/QuanLyRap/LayThongTinHeThongRap");
export const getCumRapTheoHeThong = (maHeThongRap) =>
  fetcher.get(
    `/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`
  );
export const taoLichChieu = (data) =>
  fetcher.post("/QuanLyDatVe/TaoLichChieu", data);
