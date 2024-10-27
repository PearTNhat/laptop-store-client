/* eslint-disable react/prop-types */
/* eslint-disable indent */
import InputField from "~/components/InputField"
import Pagination from "~/components/Pagination"
function DataTable({
  pageTitle,
  title,
  submitSearchTitle,
  search,
  setSearch,
  placeholder = 'Search title',
  totalPageCount,
  data,
  tableHeaderTitleList,
  currentPage,
  setCurrentPage,
  children
}) {
  const isLoading = data?.isLoading || false
  const isFetching = data?.isFetching || false

  return (
    <div className="p-1">
      <h1 className="text-2xl">{pageTitle}</h1>
      <div className="p-8">
        <div className="flex justify-between">
          <h2 className="text-2xl">{title}</h2>
          <form className="flex gap-3" onSubmit={(e) => submitSearchTitle(e)}>
              <InputField
                type="text"
                placeholder={placeholder}
                className="px-4 py-[0.625rem] border-gray-200 border-[1px] rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={search}
                onChange={(e) => {
                  let value = e.target.value
                  if (value.startsWith(' ')) {
                    value = value.trim()
                  }
                  setSearch(value)
                }}
              />
          </form>
        </div>
        <div className="py-4">
          <div className="shadow">
            <table className="w-full">
              <thead className="">
                <tr className="border-gray-200 border-b">
                  {tableHeaderTitleList.map((title) => (
                    <th key={title} className="text-left p-4 font-normal" scope="col">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={5} className="text-2xl text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : data?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-xl text-center text-gray-500">
                      No data found
                    </td>
                  </tr>
                ) : (
                  children
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            onPageChange={setCurrentPage}
            currentPage={currentPage}
            siblingCount={1}
            totalPageCount={totalPageCount}
          />
        </div>
      </div>
    </div>
  )
}

export default DataTable
