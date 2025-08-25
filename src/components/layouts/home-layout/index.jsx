import { Button } from "@/components/ui/button";
import { PATH } from "@/routes/path";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ROLE } from "@/constants/role";

export default function HomeLayout({ children }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  // Lấy user từ localStorage
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate(PATH.LOGIN);
  };

  const handleMovieHubClick = () => {
    navigate(PATH.HOME);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  const handleDashboardClick = () => {
    navigate("/admin/user-management");
    setShowDropdown(false);
  };

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setShowDropdown(false);
    }, 150);
    setTimeoutId(id);
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black via-black/80 to-transparent px-8 py-4 flex justify-between items-center">
        <h1
          className="text-3xl font-bold text-red-600 cursor-pointer hover:text-red-400 transition-colors"
          onClick={handleMovieHubClick}
        >
          MovieHub
        </h1>
        <nav className="space-x-6 text-lg">
          <a href="#" className="hover:text-red-400">
            Home
          </a>
          <a href="#" className="hover:text-red-400">
            Movies
          </a>
          {user ? (
            <>
              <div
                className="relative inline-block"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="font-semibold cursor-pointer hover:text-red-400">
                  {user.hoTen}
                </span>
                {showDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 text-white rounded-lg shadow-xl py-2 z-50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition-colors duration-200"
                      onClick={handleProfileClick}
                    >
                      Profile
                    </button>
                    {user.maLoaiNguoiDung === ROLE.ADMIN && (
                      <button
                        className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition-colors duration-200"
                        onClick={handleDashboardClick}
                      >
                        Dashboard
                      </button>
                    )}
                  </div>
                )}
              </div>
              <Button
                variant="destructive"
                className="ml-4"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => navigate(PATH.LOGIN)}
            >
              Đăng nhập
            </Button>
          )}
        </nav>
      </header>
      {/* <Outlet /> */}
      {children}
      {/* Footer */}
      <footer className="bg-gray-900 mt-16 px-8 py-12 text-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4
              className="text-xl font-semibold mb-4 text-red-500 cursor-pointer hover:text-red-400 transition-colors"
              onClick={handleMovieHubClick}
            >
              MovieHub
            </h4>
            <p className="text-sm">
              Trang web xem phim online với giao diện hiện đại, tốc độ cao, chất
              lượng HD. Cập nhật phim mới mỗi ngày.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Phim lẻ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Phim bộ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Thể loại
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Theo dõi chúng tôi</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">
                Facebook
              </a>
              <a href="#" className="hover:text-white">
                YouTube
              </a>
              <a href="#" className="hover:text-white">
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          © 2025 MovieHub.
        </div>
      </footer>
    </div>
  );
}
