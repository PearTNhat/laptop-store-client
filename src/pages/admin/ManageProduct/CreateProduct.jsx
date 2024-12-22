import { useForm } from "react-hook-form";
import InputForm from "~/components/InputForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MarkDownEditor from "~/components/MarkDownEditor";
import {
  covertMoneyToNumber,
  formatNumber,
  getValueLabel,
  toBase64,
  validateForm,
} from "~/utils/helper";
import { createProduct } from "~/apis/product";
import { Toast } from "~/utils/alert";
import { fetchBrands } from "~/store/action/brand";
import { appActions } from "~/store/slice/app";
import Loading from "~/components/Loading";
import { apiGetSeriesBrand } from "~/apis/series";
import { HiOutlineCamera } from "react-icons/hi";
import SelectItem from "~/components/SelectItem";
import { useNavigate } from "react-router-dom";
function CreateProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [invalidField, setInvalidField] = useState([]);
  const { brands } = useSelector((state) => state.brand);
  const { accessToken } = useSelector((state) => state.user);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [listSeires, setListSeries] = useState([]);
  const [payload, setPayload] = useState({
    connectionPort: "1 x USB 3.2 Gen 2 Type-C (10 Gbps, DisplayPort 1.4, Power Delivery 3.0), 1 x USB 3.2 Gen 1 Type-A, 2 x USB 2.0 Type-A, 1 x HDMI 2.1, 1 x Ethernet (RJ-45), 1 x headphone / microphone combo jack (3.5mm)",
    brand: "",
    series: "",
    features:'Laptop Gaming Dell G15 5510 i5 11400H/8GB/512GB/RTX 3050 Ti/15.6 inch FHD/Win 10',
    description: "Laptop Gaming Dell G15 5510 i5 11400H/8GB/512GB/RTX 3050 Ti/15.6 inch FHD/Win 10",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const getSerieBrand = async (brandId) => {
    const response = await apiGetSeriesBrand({ brandId });
    return response;
  };
  const onSubmitNewProduct = async (data) => {
    try {
      const invalid = validateForm({ ...payload }, setInvalidField);
      if (invalid > 0) {
        Toast.fire({icon:'error',title:'Vui lòng điền đầy đủ thông tin'})
        return
      }
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
      // delete payload.brand;
      delete payload.series;
      payload.brand = payload.brand.toLowerCase();
      payload.series =payload.seriesId;
      formData.append(
        "document",
        JSON.stringify({
          title,
          features: [payload.features],
          price: covertMoneyToNumber(price),
          discountPrice: covertMoneyToNumber(discountPrice),
          configs,
          ...payload,
        })
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
        navigate("/admin/manage/products");
        return Toast.fire({
          icon: "success",
          title: "Tạo san phẩm mới thành công.",
        });
      } else {
        return Toast.fire({ icon: "error", title: response.message });
      }
    } catch (error) {
      dispatch(
        appActions.toggleModal({ isShowModal: false, childrenModal: null })
      );
      return Toast.fire({ icon: "error", title: error.message });
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
  }, [watch("thumb")]);
  useEffect(() => {
    if (payload.brandId) {
      getSerieBrand(payload.brandId).then((data) => {
        setListSeries(getValueLabel(data.data));
      });
    }
  }, [payload.brandId]);
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
            <div className="">
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
                  {...register("thumb", {
                    required: "This image is required.",
                  })}
                  className="sr-only"
                />
              </div>
              {errors["thumb"] && (
                <small className="text-red-500">
                  {errors["thumb"].message}
                </small>
              )}
            </div>
            <div className="flex gap-3 flex-1 flex-wrap">
              <InputForm
                cssParents={"w-[calc(25%-9px)]"}
                iconRequire
                id="title"
                validate={{ required: "This input is required." }}
                label="Tên"
                defaultValue='123'
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
                }}
                value={watch("price") || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!isNaN(covertMoneyToNumber(value))) {
                    setValue(
                      "price",
                      formatNumber(Number(covertMoneyToNumber(value)))
                    );
                  }
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
                    if (Number(value) > Number(price)) {
                      return "Giá cuối cùng phải <= giá ban đầu.";
                    }
                  },
                }}
                value={watch("discountPrice") || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!isNaN(covertMoneyToNumber(value))) {
                    setValue(
                      "discountPrice",
                      formatNumber(Number(covertMoneyToNumber(value)))
                    );
                  }
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
                defaultValue='Intel Core i5-11300H'
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
                defaultValue='NVIDIA GeForce RTX 3050 Ti 4GB GDDR6'
                placeholder="Vd: NVIDIA GeForce RTX 3050 Ti 4GB GDDR6"
                label="Card đồ họa"
                register={register}
                error={errors}
              />
              <InputForm
                id="ram"
                iconRequire
                defaultValue='8GB DDR4 3200MHz'
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
                defaultValue='8GB'
                cssParents={"w-[calc(25%-9.6px)]"}
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
              defaultValue='256GB SSD'
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
              defaultValue='256GB'
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
              defaultValue='15.6 inch'
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: 15.6 inch"
              label="Kích thước màn hình"
              validate={{
                required: "This input is required.",
              }}
              register={register}
              error={errors}
            />
            <InputForm
              id="resolution"
              iconRequire
              defaultValue='1920x1080'
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
              cssParents={"w-[calc(20%-9.6px)]"}
              placeholder="Vd: Vỏ nhựa"
              label="Chất liệu"
              register={register}
              error={errors}
            />
            <InputForm
              id="size"
              iconRequire
              defaultValue='359.86 x 258.7 x 21.9-23.9 mm (W x D x H)'
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
              defaultValue='1.5kg'
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
              defaultValue='Windows 10'
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
              defaultValue='53.5Wh'
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
              defaultValue='Gaming'
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
              <SelectItem
                className="z-50"
                name="brand"
                isSearchable
                options={brands}
                onChange={(data) =>
                  setPayload({
                    ...payload,
                    brandId: data.value,
                    brand: data.label,
                    seriesId: "",
                    series: "",
                  })
                }
              />
            </div>
            <div className="flex-1">
              <div className="">Thuộc dòng</div>
              <SelectItem
                className="z-50"
                name="series"
                isClearable
                isSearchable
                value={{ label: payload?.series, value: payload?.seriesId }}
                options={listSeires}
                onChange={(data) =>
                  setPayload({
                    ...payload,
                    series: data.label,
                    seriesId: data.value,
                  })
                }
                invalidField={invalidField}
                setInvalidField={setInvalidField}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <MarkDownEditor
              label={"Công nghệ màn hình"}
              height={300}
              changeValue={setPayload}
              name="screenTechnology"
            />
            <MarkDownEditor
              label={"Công nghệ audio"}
              height={300}
              changeValue={setPayload}
              name="audioTechnology"
            />
            <MarkDownEditor
              label={"Cổng kết nối"}
              height={300}
              iconRequire
              value={payload.connectionPort}
              changeValue={setPayload}
              name="connectionPort"
              invalidField={invalidField}
              setInvalidField={setInvalidField}
            />
          </div>
          <div className="">
            <MarkDownEditor
              label={"Mô tả ngắn gọn"}
              iconRequire
              value={payload.features}
              height={300}
              name="features"
              changeValue={setPayload}
              invalidField={invalidField}
              setInvalidField={setInvalidField}
            />
            <MarkDownEditor
              label={"Description"}
              height={400}
              iconRequire
              value={payload.description}
              changeValue={setPayload}
              name="description"
              invalidField={invalidField}
              setInvalidField={setInvalidField}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-primary text-white p-2 rounded-md mt-3"
            >
              Tạo mới sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
