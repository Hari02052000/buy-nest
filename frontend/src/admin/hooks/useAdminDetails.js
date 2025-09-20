import { useEffect } from "react";
import { useContext } from "react";
import { AdminContext, LoadingContext } from "../state/GlobalContext";
import { axiosInstance } from "../utills/axios.instance";

const useAdminDetails = () => {
  const { createAdmin, deleteAdmin } = useContext(AdminContext);
  const { stopLoading } = useContext(LoadingContext);
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axiosInstance.get("/admin");
        if (response?.data?.admin) {
          const admin = response.data.admin;
          createAdmin(admin.userName, admin.email, admin.profile);
        }
      } catch (error) {
        console.log(error);
        deleteAdmin();
      } finally {
        stopLoading();
      }
    };
    fetchAdmin();
  }, []);
};

export default useAdminDetails;
