import { PATH } from "@/routes/path";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function DasboardLayout({ children }) {
  const navigate = useNavigate();
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

  const handleHome = () => {
    navigate(PATH.HOME);
  };

  return (
    <div>
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 bg-[#001529] text-white">
          <div
            className="p-4 font-bold text-xl border-b border-gray-700 cursor-pointer"
            onClick={() => handleHome()}
          >
            CYBERLEARN
          </div>
          <nav className="mt-4">
            <ul>
              <li
                className="px-6 py-3 hover:bg-[#1890ff] cursor-pointer"
                onClick={() => navigate(PATH.ADMIN_USER_MANAGEMENT)}
              >
                Users
              </li>
              <li
                className="px-6 py-3 hover:bg-[#1890ff] cursor-pointer"
                onClick={() => navigate(PATH.ADMIN_MOVIE_MANAGEMENT)}
              >
                Films
              </li>
            </ul>
          </nav>
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="bg-white p-4 flex justify-end items-center shadow-md">
            {user && (
              <div className="flex items-center gap-4">
                <span className="font-semibold">{user.hoTen}</span>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
