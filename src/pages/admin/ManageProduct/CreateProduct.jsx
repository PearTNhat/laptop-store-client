import { useForm } from "react-hook-form"
import InputForm from "~/components/InputForm"
import Select from 'react-select';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProductCategory } from "~/store/action/productCategory";
import MarkDownEditor from "~/components/MarkDownEditor";
import { toBase64, validateForm } from "~/utils/helper";
import { createProduct } from "~/apis/product";
import { Toast } from "~/utils/alert";
function CreateProduct() {
  const dispatch = useDispatch()
  const [invalidField, setInvalidField] = useState([])
  const {categories} = useSelector(state => state.productCategory)
  const {accessToken} = useSelector(state => state.user)
  const [thumbPreview,setThumbPreview] = useState(null)
  const [payload,setPayload] = useState({
    category:'',
    brand:'',
    description:'',
  })
  const { register, handleSubmit, formState: { errors },watch } = useForm()
  const onSubmitNewProduct = async (data) => {
    const invalid =  validateForm({ ...payload }, setInvalidField);
    if (invalid>0) return;
    const formData = new FormData()
    formData.append('primaryImage',data.thumb[0])
    formData.append('document',JSON.stringify({...data,...payload}))
    const response = await createProduct({accessToken:accessToken,formData})
    if(response.success){
      return Toast.fire({icon:'success',title:'Create product successfully'})
    }else{
      return Toast.fire({icon:'error',title:response.message})
    }
  }
  const price = watch('price')
  const handleThumbToPreview =async (file) => {
    const preview =await toBase64(file)
    setThumbPreview(preview)
  }
  useEffect(() => {
    dispatch(fetchProductCategory())
  }, [])
  useEffect(() => {
    if(watch('thumb').length>0){  
      handleThumbToPreview(watch('thumb')[0])
    }
  }, [watch('thumb')])
  return (
    <div className="">
      <h1 className="text-2xl">Create product</h1>
      <div className="my-3">
        <form onSubmit={handleSubmit(onSubmitNewProduct)}>
          <InputForm
            id="title"
            validate={{required:"This input is required."}}
            label="Title"
            register={register}
            error={errors}
          />
          <div className="flex gap-3">
            <InputForm
              cssParents={'flex-1'}
              id="price"
              validate={{required:"This input is required."}}
              label="Price"
              register={register}
              error={errors}
            />
             <InputForm
              id="discountPrice"
              cssParents={'flex-1'}
              validate={
                {required:"This input is required.",
                 validate: (value) => {
                    if(value > price){
                      return "Discount price must be less than price"
                    }
                  }
                }
              }
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
                options={categories.map(item=>({value:item.slug,label:item.title}))}
                onChange={(data)=>setPayload({...payload,category:data.value})}
              />
            </div>
            <div className="flex-1">
              <div className="">Brand</div>
              <Select 
                className="z-50"
                classNamePrefix="select"
                isClearable
                isSearchable
                options={categories?.find(item => item.slug === payload.category )?.brands?.map(item=>({value:item,label:item}))}
                onChange={(data)=>setPayload({...payload,brand:data.value})}
              />
            </div>
          </div>
          <MarkDownEditor 
          label={'Description'} 
          changeValue={setPayload} 
          name ='description' 
          invalidField={invalidField}
          setInvalidField={setInvalidField}
          />
          <div className="my-3">
            <div className="">Thumb Image</div>
            <input 
              type="file" 
              {...register('thumb',{required:"This image is required."})}
            />
            <div className="flex">
                {thumbPreview && <img src={thumbPreview} alt="thumb" className="w-1/3"/>}
            </div>
          </div>
        <button type="submit" className="bg-primary text-white p-2 rounded-md">Create</button>
        </form>
      </div>
    </div>
  )
}

export default CreateProduct