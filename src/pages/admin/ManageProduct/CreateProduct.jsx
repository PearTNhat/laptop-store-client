import { useForm } from "react-hook-form";
import InputForm from "~/components/InputForm";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MarkDownEditor from "~/components/MarkDownEditor";
import { getValueLabel, toBase64, validateForm } from "~/utils/helper";
import { createProduct } from "~/apis/product";
import { Toast } from "~/utils/alert";
import { fetchBrands } from "~/store/action/brand";
import { appActions } from "~/store/slice/app";
import Loading from "~/components/Loading";
import { apiGetSeriesBrand } from "~/apis/series";
import { HiOutlineCamera } from "react-icons/hi";
function CreateProduct() {
  const dispatch = useDispatch();
  const [invalidField, setInvalidField] = useState([]);
  const { brands } = useSelector((state) => state.brand);
  const { accessToken } = useSelector((state) => state.user);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [listSeires, setListSeries] = useState([]);
  const [payload, setPayload] = useState({
    connectionPort: "",
    brand: "",
    series: "",
    description: "",
  });
  console.log(payload);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const getSerieBrand = async (brandId) => {
    const response = await apiGetSeriesBrand({ brandId });
    return response;
  };
  const onSubmitNewProduct = async (data) => {
    try {
      const invalid = validateForm({ ...payload }, setInvalidField);
      if (invalid > 0) return;
      const formData = new FormData();
      let { title, price, discountPrice, thumb, ...rest } = data;
      formData.append("primaryImage", thumb[0]);
      const configs = {};
      for (let key in rest) {
        if (key === "ram-storage") {
          configs["ram.value"] = rest[key];
        } else if (key === "ram") {
          configs["ram.description"] = rest[key];
        } else if (key === "hardDrive-storage") {
          configs["hardDrive.value"] = rest[key];
        } else if (key === "hardDrive") {
          configs["hardDrive.description"] = rest[key];
        } else {
          configs[key] = {};
          configs[key].description = rest[key];
        }
      }
      configs.connectionPort = {};
      configs.connectionPort.description = payload.connectionPort;
      configs.screenTechnology = {};
      configs.screenTechnology.description = payload.screenTechnology;
      configs.audioTechnology = {};
      configs.audioTechnology.description = payload.audioTechnology;
      delete payload.brand;
      formData.append(
        "document",
        JSON.stringify({ title, price, discountPrice, configs, ...payload })
      );
      dispatch(
        appActions.toggleModal({
          isShowModal: true,
          childrenModal: <Loading />,
        })
      );
      const response = await createProduct({
        accessToken: accessToken,
        formData,
      });
      dispatch(
        appActions.toggleModal({ isShowModal: false, childrenModal: null })
      );
      if (response.success) {
        return Toast.fire({
          icon: "success",
          title: "Create product successfully",
        });
      } else {
        return Toast.fire({ icon: "error", title: response.message });
      }
    } catch (error) {
      dispatch(
        appActions.toggleModal({ isShowModal: false, childrenModal: null })
      );
    }
  };
  const price = watch("price");
  const handleThumbToPreview = async (file) => {
    const preview = await toBase64(file);
    setThumbPreview(preview);
  };
  useEffect(() => {
    dispatch(fetchBrands());
  }, []);
  useEffect(() => {
    if (watch("thumb").length > 0) {
      handleThumbToPreview(watch("thumb")[0]);
    }
    console.log("zpo");
  }, [watch("thumb")]);
  useEffect(() => {
    if (payload.brand) {
      getSerieBrand(payload.brand).then((data) => {
        setListSeries(getValueLabel(data.data));
      });
    }
  }, [payload.brand]);
  return (
    <div className="h-screen overflow-auto">
      <div className="bg-[#f7f7f7] ">
        <h3 className="uppercase text-2xl font-semibold text-black">
          Tạo sản phẩm mới
        </h3>
      </div>
      <div className="my-3 px-4">
        <form onSubmit={handleSubmit(onSubmitNewProduct)}>
          <div className="flex gap-4">
            {/* img */}
            <div className="relative w-[200px] h-[200px] outline outline-1 rounded-md overflow-hidden">
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
                {...register("thumb", { required: "This image is required." })}
                className="sr-only"
              />
            </div>
            <div className="flex gap-3 flex-1 flex-wrap">
              <InputForm
                cssParents={"w-[calc(25%-9px)]"}
                iconRequire
                id="title"
                validate={{ required: "This input is required." }}
                label="Tên"
                register={register}
                error={errors}
              />
              <InputForm
                cssParents={"w-[calc(25%-9px)]"}
                id="price"
                validate={{
                  required: "This input is required.",
                  min: {
                    value: 0,
                    message: "Quantity must be at least 0.",
                  },
                  validate: (value) =>
                    !isNaN(value) || "Quantity must be a number.",
                }}
                label="Giá ban đầu"
                register={register}
                error={errors}
              />
              <InputForm
                id="discountPrice"
                iconRequire
                cssParents={"w-[calc(25%-9px)]"}
                validate={{
                  required: "This input is required.",
                  validate: (value) => {
                    if (price === "" || price == 0) return true;
                    if (isNaN(value)) return "Yêu cầu số.";
                    if (Number(value) > Number(price)) {
                      return "Giá cuối cùng phải <= giá ban đầu.";
                    }
                  },
                }}
                label="Giá cuối cùng"
                register={register}
                error={errors}
              />
              <InputForm
                id="aiChip"
                cssParents={"w-[calc(25%-9px)]"}
                label="Chip AI"
                placeholder="Vd: Qualcomm Hexagon NPU, up to 45 TOPS"
                register={register}
                error={errors}
              />
              <InputForm
                id="cpu"
                iconRequire
                cssParents={"w-[calc(25%-9px)]"}
                validate={{
                  required: "This input is required.",
                }}
                placeholder="Vd: Intel Core i5-11300H"
                label="CPU"
                register={register}
                error={errors}
              />
              <InputForm
                id="graphicCard"
                iconRequire
                cssParents={"w-[calc(25%-9px)]"}
                validate={{
                  required: "This input is required.",
                }}
                placeholder="Vd: NVIDIA GeForce RTX 3050 Ti 4GB GDDR6"
                label="Card đồ họa"
                register={register}
                error={errors}
              />
              <InputForm
                id="ram"
                iconRequire
                cssParents={"w-[calc(25%-9px)]"}
                validate={{
                  required: "This input is required.",
                }}
                placeholder="Vd: 8GB DDR4 3200MHz"
                label="Mô tả ram"
                register={register}
                error={errors}
              />
              <InputForm
                id="ram-storage"
                iconRequire
                cssParents={"w-[calc(20%-9.6px)]"}
                validate={{
                  required: "This input is required.",
                }}
                placeholder="Vd: 8GB"
                label="Dung lượng Ram"
                register={register}
                error={errors}
              />
            </div>
          </div>
          <div className="flex gap-3 flex-wrap mt-4">
            <InputForm
              id="hardDrive"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
              validate={{
                required: "This input is required.",
              }}
              placeholder={"Vd: 256GB SSD"}
              label="Mô tả ổ cứng"
              register={register}
              error={errors}
            />
            <InputForm
              id="hardDrive-storage"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
              validate={{
                required: "This input is required.",
              }}
              placeholder="Vd: 256GB"
              label="Dung lượng cứng"
              register={register}
              error={errors}
            />
            <InputForm
              id="refreshRate"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: 60Hz"
              label="Tần số quét"
              register={register}
              error={errors}
            />
            <InputForm
              id="pannel"
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: Tấm nền IPS"
              label="Chất liêu tâm nền"
              register={register}
              error={errors}
            />
            <InputForm
              id="screen"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: 15.6 inch"
              label="Kích thước màn hình"
              register={register}
              error={errors}
            />
            <InputForm
              id="resolution"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: 1920x1080"
              label="Độ phân giải màn hình"
              register={register}
              error={errors}
            />
            <InputForm
              id="cardReader"
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: Có"
              label="Khe đọc thẻ nhớ"
              register={register}
              error={errors}
            />
            <InputForm
              id="bluetooth"
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: Bluetooth 5.2"
              label="Bluetooth"
              register={register}
              error={errors}
            />
            <InputForm
              id="material"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: Vỏ nhựa"
              validate={{
                required: "This input is required.",
              }}
              label="Chất liệu"
              register={register}
              error={errors}
            />
            <InputForm
              id="size"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: 359.86 x 258.7 x 21.9-23.9 mm (W x D x H)"
              validate={{
                required: "This input is required.",
              }}
              label="Kích thước"
              register={register}
              error={errors}
            />
            <InputForm
              id="weight"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
              validate={{
                required: "This input is required.",
              }}
              placeholder="Vd: 1.5kg"
              label="Trọng lượng"
              register={register}
              error={errors}
            />
            <InputForm
              id="specialFeature"
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: Wifi 6"
              label="Tính năng đặc biệt"
              register={register}
              error={errors}
            />
            <InputForm
              id="keyboardLight"
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: Đèn nền trắng"
              label="Loại đèn bàn phím"
              register={register}
              error={errors}
            />
            <InputForm
              id="security"
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: Vân tay"
              label="Bảo mật"
              register={register}
              error={errors}
            />
            <InputForm
              id="webcam"
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: FHD 1080p với màn trập E-shutter"
              label="WebCam"
              register={register}
              error={errors}
            />
            <InputForm
              id="operatingSystem"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
              validate={{
                required: "This input is required.",
              }}
              placeholder="Vd: Windows 10"
              label="Hệ điều hành"
              register={register}
              error={errors}
            />
            <InputForm
              id="battery"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
              validate={{
                required: "This input is required.",
              }}
              placeholder="Vd: 3 cell"
              label="Pin"
              register={register}
              error={errors}
            />
            <InputForm
              id="madeIn"
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: Việt Nam"
              label="Xuất xứ"
              register={register}
              error={errors}
            />
            <InputForm
              id="need"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
              validate={{
                required: "This input is required.",
              }}
              placeholder="Vd: Gaming"
              label="Nhu cầu"
              register={register}
              error={errors}
            />
          </div>
          <div className="flex gap-3 my-3">
            <div className="flex-1">
              <div className="">Thương hiệu</div>
              <Select
                className="z-50"
                classNamePrefix="select"
                isClearable
                isSearchable
                options={brands}
                onChange={(data) =>
                  setPayload({ ...payload, brand: data.value })
                }
              />
            </div>
            <div className="flex-1">
              <div className="">Thuộc dòng</div>
              <Select
                className="z-50"
                classNamePrefix="select"
                isClearable
                isSearchable
                options={listSeires}
                onChange={(data) =>
                  setPayload({ ...payload, series: data.value })
                }
              />
            </div>
          </div>
          <div className="flex gap-3">
            <MarkDownEditor
              label={"Công nghệ màn hình"}
              height={350}
              changeValue={setPayload}
              name="screenTechnology"
            />
            <MarkDownEditor
              label={"Công nghệ audio"}
              height={350}
              changeValue={setPayload}
              name="audioTechnology"
            />
            <MarkDownEditor
              label={"Cổng kết nối"}
              height={350}
              iconRequire
              changeValue={setPayload}
              name="connectionPort"
              invalidField={invalidField}
              setInvalidField={setInvalidField}
            />
          </div>
          <MarkDownEditor
            label={"Description"}
            height={400}
            changeValue={setPayload}
            name="description"
            invalidField={invalidField}
            setInvalidField={setInvalidField}
          />
          {/* <div className="my-3">
            <div className="">Thumb Image</div>
            <input
              type="file"
              {...register("thumb", { required: "This image is required." })}
            />
             {errors['thumb'] && <small className="text-red-500">{errors['thumb'].message}</small>}
            <div className="flex">
              {thumbPreview && (
                <img src={thumbPreview} alt="thumb" className="w-1/3" />
              )}
            </div>
          </div> */}
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-md"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
