import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { apiGetAllUsers } from "~/apis/user";
import DataTable from "./DataTable";
import { DefaultUser } from "~/assets/images";
import moment from "moment";
import { useDebounce } from "~/hook/useDebounce";
import { useSearchParams } from "react-router-dom";

function ManageUser() {
  const [usersData, setUsersData] = useState([]);
  const {accessToken} =useSelector(state=>state.user)
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [search,serSearch] = useState('')
  const [currentPage,setCurrentPage] = useState(1)
  const [searchParams,setSearchParams] = useSearchParams()
  const currentParams =useMemo(()=> Object.fromEntries([...searchParams]),[searchParams]) 
  const fetchAllUsers = async ({search}) => {
    const response = await apiGetAllUsers({page:1,limit:10,accessToken,search});
    if(response.success){
      setUsersData(response.data);
      setTotalPageCount(Math.ceil(response.counts/1) )
    }
  }
  const searchDebounce = useDebounce(search, 500);
  useEffect(() => {
    fetchAllUsers({search:searchDebounce,page:currentPage});
  }, [searchDebounce,currentParams]);  
  useEffect(() => {
    setSearchParams({...currentParams, page: currentPage})
  },[currentPage] ) 
  return (
    <DataTable
      pageTitle="Manage Users"
      title="Users"
      placeholder="Search user or email"
      search={search}
      setSearch={serSearch}
      tableHeaderTitleList={["#","Avatar", "Name", "Email", "Role", "Create at","Action"]}
      totalPageCount={totalPageCount}
      currentPage={1}
      data={usersData}
      onPageChange={setCurrentPage}
    >
      {usersData?.map((user,index) => (
        <tr key={user._id}>
          <td className="p-4 border-gray-200 border-b text-sm">
              {index+1}
          </td>
          <td className="p-4 gap-2 border-gray-200 border-b text-sm">
            <div className="flex gap-3 items-center justify-start">
              <div className="w-10 h-10 rounded-full  overflow-hidden">
                <img
                  className="object-cover object-center w-full h-full"
                  src={`${user?.avatar ? user.avatar.url : DefaultUser}`}
                  alt=""
                />
              </div>
              <p className="flex-1 ">{user?.name}</p>
            </div>
          </td>
          <td className="p-4 border-gray-200 border-b text-sm">
             {user.firstName} {user.lastName}
          </td>
          <td className="p-4 border-gray-200 border-b text-sm">
            <p>
             {user.email}
            </p>
          </td>
          <td className={`${user?.role === 'admin' && 'text-green-500'} p-4 border-gray-200 border-b text-sm capitalize`}>
              {user?.role}
          </td>
          <td className="p-4 border-gray-200 border-b text-sm">
            <p>
             {moment(user.createdAt).format('DD/MM/YYYY HH:mm')}
            </p>
          </td>
          <td className="p-4 border-gray-200 border-b text-sm">
            <button
              className={`mr-3 text-yellow-400 hover:text-yellow-600`}
            
            >
              Edit
            </button>
            <button
              className=" text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
          
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </DataTable>
  )
}

export default ManageUser