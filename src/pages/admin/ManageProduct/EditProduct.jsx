import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { useParams } from "react-router-dom";
import { getProduct, updateProduct } from "~/apis/product";
import InputForm from "~/components/InputForm";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "~/components/MarkDownEditor";
import { toBase64, validateForm } from "~/utils/helper";
import { Toast } from "~/utils/alert";
import { appActions } from "~/store/slice/app";
import Loading from "~/components/Loading";
import { fetchBrands } from "~/store/action/brand";

function EditProduct() {
  const { slug } = useParams();
  const dispatch = useDispatch()
  const {accessToken} = useSelector(state => state.user)
  const {brands} = useSelector(state => state.brand)
  const [product, setProduct] = useState(null);
  const [invalidField, setInvalidField] = useState([])
  const { register, handleSubmit, formState: { errors }, reset ,watch } = useForm();
  const [payload, setPayload] = useState({});
  const [thumbPreview,setThumbPreview] = useState(null)
  const fetProduct = async () => {
    const response = await getProduct({ slug });
    if (response.success) {
      setProduct(response.data);
    }
  };
  const handleSubmitProduct = async (data)=>{
    const invalid =  validateForm({ ...payload }, setInvalidField);
    if (invalid>0) return;
    const formData = new FormData()
    formData.append('primaryImage',data.thumb?.length > 0 ? data.thumb[0] : null)
    formData.append('document',JSON.stringify({...data,...payload}))
    dispatch(appActions.toggleModal({isShowModal:true,childrenModal:<Loading/>}))
    const response = await updateProduct({accessToken:accessToken,formData,slug})
    dispatch(appActions.toggleModal({isShowModal:false,childrenModal:null}))
    if(response.success){
      return Toast.fire({icon:'success',title:'Update product successfully'})
    }else{
      return Toast.fire({icon:'error',title:response.message})
    }
  }
  useEffect(() => {
    fetProduct();
    dispatch(fetchBrands())
  }, []);
  useEffect(() => { 
    reset({
        title: product?.title || "",
        price: product?.price || "",
        discountPrice: product?.discountPrice || "",
    })
    setThumbPreview(product?.primaryImage?.url)
    setPayload({
        category: product?.category?.slug,
        description: ((product?.description?.length > 1 && typeof product?.description === 'object') ? product?.description.join(', ') : product?.description[0]),
        brand: product?.brand,
    })
  }, [product]);
  const handleThumbToPreview =async (file) => {
    const preview =await toBase64(file)
    setThumbPreview(preview)
  }
  useEffect(() => {
    if(watch('thumb')?.length>0){  
      handleThumbToPreview(watch('thumb')[0])
    }
  }, [watch('thumb')])
  const price = watch('price')
  return (
    <div className="h-screen overflow-auto">
      <h3 className="uppercase text-2xl font-semibold text-black">
          Chỉnh sửa sản phẩm
        </h3>
      <div className="my-3">
        <form onSubmit={handleSubmit(handleSubmitProduct)}>
          <InputForm
            id="title"
            validate={{ required: "This input is required." }}
            label="Title"
            register={register}
            error={errors}
          />
          <div className="flex gap-3">
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
          <div className="flex gap-3 my-3">
            <div className="flex-1">
              <div className="">Category</div>
              <Select
                className="z-50"
                classNamePrefix="select"
                isClearable
                isSearchable
                options={brands.map((item) => ({
                  value: item.slug,
                  label: item.title,
                }))}
                onChange={(data) =>
                  setPayload({ ...payload, brand: data.value })
                }
                value={
                    {
                    value: payload.category,
                    label:brands.find((item) => item.slug === payload.brand)?.title || ""
                  }
                }
              />
            </div>
            <div className="flex-1">
              <div className="">Brand</div>
              <Select
                className="z-50"
                classNamePrefix="select"
                isClearable
                isSearchable
                options={brands
                  ?.find((item) => item.slug === payload.category)
                  ?.brands?.map((item) => ({ value: item, label: item }))}
                onChange={(data) =>
                  setPayload({ ...payload, brand: data.value })
                }
                value={
                  {
                  value: payload.brand,
                  label: payload.brand
                }
              }
              />
            </div>
          </div>
          <MarkDownEditor
            label={"Description"}
            changeValue={setPayload}
            name="description"
            invalidField={invalidField}
            setInvalidField={setInvalidField}
            value={
               payload?.description
            }
          />
          
          <div className="my-3">
            <div className="">Thumb Image</div>
            <input
              type="file"
              {...register("thumb")}
            />
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
            Update product
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
