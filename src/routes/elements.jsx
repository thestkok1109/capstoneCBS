import MovieManagement from "@/pages/admin/movie-management";
import UserManagement from "@/pages/admin/user-management";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import HomePage from "@/pages/home";
import MovieDetails from "@/pages/movie-details";
import Ticket from "@/pages/ticket";
import AddMovie from "@/pages/admin/movie-management/AddMovie";
import EditMovie from "@/pages/admin/movie-management/EditMovie";

import React from "react";
import { useRoutes } from "react-router-dom";
import { PATH } from "./path";
import HomeLayout from "@/components/layouts/home-layout";
import AuthLayout from "@/components/layouts/auth";
import DashboardLayout from "@/components/layouts/dashboard";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import CreateShowtimeForm from "@/pages/admin/movie-management/showtime";
import UserDetail from "@/pages/user-detail";

const useRouterElements = () => {
  const elements = useRoutes([
    {
      path: PATH.HOME,
      element: (
        <HomeLayout>
          <HomePage />
        </HomeLayout>
      ),
    },
    {
      path: `${PATH.MOVIE_DETAILS}/:id`,
      element: (
        <HomeLayout>
          <MovieDetails />
        </HomeLayout>
      ),
    },
    {
      path: PATH.LOGIN,
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      ),
    },
    {
      path: PATH.REGISTER,
      element: (
        <AuthLayout>
          <Register />
        </AuthLayout>
      ),
    },
    {
      path: PATH.PROFILE,
      element: (
        <HomeLayout>
          <UserDetail />
        </HomeLayout>
      ),
    },
    {
      path: "/",
      element: <ProtectedAdminRoute />,
      children: [
        {
          path: PATH.USER_MANAGEMENT,
          element: (
            <DashboardLayout>
              <UserManagement />
            </DashboardLayout>
          ),
        },
        {
          path: PATH.MOVIE_MANAGEMENT,
          element: (
            <DashboardLayout>
              <MovieManagement />
            </DashboardLayout>
          ),
        },
        {
          path: PATH.ADMIN_MOVIE_ADD,
          element: (
            <DashboardLayout>
              <AddMovie />
            </DashboardLayout>
          ),
        },
        {
          path: PATH.ADMIN_MOVIE_EDIT,
          element: (
            <DashboardLayout>
              <EditMovie />
            </DashboardLayout>
          ),
        },
        {
          path: "/admin/movie-management/show-time/:id",
          element: (
            <DashboardLayout>
              <CreateShowtimeForm />
            </DashboardLayout>
          ),
        },
      ],
    },
    {
      path: `${PATH.TICKET}/:showtimeId`,
      element: (
        <HomeLayout>
          <Ticket />
        </HomeLayout>
      ),
    },
    { path: PATH.NOT_FOUND, element: <div>404 Not Found</div> },
  ]);
  return elements;
};

export default useRouterElements;
