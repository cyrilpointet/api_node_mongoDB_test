import { AuthProvider } from "react-admin";

export const setAuthProvider = (apiUrl: string): AuthProvider => {
  return {
    login: ({ username, password }) => {
      const request = new Request(apiUrl, {
        method: "POST",
        body: JSON.stringify({ email: username, password }),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      return fetch(request)
        .then((response) => {
          if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("token", data.token);
        });
    },
    logout: () => {
      localStorage.removeItem("token");
      return Promise.resolve();
    },

    checkAuth: () => {
      return localStorage.getItem("token")
        ? Promise.resolve()
        : Promise.reject();
    },

    checkError: (error) => {
      const status = error.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        return Promise.reject();
      }
      return Promise.resolve();
    },

    getPermissions: () => {
      return localStorage.getItem("token")
        ? Promise.resolve()
        : Promise.reject();
    },
  };
};
