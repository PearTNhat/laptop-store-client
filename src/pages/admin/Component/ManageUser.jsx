import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { apiGetAllUsers, apiUpdateRole } from "~/apis/user";
import DataTable from "./DataTable";
import { DefaultUser } from "~/assets/images";
import moment from "moment";
import { useDebounce } from "~/hook/useDebounce";
import { useSearchParams } from "react-router-dom";
import SelectItem from "~/components/SelectItem";
import { Toast } from "~/utils/alert";
import { FaRegEdit } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { MdBlock } from "react-icons/md";
const LIMIT = 10;
const options = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];
function ManageUser() {
  const [usersData, setUsersData] = useState([]);
  const [edit, setEdit] = useState();
  const { accessToken, userData } = useSelector((state) => state.user);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [search, serSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [payload, setPayload] = useState("");
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  const fetchAllUsers = async ({ search, page }) => {
    const response = await apiGetAllUsers({
      page,
      limit: LIMIT,
      accessToken,
      search,
    });
    if (response.success) {
      const totalPage = Math.ceil(response.counts / 10) || 1;
      if (totalPage < currentPage) {
        // khi search xong mà page hiện tại lớn hơn tổng số trang thì giảm page hiện tại đi 1
        setCurrentPage(currentPage - 1);
      }
      setUsersData(response.data);
      setTotalPageCount(totalPage);
    }
  };
  const handleUpdateRole = useCallback(async () => {
    const response = await apiUpdateRole({
      accessToken,
      role: payload.role,
      userId: payload.userId,
    });
    if (response.success) {
      setEdit(null);
      Toast.fire({
        icon: "success",
        title: "Cập thành công",
      });
      fetchAllUsers({ search: searchDebounce, page: currentPage });
    } else {
      Toast.fire({
        icon: "error",
        title: "Cập nhật thất bại",
      });
    }
  }, [payload]);
  const searchDebounce = useDebounce(search, 500);
  useEffect(() => {
    fetchAllUsers({ search: searchDebounce, page: currentPage });
  }, [searchDebounce, currentParams]);
  useEffect(() => {
    setSearchParams({ ...currentParams, page: currentPage });
  }, [currentPage]);
  return (
    <DataTable
      pageTitle="Quản lí người dùng"
      //title="Users"
      placeholder="Tìm kiếm tên hoặc email"
      search={search}
      setSearch={serSearch}
      tableHeaderTitleList={[
        "#",
        "Ảnh",
        "Tên",
        "Email",
        "SDT",
        "Vai trò",
        "Ngày tạo",
        "Chức năng",
      ]}
      totalPageCount={totalPageCount}
      currentPage={currentPage}
      data={usersData}
      setCurrentPage={setCurrentPage}
      isEdit={edit}
      onUpdate={handleUpdateRole}
    >
      {usersData?.map((user, index) => {
        let isEdit = edit == user._id;
        return (
          <tr
            key={user._id}
            className={`${userData._id === user._id && "bg-blue-50"}`}
          >
            <td className="p-2 border-gray-200 border-b text-sm">
              {index + 1}
            </td>
            <td className="p-2 gap-2 border-gray-200 border-b text-sm">
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
            <td className="p-2 border-gray-200 border-b text-sm">
              {user.firstName} {user.lastName}
            </td>
            <td className="p-2 border-gray-200 border-b text-sm">
              <p>{user.email}</p>
            </td>
            <td className={`p-2 border-gray-200 border-b text-sm capitalize`}>
              {user?.phone ? user.phone : "Chưa cập nhật"}
            </td>
            <td className={` p-2 border-gray-200 border-b text-sm capitalize`}>
              {isEdit ? (
                <SelectItem
                  isSearchable
                  options={options}
                  onChange={(data) => {
                    setPayload({ role: data.value, userId: user._id });
                  }}
                  defaultValue={options.find(
                    (item) => item.value === user.role
                  )}
                />
              ) : (
                <span
                  className={`${user?.role === "admin" && "text-green-500"}`}
                >
                  {user?.role}
                </span>
              )}
            </td>
            <td className="p-2 border-gray-200 border-b text-sm">
              <p>{moment(user.createdAt).format("DD/MM/YYYY HH:mm")}</p>
            </td>
            <td className="p-2 border-gray-200 border-b text-sm">
              {userData._id !== user._id && (
                <>
                  <button
                    className={`mr-3 ${
                      isEdit
                        ? "text-red-600 hover:text-red-900"
                        : "text-yellow-400 hover:text-yellow-600"
                    } `}
                    onClick={() => {
                      if (isEdit) {
                        setEdit(null);
                      } else {
                        setEdit(user._id);
                      }
                    }}
                  >
                    {isEdit ? (
                      <MdCancel className=" text-[18px]" />
                    ) : (
                      <FaRegEdit  className=" text-[18px]"/>
                    )}
                  </button>
                  <button className=" text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed">
                    <MdBlock className=" text-[18px]"/>
                  </button>
                </>
              )}
            </td>
          </tr>
        );
      })}
    </DataTable>
  );
}

export default ManageUser;
