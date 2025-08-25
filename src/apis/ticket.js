import fetcher from "./fetcher";

export const getPhongVe = async (showtimeId) => {
  try {
    const response = await fetcher.get(
      `QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${showtimeId}`
    );
    return response.data.content;
  } catch (error) {
    console.error(
      `Error fetching ticket room for showtime ${showtimeId}:`,
      error
    );
    throw error;
  }
};
