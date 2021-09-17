import { fetchUtils } from "ra-core";
import { DataProvider } from "react-admin";

export const setDataProvider = (apiUrl: string): DataProvider => {
  const httpClient = (url, opt = {}) => {
    const options = {
      headers: new Headers({ Accept: "application/json" }),
      ...opt,
    };
    const token = localStorage.getItem("token");
    if (token) {
      options.headers.set("Authorization", `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, options);
  };

  return {
    getList: (resource, params) => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;

      const query = `page=${page}&perPage=${perPage}&sort=${field}&order=${order}`;

      const url = `${apiUrl}/${resource}?${query}`;
      return httpClient(url).then(({ headers, json }) => {
        return {
          data: json,
          total: parseInt(headers.get("X-Total-Count")),
        };
      });
    },
    getOne: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
        data: json,
      })),
    getMany: () => Promise.reject(),
    getManyReference: () => Promise.reject(),
    update: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({ data: json })),
    updateMany: () => Promise.reject(),
    create: (resource, params) =>
      httpClient(`${apiUrl}/${resource}`, {
        method: "POST",
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({
        data: { ...params.data, id: json.id },
      })),
    delete: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: "DELETE",
      }).then(({ json }) => ({ data: json })),
    deleteMany: (resource, params) => {
      return httpClient(`${apiUrl}/${resource}`, {
        method: "DELETE",
        body: JSON.stringify({ ids: params.ids }),
      }).then(({ json }) => ({ data: json }));
    },
  };
};
