import fetcher from "./fetcher";

export const getDateByMovies = async (id) => {
  try {
    const response = await fetcher.get(
      `QuanLyPhim/LayThongTinPhim?MaPhim=${id}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching movie list:", error);
    throw error;
  }
};
