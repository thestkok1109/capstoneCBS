import fetcher from "./fetcher";

export const listMovieAPI = async (data) => {
  //data: {soTrang:1, soPhanTuTrenTrang: 10, maNhom=GP01}
  try {
    const response = await fetcher.get(
      "QuanLyPhim/LayDanhSachPhimPhanTrang?maNhom=GP01",
      { params: data }
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching movie list:", error);
    throw error;
  }
};

// Thêm phim
export const addMovieAPI = async (data) => {
  // data: {tenPhim, trailer, moTa, ngayKhoiChieu, dangChieu, sapChieu, hot, danhGia, hinhAnh, maNhom}
  try {
    const response = await fetcher.post("QuanLyPhim/ThemPhimUploadHinh", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.content;
  } catch (error) {
    console.error("Error adding movie:", error);
    throw error;
  }
};

// Xoá phim
export const deleteMovieAPI = async (maPhim) => {
  try {
    const response = await fetcher.delete(
      `QuanLyPhim/XoaPhim?MaPhim=${maPhim}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};

// Sửa phim
export const updateMovieAPI = async (data) => {
  // data: {maPhim, tenPhim, trailer, moTa, ngayKhoiChieu, dangChieu, sapChieu, hot, danhGia, hinhAnh, maNhom}
  try {
    const response = await fetcher.post("QuanLyPhim/CapNhatPhimUpload", data);
    return response.data.content;
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error;
  }
};
