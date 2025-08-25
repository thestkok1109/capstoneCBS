import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { updateUserInfo } from "@/apis/user";
import { toast } from "react-toastify";

const EditUserForm = ({ user, onClose, onSave }) => {
  console.log(user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      userType: "KhachHang",
    },
  });

  useEffect(() => {
    if (user) {
      console.log("data edit", user);
      reset({
        username: user.taiKhoan || "",
        password: user.matKhau || "",
        fullName: user.hoTen || "",
        email: user.email || "",
        phone: user.soDT || "",
        userType: user.maLoaiNguoiDung || "KhachHang",
      });
    } else {
      reset({
        username: "",
        password: "",
        fullName: "",
        email: "",
        phone: "",
        userType: "KhachHang",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const submitData = {
      taiKhoan: data.username,
      matKhau: data.password,
      hoTen: data.fullName,
      email: data.email,
      soDT: data.phone,
      maNhom: "GP01",
      maLoaiNguoiDung: data.userType,
    };
    try {
      await updateUserInfo(submitData);
      toast.success("Cập nhật tài khoản thành công!");
      if (onSave) onSave(submitData);
      if (onClose) onClose();
    } catch (error) {
      toast.error("Cập nhật thất bại!", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-6">
        {user ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Tài khoản</label>
            <input
              type="text"
              {...register("username", { required: "Vui lòng nhập tài khoản" })}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              disabled={!!user}
            />
            {errors.username && (
              <span className="text-red-500 text-xs">
                {errors.username.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Vui lòng nhập email" })}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Mật khẩu</label>
            <input
              type="password"
              {...register("password", { required: "Vui lòng nhập mật khẩu" })}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Số điện thoại</label>
            <input
              type="text"
              {...register("phone", {
                required: "Vui lòng nhập số điện thoại",
              })}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.phone && (
              <span className="text-red-500 text-xs">
                {errors.phone.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Họ tên</label>
            <input
              type="text"
              {...register("fullName", { required: "Vui lòng nhập họ tên" })}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.fullName && (
              <span className="text-red-500 text-xs">
                {errors.fullName.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Loại người dùng</label>
            <select
              {...register("userType", { required: true })}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="KhachHang">Khách Hàng</option>
              <option value="QuanTri">Quản Trị</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {user ? "Lưu" : "Thêm"}
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
