import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineCamera } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { apiUpdateCurrentUser } from "~/apis/user";
import InputForm from "~/components/InputForm";
import Loading from "~/components/Loading";
import { fetchCurrentUser } from "~/store/action/user";
import { appActions } from "~/store/slice/app";
import { Toast } from "~/utils/alert";
import { toBase64 } from "~/utils/helper";

function UserInfo() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { accessToken } = useSelector((state) => state.user);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch
  } = useForm();
  const handleSubmitUserInfo =async (data) => {
    const formData = new FormData()
    formData.append('avatar',data.avatar[0])
    formData.append('document',JSON.stringify({...data}))
    dispatch(appActions.toggleModal({isShowModal:true,childrenModal:<Loading/>}))
    const response = await apiUpdateCurrentUser({accessToken:accessToken,formData})
    dispatch(appActions.toggleModal({isShowModal:false,childrenModal:null}))
    if(response.success){
      dispatch(fetchCurrentUser({token: accessToken}))
      return Toast.fire({icon:'success',title:'Cập nhật thông tin thành công'})
    }else{
      return Toast.fire({icon:'error',title:response.message})
    }
  };
  useEffect(() => {
    reset({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone || "",
      address: userData.address || "",
    });
  }, [userData]);
  const handleAvatarToPreview =async (file) => {
    const preview =await toBase64(file)
    setPreviewAvatar(preview)
  }
  useEffect(() => {
    if(watch('avatar')?.length>0){  
      handleAvatarToPreview(watch('avatar')[0])
    }
  }, [watch('avatar')])
  return (
    <div className="">
      <div className=" bg-gray-100 h-[60px]">
        <h1 className="text-2xl font-semibold p-3">Thông tin</h1>
      </div>
      <div className="max-w-[600px] mx-auto">
        <form onSubmit={handleSubmit(handleSubmitUserInfo)}>
          <div className="mt-5 flex justify-center">
            <div className="relative w-20 h-20 outline outline-1 rounded-full overflow-hidden">
              <label
                htmlFor="profilePicture"
                className="absolute inset-0 cursor-pointer rounded-full bg-transparent"
              >
                {userData?.avatar?.url ? (
                  <img
                    src={previewAvatar ? previewAvatar :userData?.avatar?.url}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary bg-blue-50/50">
                    <HiOutlineCamera className="w-8 h-auto" />
                  </div>
                )}
              </label>
              <input
                type="file"
                id="profilePicture"
                className="sr-only"
                {...register("avatar")}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <InputForm
              id="firstName"
              validate={{ required: "Không được để trống" }}
              cssParents="flex-1"
              label="Họ"
              register={register}
              error={errors}
            />
            <InputForm
              id="lastName"
              validate={{ required: "Không được để trống" }}
              cssParents="flex-1"
              label="Tên"
              register={register}
              error={errors}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <InputForm
              id="email"
              validate={{ required: "Không được để trống" }}
              cssParents="flex-1"
              label="Email"
              register={register}
              error={errors}
            />
            <InputForm
              id="phone"
              validate={{ required: "Không được để trống" }}
              cssParents="flex-1"
              label="Số điện thoại"
              register={register}
              error={errors}
            />
          </div>
          <InputForm
              id="address"
              validate={{ required: "Không được để trống" }}
              cssParents="flex-1"
              label="Địa chỉ"
              register={register}
              error={errors}
            />
          <p className="mt-2 capitalize">Vai trò: {userData?.role}</p>
          <p className="mt-2">
            Ngày tạo: {moment(userData.createdAt).format("DD/MM/YYYY HH:mm")}
          </p>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-primary text-white py-2 px-10 rounded-md mt-2"
              disabled={!isDirty}
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserInfo;
