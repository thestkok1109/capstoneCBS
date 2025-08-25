import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PATH } from "@/routes/path";
import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerAuthAPI } from "@/apis/auth";
import { useMutation } from "@tanstack/react-query";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDt: "",
    hoTen: "",
  });

  const mutation = useMutation({
    mutationFn: (data) => registerAuthAPI(data),
    onSuccess: () => {
      toast.success("Đăng ký thành công!");
      setTimeout(() => {
        navigate("/auth/login");
      }, 1500); // 1.5 giây
      setForm({
        taiKhoan: "",
        matKhau: "",
        email: "",
        soDt: "",
        hoTen: "",
      });
    },
    onError: () => {
      toast.error("Đăng ký không thành công!");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Regex validate
  const validateForm = () => {
    if (!/^\w{4,}$/.test(form.taiKhoan)) {
      toast.error(
        "Tài khoản phải từ 4 ký tự trở lên, không chứa ký tự đặc biệt!"
      );
      return false;
    }
    if (!/^([\p{L} ]{2,})$/u.test(form.hoTen)) {
      toast.error(
        "Họ tên phải từ 2 ký tự trở lên, chỉ chứa chữ cái và khoảng trắng!"
      );
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Email không hợp lệ!");
      return false;
    }
    if (!/^.{6,}$/.test(form.matKhau)) {
      toast.error("Mật khẩu phải từ 6 ký tự trở lên!");
      return false;
    }
    if (!/^(0[0-9]{9,10})$/.test(form.soDt)) {
      toast.error("Số điện thoại phải bắt đầu bằng 0 và có 10-11 số!");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate({ ...form, maNhom: "GP01" });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
        Tạo tài khoản
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Bắt đầu hành trình điện ảnh của bạn với MovieHub
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Tài khoản"
            name="taiKhoan"
            value={form.taiKhoan}
            onChange={handleChange}
          />
          <Input
            placeholder="Họ và Tên"
            name="hoTen"
            value={form.hoTen}
            onChange={handleChange}
          />
        </div>
        <Input
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          type="password"
          placeholder="Mật khẩu"
          name="matKhau"
          value={form.matKhau}
          onChange={handleChange}
        />
        <Input
          type="tel"
          placeholder="Số điện thoại"
          name="soDt"
          value={form.soDt}
          onChange={handleChange}
        />

        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-base"
        >
          Đăng Ký
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Đã có tài khoản?{" "}
        <Link
          to={PATH.LOGIN}
          className="font-semibold text-red-600 hover:underline"
        >
          Đăng nhập ngay
        </Link>
      </p>
      <ToastContainer />
    </div>
  );
}
