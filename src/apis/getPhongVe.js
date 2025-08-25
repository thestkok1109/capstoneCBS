import fetcher from "./fetcher";

export const getPhongVe = async (id) => {
  try {
    const response = await fetcher.get(
      `QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${id}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching movie list:", error);
    throw error;
  }
};
