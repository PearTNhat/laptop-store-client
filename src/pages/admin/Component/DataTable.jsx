/* eslint-disable react/prop-types */
/* eslint-disable indent */
import InputField from "~/components/InputField";
import Pagination from "~/components/Pagination";
function DataTable({
  pageTitle,
  submitSearchTitle,
  search,
  setSearch,
  placeholder = "Search title",
  totalPageCount,
  data,
  isEdit,
  onUpdate,
  tableHeaderTitleList,
  currentPage,
  setCurrentPage,
  children,
}) {
  const isLoading = data?.isLoading || false;
  const isFetching = data?.isFetching || false;

  return (
    <div className="h-screen overflow-auto">
      <h1 className="text-2xl font-semibold">Quản lý người dùng</h1>
      <div className="p-1">
        <div className="flex justify-between mt-4">
          <form className="flex gap-3" onSubmit={(e) => submitSearchTitle(e)}>
            <InputField
              type="text"
              placeholder={placeholder}
              className="px-4 py-[0.625rem] border-gray-200 border-[1px] rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={search}
              onChange={(e) => {
                let value = e.target.value;
                if (value.startsWith(" ")) {
                  value = value.trim();
                }
                setSearch(value);
              }}
            />
          </form>
          {isEdit && (
            <button
              type="submit"
              className="bg-blue-600  hover:bg-blue-700 text-white h-[40px] px-3 rounded-md"
              onClick={onUpdate}
            >
              Cập nhật
            </button>
          )}
        </div>
        <div className="py-4">
          <div className="shadow bg-white rounded-md overflow-hidden">
            <table className="border border-gray-200 w-full">
              <thead className="">
                <tr className="border-gray-200 border-b bg-blue-900 text-white font-semibold">
                  {tableHeaderTitleList.map((title) => (
                    <th key={title} className="text-left p-2" scope="col">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-2xl text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : data?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-xl text-center text-gray-500"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  children
                )}
              </tbody>
            </table>
          </div>
          <div className="pb-2 py-5">
            <Pagination
              onPageChange={setCurrentPage}
              currentPage={currentPage}
              siblingCount={1}
              totalPageCount={totalPageCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
