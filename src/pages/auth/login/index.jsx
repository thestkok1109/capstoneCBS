import { loginAuthAPI } from "@/apis/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLE } from "@/constants/role";
import { PATH } from "@/routes/path";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Card,
  CardContent,
  CardAction,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();

  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
    },
  });

  const { mutate: loginUser } = useMutation({
    mutationFn: loginAuthAPI,
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));

      toast.success("đăng nhập thành công");
      if (data.maLoaiNguoiDung === ROLE.ADMIN) {
        setTimeout(() => {
          navigate(PATH.MOVIE_MANAGEMENT);
        }, 1500);
      }
      if (data.maLoaiNguoiDung === ROLE.USER) {
        setTimeout(() => {
          navigate(PATH.HOME);
        }, 1500);
      }
    },
    onError: () => {
      toast.error("đăng nhập thất bại");
    },
  });

  const onSubmit = (data) => {
    // Validate
    if (!/^\w{4,}$/.test(data.taiKhoan)) {
      toast.error(
        "Tài khoản phải từ 4 ký tự trở lên, không chứa ký tự đặc biệt!"
      );
      return;
    }
    if (!/^.{6,}$/.test(data.matKhau)) {
      toast.error("Mật khẩu phải từ 6 ký tự trở lên!");
      return;
    }
    console.log("submit-data", data);
    loginUser(data);
    reset();
  };
  return (
    <div>
      <form className="min-w-md space-y-3 " onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link" onClick={() => navigate("/auth/register")}>
                Sign Up
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="taiKhoan"
                    placeholder="Vui lòng nhập tài khoản"
                    {...register("taiKhoan")}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    name="matKhau"
                    type="password"
                    placeholder="Vui lòng nhập mật khẩu"
                    {...register("matKhau")}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full bg-gray-400 cursor-pointer">
              Login
            </Button>
            <Button variant="outline" className="w-full cursor-pointer">
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </form>
      <ToastContainer />
    </div>
  );
}
