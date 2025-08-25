import fetcher from "./fetcher";

export const listUserAPI = async (data) => {
  //data: {soTrang:1, soPhanTuTrenTrang: 10, maNhom=GP01}
  try {
    const response = await fetcher.get(
      "QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01",
      { params: data }
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching user list:", error);
    throw error;
  }
};

// Lấy thông tin tài khoản
export const getUserInfo = (taiKhoan) => {
  return fetcher.post("/QuanLyNguoiDung/ThongTinTaiKhoan", { taiKhoan });
};

//thêm tài khoản
export const addUser = (taiKhoan) => {
  console.log("tai khoan", taiKhoan);
  return fetcher.post("/QuanLyNguoiDung/ThemNguoiDung", taiKhoan);
};

// Cập nhật thông tin tài khoản
export const updateUserInfo = (data) => {
  return fetcher.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", data);
};

// tìm kiếm user
export const searchUser = (name) => {
  return fetcher.get(`/QuanLyNguoiDung/TimKiemNguoiDung?tuKhoa=${name}`);
};
