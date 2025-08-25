import { getPhongVe } from "@/apis/ticket";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaChair } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const Seat = ({ seatInfo, onSelect, isSelected }) => {
  const getSeatClass = () => {
    let baseClass =
      "w-8 h-8 m-1 flex items-center justify-center rounded-md text-xs transition-all";
    if (seatInfo.daDat) {
      return `${baseClass} bg-gray-600 text-gray-400 cursor-not-allowed`;
    }
    if (isSelected) {
      return `${baseClass} bg-orange-500 text-white shadow-lg shadow-orange-500/50`;
    }
    if (seatInfo.loaiGhe === "Vip") {
      return `${baseClass} bg-green-500 hover:bg-green-400 text-white cursor-pointer`;
    }
    return `${baseClass} bg-gray-700 hover:bg-gray-600 text-gray-300 cursor-pointer`;
  };

  return (
    <button
      className={getSeatClass()}
      disabled={seatInfo.daDat}
      onClick={() => onSelect(seatInfo)}
    >
      {seatInfo.daDat ? <MdClose /> : seatInfo.tenGhe}
    </button>
  );
};

export default function Ticket() {
  const { showtimeId } = useParams();
  const [ticketRoom, setTicketRoom] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes

  useEffect(() => {
    getPhongVe(showtimeId).then((data) => {
      setTicketRoom(data);
    });
  }, [showtimeId]);

  useEffect(() => {
    if (timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleSelectSeat = (seat) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.maGhe === seat.maGhe);
      if (isSelected) {
        return prev.filter((s) => s.maGhe !== seat.maGhe);
      }
      return [...prev, seat];
    });
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế!");
      return;
    }

    // In a real app, you would make an API call here to book the tickets.
    // For this demo, we'll just simulate the success.

    alert(
      `Đặt vé thành công cho ${
        selectedSeats.length
      } ghế! Tổng tiền: ${totalPrice.toLocaleString("vi-VN")} đ`
    );

    // Update the UI to show seats as booked
    const bookedSeatIds = selectedSeats.map((s) => s.maGhe);
    setTicketRoom((prev) => ({
      ...prev,
      danhSachGhe: prev.danhSachGhe.map((seat) =>
        bookedSeatIds.includes(seat.maGhe) ? { ...seat, daDat: true } : seat
      ),
    }));

    // Clear selection
    setSelectedSeats([]);
  };

  if (!ticketRoom) return <div>Đang tải thông tin phòng vé...</div>;

  const { thongTinPhim, danhSachGhe } = ticketRoom;
  const totalPrice = selectedSeats.reduce((acc, seat) => acc + seat.giaVe, 0);

  const renderSeats = () => {
    const seats = [];
    for (let i = 0; i < danhSachGhe.length; i += 16) {
      seats.push(danhSachGhe.slice(i, i + 16));
    }
    const rowLetters = "ABCDEFGHIJ".split("");

    return seats.map((row, rowIndex) => (
      <div key={rowIndex} className="flex items-center">
        <div className="w-8 text-center font-bold text-gray-400">
          {rowLetters[rowIndex]}
        </div>
        <div className="flex">
          {row.map((seat) => (
            <Seat
              key={seat.maGhe}
              seatInfo={seat}
              onSelect={handleSelectSeat}
              isSelected={selectedSeats.some((s) => s.maGhe === seat.maGhe)}
            />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-4">
      <div className="grid grid-cols-12 gap-6 w-full max-w-7xl">
        {/* Left - Seat Selection */}
        <div className="col-span-8 bg-gray-900 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">{thongTinPhim.tenCumRap}</h2>
              <p className="text-sm text-gray-400">
                {thongTinPhim.ngayChieu} - {thongTinPhim.gioChieu} -{" "}
                {thongTinPhim.tenRap}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Thời gian giữ ghế</p>
              <p className="text-2xl font-bold text-red-500">
                {`${Math.floor(timeRemaining / 60)}`.padStart(2, "0")}:
                {`${timeRemaining % 60}`.padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="bg-black py-2 text-center text-white rounded-t-lg shadow-inner-top">
            Màn hình
          </div>
          <div className="flex flex-col items-center py-6">{renderSeats()}</div>

          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-700 rounded-md mr-2"></div>
              <span>Ghế thường</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-md mr-2"></div>
              <span>Ghế VIP</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-orange-500 rounded-md mr-2"></div>
              <span>Ghế đang chọn</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-600 flex items-center justify-center rounded-md mr-2">
                <MdClose />
              </div>
              <span>Ghế đã đặt</span>
            </div>
          </div>
        </div>

        {/* Right - Booking Summary */}
        <div className="col-span-4 bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-3xl font-bold text-center mb-6 text-green-400">
            {totalPrice.toLocaleString("vi-VN")} đ
          </h2>

          <div className="space-y-4 text-sm flex-grow">
            <div className="border-b border-gray-700 pb-2">
              <span className="font-bold text-lg">{thongTinPhim.tenPhim}</span>
            </div>
            <div>
              <strong>Cụm rạp:</strong> {thongTinPhim.tenCumRap}
            </div>
            <div>
              <strong>Ngày giờ chiếu:</strong> {thongTinPhim.ngayChieu} -{" "}
              {thongTinPhim.gioChieu}
            </div>
            <div>
              <strong>Rạp:</strong> {thongTinPhim.tenRap}
            </div>
            <div className="flex flex-wrap items-center">
              <strong className="mr-2">Ghế chọn:</strong>
              {selectedSeats.map((s) => s.tenGhe).join(", ")}
            </div>
            <div>
              <strong>Ưu đãi:</strong> 0%
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={selectedSeats.length === 0}
            className={`w-full font-bold py-3 rounded-lg mt-6 transition-all ${
              selectedSeats.length > 0
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            ĐẶT VÉ
          </button>
        </div>
      </div>
    </div>
  );
}
