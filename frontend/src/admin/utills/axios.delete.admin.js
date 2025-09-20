export let axiosDeleteAdminFunction = null;
export let axiosCreateAdminFunction = null;
export let axiosStartLoadingFunction = null;
export let axiosStopLoadingFunction = null;
export const setAxiosDeleteAdmin = (deleteAdminfn) => {
  axiosDeleteAdminFunction = deleteAdminfn;
};
export const setAxiosCreateAdmin = (createAdminfn) => {
  axiosCreateAdminFunction = createAdminfn;
};
export const setAxiosStartLoading = (startLoadingfn) => {
  axiosStartLoadingFunction = startLoadingfn;
};
export const setAxiosStopLoading = (stopLoadingfn) => {
  axiosStopLoadingFunction = stopLoadingfn;
};
