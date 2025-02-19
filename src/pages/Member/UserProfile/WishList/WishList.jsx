import { useSelector } from "react-redux"
import Product from "~/pages/public/Home/component/Product/Product"

function WishList() {
  const {userData:{wishlist}} = useSelector(state => {return state.user})
  return (
    <div className="h-screen overflow-auto">
       <div className="bg-gray-100 h-[60px]">
        <h1 className="text-2xl font-semibold p-3">Danh sách yêu thích</h1>
      </div>
      <div className="grid grid-cols-12 mt-4">
        {
          wishlist?.map(wl => {
            let item = wl.product
            if(!item) return null
            return (
              <div className="max-lg:col-span-6 lg:col-span-3" key={item._id}>
                  <Product
                    pid={item._id}
                    price={item.price}
                    colors={item.colors}
                    discountPrice={item.discountPrice}
                    primaryImage={item.primaryImage.url}
                    soldQuantity={item.soldQuantity}
                    title={item.title}
                    slug={item.slug}
                    totalRating={item.totalRating}
                    className={'p-3 mb-3 mx-3'}
                  />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default WishList