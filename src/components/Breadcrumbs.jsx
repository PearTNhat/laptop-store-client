/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { MdOutlineChevronRight } from "react-icons/md";
import { memo } from "react";
function Breadcrumbs({title}) {
  const routes = [
    { path: "/", breadcrumb: "Home" },
    { path: "/:one", breadcrumb: title},
    { path: "/:category/:slug", breadcrumb: title },
  ];
  const breadcrumbs = useBreadcrumbs(routes);
  return (
    <div className="flex text-sm my-2">
      {breadcrumbs.map(({ match, breadcrumb },i) => (
        <NavLink key={match.pathname} to={match.pathname} className={ `flex items-center ${i === breadcrumbs.length-1 ? 'text-main' : 'text-bl'}`}>
          {breadcrumb} 
          {i < breadcrumbs.length-1 && <MdOutlineChevronRight/>}
        </NavLink>
      ))}
    </div>
  )
}

export default memo(Breadcrumbs)