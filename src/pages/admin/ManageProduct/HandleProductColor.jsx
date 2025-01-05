import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegTrashAlt } from "react-icons/fa";
import { HiOutlineCamera } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createProductColor, getProduct, updateProductColor } from "~/apis/product";
import InputForm from "~/components/InputForm";
import Loading from "~/components/Loading";
import { appActions } from "~/store/slice/app";
import { Toast } from "~/utils/alert";
import { toBase64 } from "~/utils/helper";
//http://localhost:5173/admin/manage/products/create-color/:slug
function HandleProductColor() {
  const navigate = useNavigate();
  const { slug, colorId } = useParams();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();
  const [product, setProduct] = useState(null);
  const [color, setColor] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);
  const fetProduct = async () => {
    const response = await getProduct({ slug });
    if (response.success) {
      setProduct(response.data);
      setColor(response.data.colors.find((item) => item._id === colorId));
    }
  };
  const handleSubmitProductColor = async (data) => {
    try {
      const formData = new FormData();
      formData.append("primaryImage", data.thumb[0]);
      formData.append(
        "document",
        JSON.stringify({
          color: data.color,
          quantity: data.quantity,
          images: imagesPreview,
        })
      );
      dispatch(
        appActions.toggleModal({
          isShowModal: true,
          childrenModal: <Loading />,
        })
      );
      let response;
      if (colorId) {
        response = await updateProductColor({
          accessToken: accessToken,
          slug,
          formData,
          params: { colorId },
        });
      } else {
        response = await createProductColor({
          accessToken: accessToken,
          slug,
          formData,
        });
      }
      dispatch(
        appActions.toggleModal({ isShowModal: false, childrenModal: null })
      );
      if (response.success) {
        navigate("/admin/manage/products");
        return Toast.fire({
          icon: "success",
          title: `${colorId ? 'Cập nhật màu sản phẩm thành công':'Tạo màu mới thành công.'}`,
        });
      }
    } catch (error) {
      dispatch(
        appActions.toggleModal({ isShowModal: false, childrenModal: null })
      );
      return Toast.fire({ icon: "error", title: error.message });
    }
  };
  const handleRemoveImage = (index) => {
    const newImages = imagesPreview.filter((_, i) => i !== index);
    setImagesPreview(newImages);
  }
  const handleThumbToPreview = async (file) => {
    const preview = await toBase64(file);
    setThumbPreview(preview);
  };
  const handleImagesPreview = async (files) => {
    for (let file of files) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type))
        return Toast.fire({
          icon: "warning",
          title: "Image is in wrong format.",
        });
      const preview = await toBase64(file);
      setImagesPreview((prev) => [...prev, preview]);
    }
  };
  useEffect(() => {
    if(!colorId) return;
    fetProduct();
  }, []);
  useEffect(() => {
    if(!colorId) return;
    reset({
      color: color?.color || "",
      quantity: color?.quantity || 0,
    });
    setThumbPreview(color?.primaryImage?.url);
    setImagesPreview(color?.images?.map((item) => item.url));
  }, [product]);
  useEffect(() => {
    if (watch("thumb")?.length > 0) {
      handleThumbToPreview(watch("thumb")[0]);
    }
  }, [watch("thumb")]);
  useEffect(() => {
    if (watch("images")?.length > 0) {
      handleImagesPreview(watch("images"));
    }
  }, [watch("images")]);
  return (
    <div className="h-screen overflow-auto">
      <div className="bg-[#f7f7f7] px-2 py-4">
        <h3 className="uppercase text-2xl font-semibold text-black">
          {colorId ? `Cập nhật màu sản phẩm: ${color?.color}` : 'Thêm màu mới cho sản phẩm'}
        </h3>
      </div>
      <div className="my-3 px-4">
        <form onSubmit={handleSubmit(handleSubmitProductColor)}>
          <div className="flex gap-4">
            <InputForm
              cssParents={"mt-3"}
              id="color"
              validate={{ required: "Không dược để trống trường này" }}
              label="Màu sắc"
              register={register}
              error={errors}
            />
            <InputForm
              cssParents={"mt-3"}
              id="quantity"
              validate={{
                required: "Không dược để trống trường này",
                min: { value: 1, message: "Số lượng phải lớn hơn 0" },
              }}
              label="Số lượng"
              register={register}
              error={errors}
            />
          </div>
          {/* thumb */}
          <div className="flex">
            <div className="mt-3 border-r-2 border-gray-300 pr-3">
              <span>Ảnh đại diện</span>
              <div className="">
                <div className="relative w-[100px] h-[100px] outline outline-1 rounded-md overflow-hidden">
                  <label
                    htmlFor="profilePicture"
                    className="absolute inset-0 cursor-pointer rounded-md bg-transparent"
                  >
                    {thumbPreview ? (
                      <img
                        src={thumbPreview}
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
                    {...register("thumb", colorId ?   {}: { required: "Yếu cầu hình ảnh" })}
                    className="sr-only"
                  />
                </div>
                {errors["thumb"] && (
                  <small className="text-red-500">
                    {errors["thumb"].message}
                  </small>
                )}
              </div>
            </div>
            {/* image */}
            <div className="my-3 pl-3">
              <span className="">Chọn ảnh (có thể chọn nhiều ảnh)</span>
              <div className="flex gap-3 flex-wrap">
                <div className="">
                  <div className="relative outline h-[200px] w-[200px] outline-1 rounded-md overflow-hidden">
                    <label
                      htmlFor="images"
                      className="absolute inset-0 cursor-pointer rounded-md bg-transparent"
                    >
                      <div className="w-full h-full flex items-center justify-center text-primary bg-blue-50/50">
                        <HiOutlineCamera className="w-8 h-auto" />
                      </div>
                    </label>
                    <input
                      type="file"
                      multiple="multiple"
                      id="images"
                      {...register("images", colorId ?   {}: { required: "Yếu cầu hình ảnh" })}
                      className="sr-only"
                    />
                  </div>
                  {errors["images"] && (
                    <small className="text-red-500">
                      {errors["images"].message}
                    </small>
                  )}
                </div>
                {imagesPreview?.length > 0 &&
                  imagesPreview.map((image, index) => (
                    <div
                      className=" relative flex w-[200px] h-[200px] outline outline-1 rounded-md overflow-hidden"
                      key={image}
                    >
                      <img
                        src={image}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                      <div
                        title="Xóa"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-1 top-1 rounded-md bg-black bg-opacity-40 text-white p-1 cursor-pointer hover:text-red-500 hover:bg-opacity-15"
                      >
                        <FaRegTrashAlt />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="my-3 flex justify-center">
            <button
              type="submit"
              className="bg-primary text-white py-2 px-10 rounded-md"
            >
              {colorId ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HandleProductColor;
