import fetcher from "./fetcher";

export const listBannerAPI = async (data) => {
  try {
    const response = await fetcher.get("QuanLyPhim/LayDanhSachBanner", {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching banner list:", error);
    throw error;
  }
};
