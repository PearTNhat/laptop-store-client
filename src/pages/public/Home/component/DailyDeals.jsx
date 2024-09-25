import moment from "moment"
import { useEffect, useState } from "react"
import { FaStar } from "react-icons/fa"
import { Link } from "react-router-dom"
import { getDailyDeals } from "~/apis/dailyDeals"
import { DefaultProduct } from "~/assets/images"
import CountDown from "~/components/CountDown"
import PriceStartProduct from "~/components/PriceStartProduct"
import path from "~/constants/path"
import {  getTimeHMS } from "~/utils/helper"
let countTime 
function DailyDeals() {
  const [dailyDeals, setDailyDeals] = useState({})
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const fetchDailyDeals = async () => {
    const res = await getDailyDeals();
    setDailyDeals(res.data)
  }
  useEffect(() => {
    fetchDailyDeals()
  }, [])
  useEffect(() => {
    countTime = setInterval(() => {
      const today = `${moment().format('DD-MM-YYYY')}`; // cai này là giờ cố định
      //Number( new Date(today).getTime() ) - Number(Date.now() sẻ tính đc giờ hiện tại
      const distance =  24 * 3600 *1000 + Number( new Date(today).getTime() ) - Number(Date.now());
      console.log('distance', distance);
      if(distance < 0) {
        fetchDailyDeals()
      }else{
        const { hours, minutes, seconds } = getTimeHMS(distance)
        setTime({ hours, minutes, seconds })
      }
    }, 1000)
    return () => {
      clearInterval(countTime)
    }
  }, [])
  return (
    <div className='w-[25%] border shadow-md p-4'>
      <div className="flex justify-between items-center px-2 pb-3">
        <FaStar className="text-main flex-1" />
        <p className="flex-8 text-center text-xl text-second uppercase font-semibold">Daily deals</p>
        <p className="flex-1"></p>
      </div>
      <div className="">
        <div className="mb-3">
          <Link to={`${path.PRODUCTS}/${dailyDeals.product?.slug}`}>
            <img src={dailyDeals?.product?.primaryImage.url || DefaultProduct} alt={dailyDeals.product?.title} />
          </Link>
        </div>
        <PriceStartProduct
          to={`${path.PRODUCTS}/${dailyDeals.product?.slug}`}
          totalRating={dailyDeals.product?.totalRating}
          price={dailyDeals.product?.discountPrice}
          discountPrice={dailyDeals.price}
          title={dailyDeals.product?.title}
          detailDeals={true}
        />
        
        <div className="flex gap-1 justify-center mt-2">
          <CountDown text ={'Hours'} number={time.hours} />
          <CountDown text ={'Minutes'} number={time.minutes} />
          <CountDown text ={'Seconds'} number={time.seconds} />
        </div>
      </div>
    </div>
  )
}

export default DailyDeals