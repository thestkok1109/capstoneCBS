import fetcher from "./fetcher";
export const loginAuthAPI = async (data) => {
  // data = {taikhoan:..., matkhau:....} => backend quy dinh
  try {
    const response = await fetcher.post("QuanLyNguoiDung/DangNhap", data);
    console.log("data", response.data.content);
    return response.data.content;
  } catch (error) {
    throw Error(error);
  }
};
export const registerAuthAPI = async (data) => {
  try {
    const response = await fetcher.post("QuanLyNguoiDung/DangKy", data);
    console.log("register data", response.data.content);
    return response.data.content;
  } catch (error) {
    throw Error(error);
  }
};
