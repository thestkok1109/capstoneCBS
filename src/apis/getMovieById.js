import fetcher from "./fetcher";

export const getMovieById = async (id) => {
  try {
    const response = await fetcher.get(
      `QuanLyPhim/LayThongTinPhim?MaPhim=${id}`
    );
    console.log(response.data.content);
    return response.data.content;
  } catch (error) {
    console.error("Error fetching movie list:", error);
    throw error;
  }
};
