import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovieById } from "@/apis/getMovieById";
import { updateMovieAPI } from "@/apis/movie";

export default function EditMovie() {
  const { id } = useParams();
  const [form, setForm] = useState({
    maPhim: "",
    biDanh: "",
    tenPhim: "",
    trailer: "",
    moTa: "",
    ngayKhoiChieu: "",
    dangChieu: false,
    sapChieu: false,
    hot: false,
    danhGia: 0,
    hinhAnh: null,
    maNhom: "GP01",
  });
  const [loading, setLoading] = useState(true);
  const [imgPreview, setImgPreview] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieById(id)
      .then((data) => {
        setForm({
          maPhim: data.maPhim,
          biDanh: data.biDanh,
          tenPhim: data.tenPhim || "",
          trailer: data.trailer || "",
          moTa: data.moTa || "",
          ngayKhoiChieu: data.ngayKhoiChieu
            ? data.ngayKhoiChieu.slice(0, 16)
            : "",
          sapChieu: data.sapChieu || false,
          dangChieu: data.dangChieu || false,
          hot: data.hot || false,
          danhGia: data.danhGia || 0,
          hinhAnh: data.hinhAnh,
          maNhom: data.maNhom || "GP01",
        });
        setImgPreview(data.hinhAnh || "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file && !file.type.startsWith("image/")) {
        alert("Vui lòng chọn file hình ảnh!");
        return;
      }
      setForm((prev) => ({ ...prev, [name]: file }));
      setImgPreview(
        file
          ? URL.createObjectURL(file)
          : typeof form.hinhAnh === "string"
          ? form.hinhAnh
          : ""
      );
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validateForm = () => {
    if (!form.tenPhim.trim()) {
      alert("Tên phim không được để trống!");
      return false;
    }
    if (!form.biDanh.trim()) {
      alert("Bí danh không được để trống!");
      return false;
    }
    if (!form.moTa.trim()) {
      alert("Mô tả không được để trống!");
      return false;
    }
    if (!form.ngayKhoiChieu) {
      alert("Ngày khởi chiếu không được để trống!");
      return false;
    }
    if (!form.danhGia || isNaN(form.danhGia) || form.danhGia < 0) {
      alert("Đánh giá phải là số không âm!");
      return false;
    }
    // Nếu là file mới thì phải là ảnh
    if (
      form.hinhAnh &&
      typeof form.hinhAnh !== "string" &&
      !form.hinhAnh.type.startsWith("image/")
    ) {
      alert("File hình ảnh không hợp lệ!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append("maPhim", form.maPhim || id);
    formData.append("tenPhim", form.tenPhim);
    formData.append("trailer", form.trailer);
    formData.append("biDanh", form.biDanh);
    formData.append("moTa", form.moTa);
    let ngayKhoiChieu = form.ngayKhoiChieu;
    if (ngayKhoiChieu && ngayKhoiChieu.length === 16) {
      ngayKhoiChieu = ngayKhoiChieu + ":00";
    }
    formData.append("ngayKhoiChieu", ngayKhoiChieu);
    formData.append("dangChieu", String(form.dangChieu));
    formData.append("sapChieu", String(form.sapChieu));
    formData.append("hot", String(form.hot));
    formData.append("danhGia", form.danhGia);
    formData.append("maNhom", form.maNhom);
    formData.append("File", form.hinhAnh, form.hinhAnh.name);
    try {
      await updateMovieAPI(formData);
      alert("Đã cập nhật thông tin phim!");
      setForm({
        maPhim: "",
        biDanh: "",
        tenPhim: "",
        trailer: "",
        moTa: "",
        ngayKhoiChieu: "",
        dangChieu: false,
        sapChieu: false,
        hot: false,
        danhGia: 0,
        hinhAnh: null,
        maNhom: "GP01",
      });
      setImgPreview("");
    } catch (err) {
      alert("Cập nhật phim thất bại!");
      console.log(err?.response?.data || err);
    }
  };

  if (loading) return <div>Đang tải thông tin phim...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Chỉnh sửa phim</h2>
      <input
        name="maPhim"
        value={id}
        onChange={handleChange}
        placeholder="mã phim"
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="tenPhim"
        value={form.tenPhim}
        onChange={handleChange}
        placeholder="Tên phim"
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="biDanh"
        value={form.biDanh}
        onChange={handleChange}
        placeholder="Bí danh"
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="trailer"
        value={form.trailer}
        onChange={handleChange}
        placeholder="Trailer"
        className="w-full mb-2 p-2 border rounded"
      />
      <textarea
        name="moTa"
        value={form.moTa}
        onChange={handleChange}
        placeholder="Mô tả"
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="ngayKhoiChieu"
        type="datetime-local"
        value={form.ngayKhoiChieu}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="maNhom"
        type="text"
        value={form.maNhom}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="danhGia"
        type="number"
        value={form.danhGia}
        onChange={handleChange}
        placeholder="Đánh giá"
        className="w-full mb-2 p-2 border rounded"
      />
      {/* Review ảnh */}
      {imgPreview && (
        <img
          src={imgPreview}
          alt="Hình ảnh phim"
          className="w-32 h-44 object-cover mb-2 mx-auto border"
        />
      )}
      <input
        name="hinhAnh"
        type="file"
        onChange={handleChange}
        className="w-full mb-2"
        accept="image/*"
      />
      <div className="flex gap-4 mb-2">
        <label>
          <input
            type="checkbox"
            name="dangChieu"
            checked={form.dangChieu}
            onChange={handleChange}
          />{" "}
          Đang chiếu
        </label>
        <label>
          <input
            type="checkbox"
            name="sapChieu"
            checked={form.sapChieu}
            onChange={handleChange}
          />{" "}
          Sắp chiếu
        </label>
        <label>
          <input
            type="checkbox"
            name="hot"
            checked={form.hot}
            onChange={handleChange}
          />{" "}
          Hot
        </label>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Cập nhật phim
      </button>
    </form>
  );
}
