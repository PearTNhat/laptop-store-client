import { useForm } from "react-hook-form";
import InputForm from "~/components/InputForm";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MarkDownEditor from "~/components/MarkDownEditor";
import {
  capitalizeFirstCharacter,
  toBase64,
  validateForm,
} from "~/utils/helper";
import { createProduct } from "~/apis/product";
import { Toast } from "~/utils/alert";
import { fetchBrands } from "~/store/action/brand";
import { appActions } from "~/store/slice/app";
import Loading from "~/components/Loading";
function CreateProduct() {
  const dispatch = useDispatch();
  const [invalidField, setInvalidField] = useState([]);
  const { brands } = useSelector((state) => state.brand);
  const { accessToken } = useSelector((state) => state.user);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [payload, setPayload] = useState({
    connectionPort: "",
    brand: "",
    series: "",
    description: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const onSubmitNewProduct = async (data) => {
    const invalid = validateForm({ ...payload }, setInvalidField);
    if (invalid > 0) return;
    const formData = new FormData();
    let {title,price,discountPrice,thumb,...rest} = data;
    formData.append("primaryImage", thumb[0]);
    const configs={}
    for(let key in rest){
      configs[key]={}
      configs[key].value = rest[key]
    }
    configs.connectionPort={}
    configs.connectionPort.value = payload.connectionPort
    formData.append("document", JSON.stringify({ title,price,discountPrice,configs, ...payload }));
    dispatch(appActions.toggleModal({isShowModal:true,childrenModal:<Loading/>}));
    const response = await createProduct({
      accessToken: accessToken,
      formData,
    });
    dispatch(appActions.toggleModal({isShowModal:false,childrenModal:null}));
    if (response.success) {
      return Toast.fire({
        icon: "success",
        title: "Create product successfully",
      });
    } else {
      return Toast.fire({ icon: "error", title: response.message });
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
  return (
    <div className="h-screen overflow-auto">
      <div className="bg-[#f7f7f7] ">
        <h3 className="uppercase text-2xl font-semibold text-black">
          Tạo sản phẩm mới
        </h3>
      </div>
      <div className="my-3 px-4">
        <form onSubmit={handleSubmit(onSubmitNewProduct)}>
          <div className="flex gap-3">
            <InputForm
              cssParents={"flex-1"}
              id="title"
              validate={{ required: "This input is required." }}
              label="Title"
              register={register}
              error={errors}
            />
            <InputForm
              cssParents={"flex-1"}
              id="price"
              validate={{ required: "This input is required." }}
              label="Price"
              register={register}
              error={errors}
            />
            <InputForm
              id="discountPrice"
              cssParents={"flex-1"}
              validate={{
                required: "This input is required.",
                validate: (value) => {
                  if (value > price) {
                    return "Discount price must be less than price";
                  }
                },
              }}
              label="Discount Price"
              register={register}
              error={errors}
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <InputForm
              id="cpu"
              cssParents={"w-[calc(33.3333%-8px)]"}
              validate={{
                required: "This input is required.",
              }}
              label="CPU"
              register={register}
              error={errors}
            />
            <InputForm
              id="graphicCard"
              cssParents={"w-[calc(33.3333%-8px)]"}
              validate={{
                required: "This input is required.",
              }}
              label="Card đồ họa"
              register={register}
              error={errors}
            />
            <InputForm
              id="screen"
              cssParents={"w-[calc(33.3333%-8px)]"}
              validate={{
                required: "This input is required.",
              }}
              label="Màn hình"
              register={register}
              error={errors}
            />
            <InputForm
              id="ram"
              cssParents={"w-[calc(33.3333%-8px)]"}
              validate={{
                required: "This input is required.",
              }}
              label="Ram"
              register={register}
              error={errors}
            />
            <InputForm
              id="hardDrive"
              cssParents={"w-[calc(33.3333%-8px)]"}
              validate={{
                required: "This input is required.",
              }}
              label="Ổ cứng"
              register={register}
              error={errors}
            />
            <InputForm
              id="operatingSystem"
              cssParents={"w-[calc(33.3333%-8px)]"}
              validate={{
                required: "This input is required.",
              }}
              label="Hệ điều hành"
              register={register}
              error={errors}
            />
            <InputForm
              id="battery"
              cssParents={"w-[calc(33.3333%-8px)]"}
              validate={{
                required: "This input is required.",
              }}
              label="Pin"
              register={register}
              error={errors}
            />
            <InputForm
              id="weight"
              cssParents={"w-[calc(33.3333%-8px)]"}
              validate={{
                required: "This input is required.",
              }}
              label="Trọng lượng"
              register={register}
              error={errors}
            />
            <InputForm
              id="need"
              cssParents={"w-[calc(33.3333%-8px)]"}
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
                options={brands?.map((item) => ({
                  value: item.slug,
                  label: item.title,
                }))}
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
                options={brands
                  ?.find((item) => item.slug === payload.brand)
                  ?.series?.map((item) => ({
                    value: item,
                    label: capitalizeFirstCharacter(item),
                  }))}
                onChange={(data) =>
                  setPayload({ ...payload, series: data.value })
                }
              />
            </div>
          </div>
          <MarkDownEditor
            label={"Cổng kết nối"}
            height={200}
            changeValue={setPayload}
            name="connectionPort"
            invalidField={invalidField}
            setInvalidField={setInvalidField}
          />
          <MarkDownEditor
            label={"Description"}
            height={400}
            changeValue={setPayload}
            name="description"
            invalidField={invalidField}
            setInvalidField={setInvalidField}
          />
          <div className="my-3">
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
          </div>
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
