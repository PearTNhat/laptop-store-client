/* eslint-disable react/prop-types */
import { IoClose } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { Logo } from '~/assets/images'
import Button from '~/components/Button'
import { appActions } from '~/store/slice/app'

function DescriptionModal({desc, setDesc}) {
  const dispatch = useDispatch()
  return (
    <div className="w-[600px] bg-white rounded-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
    <div className="relative py-3 bg-gray-100 text-bl">
      <p className="font-bold text-xl pl-2">Tìm kiếm laptop theo mô tả</p>
      <IoClose className="absolute top-1/2 -translate-y-1/2 right-0 pr-2 text-4xl cursor-pointer" onClick={()=>dispatch(appActions.toggleModal({isShowModal:false,childrenModal:null}))}/>
    </div>
    <div className="px-2">
      <img src={Logo} alt="digital world" className="pt-4 mx-auto" />
      <p className="text-xl font-medium py-2">Mô tả</p>
      <textarea 
      placeholder="Điền mô tả về nhu cầu của bạn" 
      value={desc} 
      onChange={(e)=>setDesc(e.target.value)}
      className="w-full border border-gray-300 rounded-sm p-1 focus:outline-none mt-1" rows="4"></textarea>
      <Button wf className={'my-4'}>Tìm kiếm</Button>
    </div>

  </div>
  )
}

export default DescriptionModal