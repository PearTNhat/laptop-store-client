import { HiMiniChevronRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import path from "~/constants/path";

const mockCollections = [
    {
        _id: 1, title: 'Smartphone', slug: 'smartphone',
        image: { url: 'https://cdn-icons-png.flaticon.com/128/186/186239.png' },
        brands: ['Apple', 'Samsung', 'Oppo', 'Xiaomi']
    },
    {
        _id: 2, title: 'Laptop', slug: 'laptop',
        image: { url: 'https://cdn-icons-png.flaticon.com/128/3178/3178283.png' },
        brands: ['Asus', 'Dell', 'Acer', 'Lenovo', 'HP', 'Macbook']
    },
    {
        _id: 3, title: 'Tablet', slug: 'tablet',
        image: { url: 'https://cdn-icons-png.flaticon.com/128/626/626572.png' },
        brands: ['iPad', 'Samsung', 'Xiaomi', 'Lenovo']
    },
    {
        _id: 4, title: 'Accessories', slug: 'accessories',
        image: { url: 'https://cdn-icons-png.flaticon.com/128/869/869300.png' },
        brands: ['Smartwatches', 'Headphone', 'Keyboard', 'Mouse']
    },
    {
        _id: 5, title: 'Television', slug: 'television',
        image: { url: 'https://cdn-icons-png.flaticon.com/128/3178/3178280.png' },
        brands: ['Apple', 'Samsung', 'LG', 'Sony']
    },
    {
        _id: 6, title: 'Printer', slug: 'printer',
        image: { url: 'https://cdn-icons-png.flaticon.com/128/2920/2920364.png' },
        brands: ['Canon', 'HP', 'Brother', 'Epson']
    }
]

function HotCollections() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-6 mt-12">
            <h3 className="relative uppercase text-bl pb-3 text-2xl font-bold border-b border-gray-200">
                Bộ sưu tập nổi bật
                <span className="absolute bottom-[-1px] left-0 w-24 h-1 bg-main"></span>
            </h3>
            <div className="flex flex-wrap sm:gap-4 gap-5">
                {
                    mockCollections.map((category) => 
                    <div key={category._id} className="flex gap-4 w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.33%-10.66px)] border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                        <div className="w-[30%] flex items-center justify-center p-2">
                          <img src={category.image?.url} alt={category.title} className="w-full object-contain" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-[16px] text-gray-800 mb-2 uppercase">{category.title}</h3>
                            <ul className="text-sm text-gray-500 space-y-1">
                                {
                                    category.brands?.map((brand, i)=> 
                                    <li key={i}>
                                        <Link to={`${path.PUBLIC}${path.PRODUCTS_CATEGORY}?category=${category.slug}`} className="flex items-center hover:text-main transition-colors">
                                            <HiMiniChevronRight className="mr-1 text-gray-400" size={14}/>
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