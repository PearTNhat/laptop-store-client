import { HashLoader } from "react-spinners"

function Loading() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <HashLoader color="#ee3131"/>
    </div>
  )
}

export default Loading