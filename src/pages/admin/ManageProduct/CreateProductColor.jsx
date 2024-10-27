import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { createProductColor } from "~/apis/product"
import InputForm from "~/components/InputForm"
import { Toast } from "~/utils/alert"
import { toBase64 } from "~/utils/helper"
//http://localhost:5173/admin/manage/products/create-color/:slug
function CreateProductColor() {
  const {slug} = useParams()
  const {accessToken} = useSelector(state => state.user)
  const { register, handleSubmit, formState: { errors },watch } = useForm()
  const [thumbPreview,setThumbPreview] = useState(null)
  const [imagesPreview,setImagesPreview] = useState([])
  const handleCreateProductColor = async (data) => {
    const formData = new FormData()
    formData.append('primaryImage',data.thumb[0])
    for(let image of data.images){
      formData.append('images',image)
    }
    formData.append('document',JSON.stringify({color : data.color,quantity:data.quantity}))
    const response = await createProductColor({accessToken:accessToken,slug,formData})
    if(response.success){
      return Toast.fire({icon:'success',title:'Create product color successfully'})
    }else{
      return Toast.fire({icon:'error',title:response.message})
    }
  }
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
    if(watch('thumb').length>0){  
      handleThumbToPreview(watch('thumb')[0])
    }
  }, [watch('thumb')])
  useEffect(() => {
    if(watch('images').length>0){  
      handleImagesPreview(watch('images'))
    }
  }, [watch('images')])
  return (
    <div>
        <h1 className="text-2xl font-medium">Create product color</h1>
        <form onSubmit={handleSubmit(handleCreateProductColor)}>
            <InputForm 
                cssParents={'mt-3'}
                id="color"
                validate={{required:"This input is required."}}
                label="Color"
                register={register}
                error={errors}
            />
            <InputForm 
                cssParents={'mt-3'}
                id="quantity"
                validate={{
                    required:"This input is required.",
                    min: {value:1,message:"Quantity must be greater than 0"}
                }}
                label="Quantity"
                register={register}
                error={errors}
            />
            <div className="mt-3">
                <div className="">Thumb Image</div>
                <input 
                type="file" 
                {...register('thumb',{required:"This image is required."})}
                />
                <div className="">
                {thumbPreview && <img src={thumbPreview} alt="thumb" className="w-1/3"/>}
                </div>
            </div>
            <div className="my-3">
            <div className="">Images</div>
                <input 
                type="file" 
                multiple="multiple"
                {...register('images',{required:"This image is required."})}
                />
                <div className="flex">
                    {imagesPreview.map((item,index) => 
                        <div key={index}  className="w-1/3">
                          <img src={item} alt="thumb" className="object-contain h-full px-2"/> 
                        </div>
                     )
                    }
                </div>
            </div>
            <button type="submit" className="bg-primary text-white p-2 rounded-md">Create</button>
        </form>
    </div>
  )
}

export default CreateProductColor