import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { getProduct, updateProduct } from "~/apis/product";
import InputForm from "~/components/InputForm";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "~/components/MarkDownEditor";
import {
  capitalizeFirstCharacter,
  covertMoneyToNumber,
  formatNumber,
  getValueLabel,
  toBase64,
  validateForm,
} from "~/utils/helper";
import { Toast } from "~/utils/alert";
import { appActions } from "~/store/slice/app";
import Loading from "~/components/Loading";
import { fetchBrands } from "~/store/action/brand";
import { HiOutlineCamera } from "react-icons/hi";
import { apiGetSeriesBrand } from "~/apis/series";

function EditProduct() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);
  const { brands } = useSelector((state) => state.brand);
  const [product, setProduct] = useState(null);
  const [invalidField, setInvalidField] = useState([]);
  const [listSeries, setListSeries] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();
  const [payload, setPayload] = useState({});
  const [thumbPreview, setThumbPreview] = useState(null);
  const fetProduct = async () => {
    const response = await getProduct({ slug });
    if (response.success) {
      setProduct(response.data);
    }
  };
  const getSerieBrand = async (brandId) => {
    const response = await apiGetSeriesBrand({ brandId });
    return response;
  };
  const handleSubmitProduct = async (data) => {
    const invalid = validateForm({ ...payload }, setInvalidField);
    if (invalid > 0) return;
    const formData = new FormData();
    let { title, price, discountPrice, thumb, ...rest } = data;
    formData.append("primaryImage", thumb.length > 0 ? data.thumb[0] : null);
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
    delete payload.series;
    payload.brand = payload.brand.toLowerCase();
    formData.append(
      "document",
      JSON.stringify({
        title,
        features: [payload.features],
        price: covertMoneyToNumber(price),
        discountPrice: covertMoneyToNumber(discountPrice),
        configs,
        series: payload.seriesId,
        ...payload,
      })
    );
    dispatch(
      appActions.toggleModal({ isShowModal: true, childrenModal: <Loading /> })
    );
    const response = await updateProduct({
      accessToken: accessToken,
      formData,
      slug,
    });
    dispatch(
      appActions.toggleModal({ isShowModal: false, childrenModal: null })
    );
    if (response.success) {
      return Toast.fire({
        icon: "success",
        title: "Update product successfully",
      });
    } else {
      return Toast.fire({ icon: "error", title: response.message });
    }
  };
  useEffect(() => {
    fetProduct();
    dispatch(fetchBrands());
  }, []);
  useEffect(() => {
    let configsArr =
      Object.keys(product?.configs || {})
        ?.map((key) => {
          if (!product?.configs[key].description) {
            return;
          }
          if (key === "ram") {
            return {
              ram: product?.configs[key].description,
              "ram-storage": product.configs[key].value,
            };
          }
          if (key === "hardDrive") {
            return {
              hardDrive: product.configs[key].description,
              "hardDrive-storage": product.configs[key].value,
            };
          }
          return { [key]: product.configs[key].description };
        })
        .filter(Boolean) || [];
    // Chuyển đổi mảng thành đối tượng
    const configsObj = configsArr.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});
    reset({
      title: product?.title || "",
      price: formatNumber(product?.price) || "",
      discountPrice: formatNumber(product?.discountPrice) || "",
      thumb: product?.primaryImage?.url,
      ...configsObj,
    });
    setThumbPreview(product?.primaryImage?.url);
    setPayload({
      description: product?.description[0],
      features: product?.features[0],
      brand: capitalizeFirstCharacter(product?.brand),
      brandId: product?.series?.brand,
      series: product?.series?.title,
      seriesId: product?.series?._id,
      screenTechnology: configsObj?.screenTechnology,
      audioTechnology: configsObj?.audioTechnology,
      connectionPort: configsObj?.connectionPort,
    });
  }, [product]);

  const handleThumbToPreview = async (file) => {
    const preview = await toBase64(file);
    setThumbPreview(preview);
  };
  useEffect(() => {
    dispatch(fetchBrands());
  }, []);
  useEffect(() => {
    if (payload.brandId) {
      getSerieBrand(payload.brandId).then((data) => {
        setListSeries(getValueLabel(data.data));
      });
    }
  }, [payload.brandId]);
  useEffect(() => {
    if (watch("thumb")?.length > 0) {
      handleThumbToPreview(watch("thumb")[0]);
    }
  }, [watch("thumb")]);
  const price = watch("price");
  return (
    <div className="h-screen overflow-auto">
      <h3 className="uppercase text-2xl font-semibold text-black">
        Chỉnh sửa sản phẩm
      </h3>
      <div className="my-3">
        <form onSubmit={handleSubmit(handleSubmitProduct)}>
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
                {...register("thumb")}
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
              label="Dung lượng cứng"
              register={register}
              error={errors}
            />
            <InputForm
              id="refreshRate"
              cssParents={"w-[calc(20%-9.6px)]"}
              label="Tần số quét"
              register={register}
              error={errors}
            />
            <InputForm
              id="pannel"
              cssParents={"w-[calc(20%-9.6px)]"}
              label="Chất liêu tâm nền"
              register={register}
              error={errors}
            />
            <InputForm
              id="screen"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
              label="Kích thước màn hình"
              register={register}
              error={errors}
            />
            <InputForm
              id="resolution"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
              label="Độ phân giải màn hình"
              register={register}
              error={errors}
            />
            <InputForm
              id="cardReader"
              cssParents={"w-[calc(20%-9.6px)]"}
              label="Khe đọc thẻ nhớ"
              register={register}
              error={errors}
            />
            <InputForm
              id="bluetooth"
              cssParents={"w-[calc(20%-9.6px)]"}
              label="Bluetooth"
              register={register}
              error={errors}
            />
            <InputForm
              id="material"
              iconRequire
              cssParents={"w-[calc(20%-9.6px)]"}
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
              label="Trọng lượng"
              register={register}
              error={errors}
            />
            <InputForm
              id="specialFeature"
              cssParents={"w-[calc(20%-9.6px)]"}
              label="Tính năng đặc biệt"
              register={register}
              error={errors}
            />
            <InputForm
              id="keyboardLight"
              cssParents={"w-[calc(20%-9.6px)]"}
              label="Loại đèn bàn phím"
              register={register}
              error={errors}
            />
            <InputForm
              id="security"
              cssParents={"w-[calc(20%-9.6px)]"}
              label="Bảo mật"
              register={register}
              error={errors}
            />
            <InputForm
              id="webcam"
              cssParents={"w-[calc(20%-9.6px)]"}
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
              label="Pin"
              register={register}
              error={errors}
            />
            <InputForm
              id="madeIn"
              cssParents={"w-[calc(20%-9.6px)]"}
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
                value={{ label: payload?.brand, value: payload?.brandId }}
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
              <Select
                className="z-50"
                classNamePrefix="select"
                isClearable
                isSearchable
                value={{ label: payload?.series, value: payload?.seriesId }}
                options={listSeries}
                onChange={(data) =>
                  setPayload({
                    ...payload,
                    seriesId: data.value,
                    series: data.label,
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-3">
            <MarkDownEditor
              label={"Công nghệ màn hình"}
              height={350}
              changeValue={setPayload}
              value={payload.screenTechnology}
              name="screenTechnology"
            />
            <MarkDownEditor
              label={"Công nghệ audio"}
              height={350}
              changeValue={setPayload}
              value={payload.audioTechnology}
              name="audioTechnology"
            />
            <MarkDownEditor
              label={"Cổng kết nối"}
              height={350}
              iconRequire
              changeValue={setPayload}
              value={payload.connectionPort}
              name="connectionPort"
              invalidField={invalidField}
              setInvalidField={setInvalidField}
            />
          </div>
          <div className="">
            <MarkDownEditor
              label={"Mô tả ngắn gọn"}
              iconRequire
              height={300}
              name="features"
              value={payload.features}
              changeValue={setPayload}
              invalidField={invalidField}
              setInvalidField={setInvalidField}
            />
            <MarkDownEditor
              label={"Description"}
              height={400}
              iconRequire
              changeValue={setPayload}
              value={payload.description}
              name="description"
              invalidField={invalidField}
              setInvalidField={setInvalidField}
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-md"
          >
            Update product
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
