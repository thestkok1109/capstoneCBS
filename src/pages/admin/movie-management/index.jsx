import {
  listMovieAPI,
  deleteMovieAPI,
  updateMovieAPI,
  addMovieAPI,
} from "@/apis/movie";
import { PATH } from "@/routes/path";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function MovieManagement() {
  const [page, setPage] = useState(1);
  const [editForm, setEditForm] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    tenPhim: "",
    trailer: "",
    moTa: "",
    ngayKhoiChieu: "",
    dangChieu: false,
    sapChieu: false,
    hot: false,
    danhGia: 0,
    hinhAnh: null,
    maNhom: "GP01",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryFn: () =>
      listMovieAPI({ soTrang: page, soPhanTuTrenTrang: 10, maNhom: "GP01" }),
    queryKey: [
      "movie-list",
      { soTrang: page, soPhanTuTrenTrang: 10, maNhom: "GP01" },
    ],
    keepPreviousData: true,
  });
  const movies = data?.items || [];
  const totalPages =
    data?.totalPages || Math.ceil((data?.totalCount || 0) / 10) || 1;
  console.log("data", data);
  const deleteMutation = useMutation({
    mutationFn: (maPhim) => deleteMovieAPI(maPhim),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movie-list"] });
    },
  });
  const updateMutation = useMutation({
    mutationFn: (formData) => updateMovieAPI(formData),
    onSuccess: () => {
      setShowEdit(false);
      queryClient.invalidateQueries({ queryKey: ["movie-list"] });
    },
  });
  const addMutation = useMutation({
    mutationFn: (formData) => addMovieAPI(formData),
    onSuccess: () => {
      setShowAdd(false);
      setAddForm({
        tenPhim: "",
        trailer: "",
        moTa: "",
        ngayKhoiChieu: "",
        dangChieu: false,
        sapChieu: false,
        hot: false,
        danhGia: 0,
        hinhAnh: null,
        maNhom: "GP01",
      });
      queryClient.invalidateQueries({ queryKey: ["movie-list"] });
    },
  });

  function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <div>
      {" "}
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Title & Button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Quản lý Phim</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowAdd(true)}
          >
            Thêm phim
          </button>
        </div>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Input search text"
          className="w-full px-4 py-2 border rounded mb-4"
        />

        {/* Table */}
        <table className="min-w-full bg-white border rounded shadow-sm">
          <thead>
            <tr className="bg-gray-200 text-left text-sm font-semibold">
              <th className="p-3">Mã phim</th>
              <th className="p-3">Hình ảnh</th>
              <th className="p-3">Tên phim</th>
              <th className="p-3">Mô tả</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Đang tải...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-red-500">
                  Lỗi tải dữ liệu
                </td>
              </tr>
            ) : movies.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Không có phim
                </td>
              </tr>
            ) : (
              movies.map((film) => (
                <tr key={film.maPhim} className="border-t">
                  <td className="p-3">{film.maPhim}</td>
                  <td className="p-3">
                    <img
                      src={film.hinhAnh}
                      alt={film.tenPhim}
                      className="w-12 h-16 object-cover"
                    />
                  </td>
                  <td className="p-3">{film.tenPhim}</td>
                  <td className="p-3 text-sm text-gray-700">{film.moTa}</td>
                  <td className="p-3 flex space-x-3 text-lg">
                    <button
                      className="text-blue-600 hover:scale-110 transition"
                      onClick={() =>
                        navigate(`/admin/movie-management/edit/${film.maPhim}`)
                      }
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:scale-110 transition"
                      onClick={() => {
                        if (window.confirm("Bạn có chắc muốn xoá phim này?"))
                          deleteMutation.mutate(film.maPhim);
                      }}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="text-green-600 hover:scale-110 transition"
                      onClick={() =>
                        navigate(
                          `/admin/movie-management/show-time/${film.maPhim}`
                        )
                      }
                    >
                      <FaCalendarAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Phân trang */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Trang trước
          </button>
          <span className="px-3 py-1">
            {page} / {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Trang sau
          </button>
        </div>
      </div>
      {/* Modal sửa phim */}
      {showEdit && editForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 relative"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData();
              Object.entries(editForm).forEach(([key, value]) => {
                formData.append(key, value);
              });
              updateMutation.mutate(formData);
            }}
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-xl"
              onClick={() => setShowEdit(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Sửa phim</h2>
            <input
              className="border p-2 w-full"
              placeholder="Tên phim"
              value={editForm.tenPhim}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, tenPhim: e.target.value }))
              }
              required
            />
            <input
              className="border p-2 w-full"
              placeholder="Trailer"
              value={editForm.trailer}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, trailer: e.target.value }))
              }
            />
            <textarea
              className="border p-2 w-full"
              placeholder="Mô tả"
              value={editForm.moTa}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, moTa: e.target.value }))
              }
            />
            <input
              className="border p-2 w-full"
              type="date"
              value={editForm.ngayKhoiChieu}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, ngayKhoiChieu: e.target.value }))
              }
              required
            />
            <input
              className="border p-2 w-full"
              type="number"
              min="0"
              max="10"
              placeholder="Đánh giá"
              value={editForm.danhGia}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, danhGia: e.target.value }))
              }
            />
            <input
              className="border p-2 w-full"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditForm((f) => ({ ...f, hinhAnh: e.target.files[0] }))
              }
            />
            <div className="flex gap-2">
              <label>
                <input
                  type="checkbox"
                  checked={editForm.dangChieu}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, dangChieu: e.target.checked }))
                  }
                />{" "}
                Đang chiếu
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={editForm.sapChieu}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, sapChieu: e.target.checked }))
                  }
                />{" "}
                Sắp chiếu
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={editForm.hot}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, hot: e.target.checked }))
                  }
                />{" "}
                Hot
              </label>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              type="submit"
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
            {updateMutation.isError && (
              <div className="text-red-500 text-sm">Cập nhật thất bại!</div>
            )}
          </form>
        </div>
      )}
      {/* Modal thêm phim */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 relative"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData();
              Object.entries(addForm).forEach(([key, value]) => {
                if (key === "ngayKhoiChieu") {
                  formData.append(key, formatDateToDDMMYYYY(value));
                } else {
                  formData.append(key, value);
                }
              });
              addMutation.mutate(formData);
            }}
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-xl"
              onClick={() => setShowAdd(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Thêm phim mới</h2>
            <input
              className="border p-2 w-full"
              placeholder="Tên phim"
              value={addForm.tenPhim}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, tenPhim: e.target.value }))
              }
              required
            />
            <input
              className="border p-2 w-full"
              placeholder="Trailer"
              value={addForm.trailer}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, trailer: e.target.value }))
              }
            />
            <textarea
              className="border p-2 w-full"
              placeholder="Mô tả"
              value={addForm.moTa}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, moTa: e.target.value }))
              }
            />
            <input
              className="border p-2 w-full"
              type="date"
              value={addForm.ngayKhoiChieu}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, ngayKhoiChieu: e.target.value }))
              }
              required
            />
            <input
              className="border p-2 w-full"
              type="number"
              min="0"
              max="10"
              placeholder="Đánh giá"
              value={addForm.danhGia}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, danhGia: e.target.value }))
              }
            />
            <input
              className="border p-2 w-full"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setAddForm((f) => ({ ...f, hinhAnh: e.target.files[0] }))
              }
            />
            <div className="flex gap-2">
              <label>
                <input
                  type="checkbox"
                  checked={addForm.dangChieu}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, dangChieu: e.target.checked }))
                  }
                />{" "}
                Đang chiếu
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={addForm.sapChieu}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, sapChieu: e.target.checked }))
                  }
                />{" "}
                Sắp chiếu
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={addForm.hot}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, hot: e.target.checked }))
                  }
                />{" "}
                Hot
              </label>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              type="submit"
              disabled={addMutation.isLoading}
            >
              {addMutation.isLoading ? "Đang thêm..." : "Thêm phim"}
            </button>
            {addMutation.isError && (
              <div className="text-red-500 text-sm">Thêm phim thất bại!</div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
