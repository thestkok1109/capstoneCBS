import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieById } from "@/apis/getMovieById";
import {
  getHeThongRap,
  getCumRapTheoHeThong,
  taoLichChieu,
} from "@/apis/showtime";
import dayjs from "dayjs";

const CreateShowtimeForm = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [heThongRap, setHeThongRap] = useState([]);
  const [cumRap, setCumRap] = useState([]);
  const [selectedHeThong, setSelectedHeThong] = useState("");
  const [selectedCumRap, setSelectedCumRap] = useState("");
  const [ngayChieuGioChieu, setNgayChieuGioChieu] = useState("");
  const [giaVe, setGiaVe] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lấy thông tin phim
    getMovieById(id).then(setMovie);
    // Lấy danh sách hệ thống rạp
    getHeThongRap().then((res) => setHeThongRap(res.data.content || res.data));
  }, [id]);

  const handleHeThongChange = async (e) => {
    const value = e.target.value;
    setSelectedHeThong(value);
    setSelectedCumRap("");
    setCumRap([]);
    if (value) {
      const res = await getCumRapTheoHeThong(value);
      setCumRap(res.data.content || res.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCumRap || !ngayChieuGioChieu || !giaVe) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setLoading(true);
    try {
      await taoLichChieu({
        maPhim: id,
        maRap: selectedCumRap,
        ngayChieuGioChieu: dayjs(ngayChieuGioChieu).format(
          "DD/MM/YYYY HH:mm:ss"
        ),
        giaVe: Number(giaVe),
      });
      alert("Tạo lịch chiếu thành công!");
      // Reset form nếu muốn
      setSelectedHeThong("");
      setSelectedCumRap("");
      setNgayChieuGioChieu("");
      setGiaVe("");
      setCumRap([]);
    } catch {
      alert("Có lỗi khi tạo lịch chiếu!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow mt-10 flex flex-col md:flex-row gap-6">
      {/* Poster */}
      <div className="w-full md:w-1/3 flex flex-col items-center">
        <img
          src={movie?.hinhAnh}
          alt={movie?.tenPhim}
          className="rounded shadow-md w-full max-w-xs object-cover"
        />
        <h3 className="mt-4 text-lg font-semibold text-center">
          {movie?.tenPhim}
        </h3>
      </div>
      {/* Form */}
      <div className="w-full md:w-2/3">
        <h2 className="text-2xl font-semibold mb-4">
          Tạo lịch chiếu cho phim: {movie?.tenPhim}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium">Hệ thống rạp:</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedHeThong}
              onChange={handleHeThongChange}
            >
              <option value="">Chọn hệ thống rạp</option>
              {heThongRap.map((item) => (
                <option key={item.maHeThongRap} value={item.maHeThongRap}>
                  {item.tenHeThongRap}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Cụm rạp:</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedCumRap}
              onChange={(e) => setSelectedCumRap(e.target.value)}
              disabled={!selectedHeThong}
            >
              <option value="">Chọn cụm rạp</option>
              {cumRap.map((item) => (
                <option key={item.maCumRap} value={item.maCumRap}>
                  {item.tenCumRap}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Ngày chiếu giờ chiếu:
            </label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              value={ngayChieuGioChieu}
              onChange={(e) => setNgayChieuGioChieu(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Giá vé:</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập giá vé"
              value={giaVe}
              onChange={(e) => setGiaVe(e.target.value)}
              min={75000}
              max={200000}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo lịch chiếu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShowtimeForm;
