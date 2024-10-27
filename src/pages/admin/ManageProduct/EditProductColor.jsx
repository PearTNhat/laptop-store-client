import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct, updateProductColor } from "~/apis/product";
import InputForm from "~/components/InputForm";
import Loading from "~/components/Loading";
import { appActions } from "~/store/slice/app";
import { Toast } from "~/utils/alert";
import { toBase64 } from "~/utils/helper";

function EditProductColor() {
  const { slug,colorId } = useParams();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset ,watch } = useForm();
  const { accessToken } = useSelector((state) => state.user);
  const [product, setProduct] = useState(null);
  const [color, setColor] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);
  const fetProduct = async () => {
    const response = await getProduct({ slug });
    if (response.success) {
      setProduct(response.data);
      setColor(response.data.colors.find(item => item._id === colorId))
    }
  };
  const handleUpdateProductColor = async(data) => {
    const formData = new FormData()
    formData.append('primaryImage',data.thumb?.length>0 ? data.thumb[0] : null)
    if(data.images?.length > 0) {
      for(let image of data.images){
        formData.append('images',image)
      }
    }else{
      formData.append('images',null)
    }
    formData.append('document',JSON.stringify({color : data.color,quantity:data.quantity}))
    dispatch(appActions.toggleModal({isShowModal:true,childrenModal:<Loading/>}))
    const response = await updateProductColor({accessToken:accessToken,slug,formData,params:{colorId}})
    dispatch(appActions.toggleModal({isShowModal:false,childrenModal:null}))
    if(response.success){
      return Toast.fire({icon:'success',title:'Update product color successfully'})
    }else{
      return Toast.fire({icon:'error',title:response.message})
    }

  }
  useEffect(() => {
    fetProduct();
  }, []);
  useEffect(() => { 
    reset({
        color: color?.color || "",
        quantity: color?.quantity || 0,
    })
    setThumbPreview(color?.primaryImage?.url)
    setImagesPreview(color?.images?.map(item => item.url))
  }, [product]);
  const handleThumbToPreview =async (file) => {
    const preview =await toBase64(file)
    setThumbPreview(preview)
  }
  const handleImagesPreview =async (files) => {
    const listPreviews = []
    for(let file of files){
        if(!['image/jpeg','image/png','image/jpg'].includes(file.type)) return Toast.fire({icon:'warning',title:'Image is in wrong format.'})
        const preview =await toBase64(file)
        listPreviews.push(preview)
    }
    setImagesPreview(listPreviews)
  }
  useEffect(() => {
    if(watch('thumb')?.length>0){  
      handleThumbToPreview(watch('thumb')[0])
    }
  }, [watch('thumb')])
  useEffect(() => {
    if(watch('images')?.length>0){  
      handleImagesPreview(watch('images'))
    }
  }, [watch('images')])
  return (
    <div className="h-screen overflow-auto">
      <h1 className="text-2xl font-medium">Update product color: {color?.color}</h1>
      <form onSubmit={handleSubmit(handleUpdateProductColor)}>
        <InputForm
          cssParents={"mt-3"}
          id="color"
          validate={{ required: "This input is required." }}
          label="Color"
          register={register}
          error={errors}
        />
        <InputForm
          cssParents={"mt-3"}
          id="quantity"
          validate={{
            required: "This input is required.",
            min: { value: 1, message: "Quantity must be greater than 0" },
          }}
          label="Quantity"
          register={register}
          error={errors}
        />
        <div className="mt-3">
          <div className="">Thumb Image</div>
          <input
            type="file"
            {...register("thumb")}
          />
          <div className="">
            {thumbPreview && (
              <img src={thumbPreview} alt="thumb" className="w-1/3 object-contain" />
            )}
          </div>
        </div>
        <div className="my-3">
          <div className="">Images</div>
          <input
            type="file"
            multiple="multiple"
            {...register("images")}
          />
          <div className="flex">
            {imagesPreview?.map((item, index) => (
              <div key={index} className="w-1/3">
                <img
                  src={item}
                  alt="thumb"
                  className="object-contain h-full px-2"
                />
              </div>
            ))}
          </div>
        </div>
        <button type="submit" onClick={()=> console.log('clcik')} className="bg-primary text-white p-2 rounded-md">
          Update
        </button>
      </form>
    </div>
  );
}

export default EditProductColor;
