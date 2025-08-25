import fetcher from "./fetcher";

export const listCinemax = async (data) => {
  //data: {soTrang:1, soPhanTuTrenTrang: 10, maNhom=GP01}
  try {
    const response = await fetcher.get("QuanLyRap/LayThongTinHeThongRap", {
      params: data,
    });
    return response.data.content;
  } catch (error) {
    console.error("Error fetching movie list:", error);
    throw error;
  }
};
