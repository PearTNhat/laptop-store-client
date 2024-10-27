import { useSelector } from "react-redux"
import { HiMiniChevronRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
function HotCollections() {
    const { categories } = useSelector(state => state.productCategory)
    console.log('cate',categories)
    return (
        <div className="">
            <div className="uppercase border-b-2 border-b-main text-bl py-4 text-[20px] font-semibold mb-4">
                Hot Collections
            </div>
            <div className="flex flex-wrap sm:gap-4 gap-5 ">
                {
                    categories.map((category) => 
                    <div key={category._id} className="flex gap-4 w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.33%-10.66px)] border border-gray-300 rounded-md p-2">
                        <div className="w-[35%] flex items-center"><img src={category.image?.url} alt={category.title} /></div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-[14px]">{category.title}</h3>
                            <ul>
                                {
                                    category.brands?.map((brand, i)=> 
                                    <li key={i}>
                                        <Link className="flex items-center text-gray-500 hover:text-main">
                                            <HiMiniChevronRight/>
                                            {brand}
                                        </Link>
                                    </li>)
                                }
                            </ul>
                        </div>
                    </div>)
                }
            </div>
        </div>
    )
}

export default HotCollections