import React, { useEffect, useState } from "react";
import { addUser, listUserAPI, updateUserInfo } from "@/apis/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditUserForm from "./editUser";

// Thêm API xoá và tìm kiếm user
import fetcher from "@/apis/fetcher";
const deleteUserAPI = (taiKhoan) =>
  fetcher.delete("/QuanLyNguoiDung/XoaNguoiDung", {
    params: { TaiKhoan: taiKhoan },
  });
const searchUserAPI = (tuKhoa) =>
  fetcher.get("/QuanLyNguoiDung/TimKiemNguoiDung", {
    params: { MaNhom: "GP01", tuKhoa },
  });

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDt: "",
    maNhom: "",
    maLoaiNguoiDung: "",
    hoTen: "",
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await listUserAPI();
      setUsers(data);
    } catch {
      toast.error("Không thể lấy danh sách user!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form bằng regex và kiểm tra trùng tài khoản/email
  const validateForm = () => {
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(form.taiKhoan)) {
      toast.error("Tài khoản phải từ 4-20 ký tự, chỉ gồm chữ, số, _");
      return false;
    }
    if (!/^.{6,}$/.test(form.matKhau)) {
      toast.error("Mật khẩu phải từ 6 ký tự trở lên");
      return false;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(form.soDt)) {
      toast.error("Số điện thoại không hợp lệ");
      return false;
    }
    // Kiểm tra trùng tài khoản/email
    if (users.some((u) => u.taiKhoan === form.taiKhoan)) {
      toast.error("Tài khoản đã tồn tại!");
      return false;
    }
    if (users.some((u) => u.email === form.email)) {
      toast.error("Email đã tồn tại!");
      return false;
    }
    return true;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await addUser({ ...form });
      toast.success("Tạo tài khoản thành công!");
      setShowAdd(false);
      setForm({
        taiKhoan: "",
        matKhau: "",
        email: "",
        soDt: "",
        hoTen: "",
        maNhom: "",
        maLoaiNguoiDung: "",
      });
      fetchUsers();
    } catch {
      toast.error("Tạo tài khoản thất bại!");
    }
  };

  const handleEditUser = async (formData) => {
    try {
      await updateUserInfo(formData);
      toast.success("Cập nhật tài khoản thành công!");
      setShowEdit(false);
      setSelectedUser(null);
      fetchUsers();
    } catch {
      toast.error("Cập nhật tài khoản thất bại!");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await searchUserAPI(search);
      setUsers(res.data.content);
    } catch {
      toast.error("Không tìm thấy người dùng!");
    }
  };

  const handleDeleteUser = async (taiKhoan) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá người dùng này?")) return;
    try {
      await deleteUserAPI(taiKhoan);
      toast.success("Xoá người dùng thành công!");
      fetchUsers();
    } catch {
      toast.error("Xoá người dùng thất bại!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Quản lý người dùng</h1>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white"
        >
          Tạo tài khoản
        </Button>
      </div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" className="bg-blue-500 text-white">
          Tìm kiếm
        </Button>
        <Button
          type="button"
          className="bg-gray-400 text-white"
          onClick={() => {
            setSearch("");
            fetchUsers();
          }}
        >
          Xóa tìm kiếm
        </Button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Tài khoản</th>
              <th className="p-2 border">Mật khẩu</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Số ĐT</th>
              <th className="p-2 border">Mã ND</th>
              <th className="p-2 border">Họ tên</th>
              <th className="p-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.taiKhoan}
                className="border-t hover:bg-blue-50 transition"
              >
                <td className="p-2 border">{user.taiKhoan}</td>
                <td className="p-2 border">{user.matKhau}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.soDT || user.soDt}</td>
                <td className="p-2 border">{user.maLoaiNguoiDung}</td>
                <td className="p-2 border">{user.hoTen}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowEdit(true);
                    }}
                    className="text-blue-600 hover:scale-110 transition"
                    title="Chỉnh sửa"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.taiKhoan)}
                    className="text-red-600 hover:scale-110 transition"
                    title="Xoá"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal tạo tài khoản */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 relative"
            onSubmit={handleAddUser}
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-xl"
              onClick={() => setShowAdd(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Tạo tài khoản mới</h2>
            <Input
              placeholder="Tài khoản"
              name="taiKhoan"
              value={form.taiKhoan}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              placeholder="Mật khẩu"
              name="matKhau"
              value={form.matKhau}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              type="tel"
              placeholder="Số điện thoại"
              name="soDt"
              value={form.soDt}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1">Mã nhóm</label>
              <select
                name="maNhom"
                value={form.maNhom}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="GP01">GP01</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Mã khách hàng
              </label>
              <select
                name="maLoaiNguoiDung"
                value={form.maLoaiNguoiDung}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="QuanTri">Quản Trị</option>
                <option value="KhachHang">Khách Hàng</option>
              </select>
            </div>
            <Input
              placeholder="Họ và tên"
              name="hoTen"
              value={form.hoTen}
              onChange={handleChange}
              required
            />
            <Button type="submit" className="w-full bg-blue-600 text-white">
              Tạo tài khoản
            </Button>
          </form>
        </div>
      )}
      {/* Modal chỉnh sửa tài khoản */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <EditUserForm
            user={selectedUser}
            onClose={() => {
              setShowEdit(false);
              setSelectedUser(null);
            }}
            onSave={handleEditUser}
          />
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
