import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineCamera } from "react-icons/hi";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiShield, FiSave, FiRotateCcw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { apiUpdateCurrentUser } from "~/apis/user";
import InputForm from "~/components/InputForm";
import Loading from "~/components/Loading";
import { fetchCurrentUser } from "~/store/action/user";
import { appActions } from "~/store/slice/app";
import { Toast } from "~/utils/alert";
import { toBase64 } from "~/utils/helper";
import { DefaultUser } from "~/assets/images";

function UserInfo() {
  const dispatch = useDispatch();
  const { userData, accessToken } = useSelector((state) => state.user);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm();

  const handleSubmitUserInfo = async (data) => {
    const formData = new FormData();
    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }
    formData.append("document", JSON.stringify({ ...data }));

    dispatch(
      appActions.toggleModal({ isShowModal: true, childrenModal: <Loading /> })
    );

    const response = await apiUpdateCurrentUser({
      accessToken: accessToken,
      formData,
    });

    dispatch(
      appActions.toggleModal({ isShowModal: false, childrenModal: null })
    );

    if (response?.success) {
      dispatch(fetchCurrentUser({ token: accessToken }));
      return Toast.fire({
        icon: "success",
        title: "Cập nhật thông tin thành công",
      });
    } else {
      return Toast.fire({ icon: "error", title: response?.message || "Cập nhật thất bại" });
    }
  };

  useEffect(() => {
    reset({
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
    });
    setPreviewAvatar(null);
  }, [userData, reset]);

  const handleAvatarToPreview = async (file) => {
    if (!file) return;
    const preview = await toBase64(file);
    setPreviewAvatar(preview);
  };

  useEffect(() => {
    const avatarFiles = watch("avatar");
    if (avatarFiles && avatarFiles.length > 0) {
      handleAvatarToPreview(avatarFiles[0]);
    }
  }, [watch("avatar")]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <FiUser className="text-main text-2xl" />
            <span>Hồ sơ cá nhân</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý và cập nhật thông tin tài khoản, địa chỉ nhận hàng của bạn
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Tài khoản đã kích hoạt
          </span>
        </div>
      </div>

      {/* Main Profile Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit(handleSubmitUserInfo)} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-main via-rose-400 to-amber-400 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                  <img
                    src={previewAvatar || userData?.avatar?.url || DefaultUser}
                    alt="avatar"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = DefaultUser;
                    }}
                  />
                  {/* Overlay camera */}
                  <label
                    htmlFor="profilePicture"
                    className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-xs font-medium"
                  >
                    <HiOutlineCamera className="text-2xl mb-0.5" />
                    <span>Đổi ảnh</span>
                  </label>
                </div>
              </div>
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                className="sr-only"
                {...register("avatar")}
              />
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-lg font-bold text-gray-900">
                {userData?.firstName} {userData?.lastName}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <FiMail className="text-gray-400" />
                  {userData?.email}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1">
                  <FiCalendar className="text-gray-400" />
                  Gia nhập: {moment(userData?.createdAt).format("DD/MM/YYYY")}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Hỗ trợ ảnh định dạng JPG, PNG, WEBP (tối đa 5MB)
              </p>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <FiUser className="text-gray-400" />
                Họ đệm <span className="text-main">*</span>
              </label>
              <InputForm
                id="firstName"
                validate={{ required: "Vui lòng nhập họ đệm" }}
                placeholder="Nguyễn Văn"
                register={register}
                error={errors}
                cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <FiUser className="text-gray-400" />
                Tên <span className="text-main">*</span>
              </label>
              <InputForm
                id="lastName"
                validate={{ required: "Vui lòng nhập tên" }}
                placeholder="An"
                register={register}
                error={errors}
                cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <FiMail className="text-gray-400" />
                Địa chỉ Email <span className="text-main">*</span>
              </label>
              <InputForm
                id="email"
                validate={{
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                }}
                placeholder="email@example.com"
                register={register}
                error={errors}
                cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <FiPhone className="text-gray-400" />
                Số điện thoại
              </label>
              <InputForm
                id="phone"
                validate={{
                  pattern: {
                    value: /^0\d{9}$/,
                    message: "Số điện thoại phải có 10 chữ số (bắt đầu bằng 0)",
                  },
                }}
                placeholder="0987654321"
                register={register}
                error={errors}
                cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <FiMapPin className="text-gray-400" />
                Địa chỉ giao hàng mặc định
              </label>
              <InputForm
                id="address"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                register={register}
                error={errors}
                cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm"
              />
            </div>
          </div>

          {/* Account Meta & Actions */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FiShield className="text-gray-400 text-sm" />
              <span>Vai trò hệ thống:</span>
              <span className="font-semibold text-gray-800 capitalize bg-gray-100 px-2 py-0.5 rounded-md">
                {userData?.role || "user"}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() =>
                  reset({
                    firstName: userData?.firstName || "",
                    lastName: userData?.lastName || "",
                    email: userData?.email || "",
                    phone: userData?.phone || "",
                    address: userData?.address || "",
                  })
                }
                disabled={!isDirty && !previewAvatar}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                <FiRotateCcw className="text-sm" />
                <span>Đặt lại</span>
              </button>

              <button
                type="submit"
                disabled={!isDirty && !previewAvatar}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-main hover:bg-red-600 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all transform active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <FiSave className="text-sm" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserInfo;
