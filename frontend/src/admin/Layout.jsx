import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "./components/global/SideBar";
import Loader from "./components/global/Loader";
import TopBar from "./components/global/TopBar";
import ProductList from "./pages/ProductList";
import CategoryList from "./pages/CategoryList";
import DashBoard from "./pages/DashBoard";
import LoginPage from "./pages/LoginPage";
import { AdminContext, LoadingContext } from "./state/GlobalContext";
import useAdminDetails from "./hooks/useAdminDetails";
import AddProduct from "./pages/AddProduct";
import AddCategory from "./pages/AddCategory";
import {
  setAxiosDeleteAdmin,
  setAxiosCreateAdmin,
  setAxiosStartLoading,
  setAxiosStopLoading,
} from "./utills/axios.delete.admin";
import EditProduct from "./pages/EditProduct";
import OrderList from "./pages/OrderList";
import EditOrder from "./pages/EditOrder";
import EditCategory from "./pages/EditCategory";

function Layout() {
  const { admin, deleteAdmin, createAdmin } = useContext(AdminContext);
  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);
  setAxiosDeleteAdmin(deleteAdmin);
  setAxiosCreateAdmin(createAdmin);
  setAxiosStartLoading(startLoading);
  setAxiosStopLoading(stopLoading);
  useAdminDetails();
  if (!admin)
    return (
      <>
        <Loader open={isLoading} />
        <LoginPage />
      </>
    );

  return (
    <>
      <Loader open={isLoading} />
      <SideBar />
      <main className="content">
        <TopBar />
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/add-category/:parentId" element={<AddCategory />} />
          <Route path="/edit-product/:productId" element={<EditProduct />} />
          <Route path="/edit-category/:categoryId" element={<EditCategory />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/order/:orderId" element={<EditOrder />} />
        </Routes>
      </main>
    </>
  );
}

export default Layout;
