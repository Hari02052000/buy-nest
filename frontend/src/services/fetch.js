const API_BASE_URL = import.meta.env.VITE_BACKEND_URL?`${import.meta.env.VITE_BACKEND_URL}/api/v1`:"/api/v1"


class APIFetcher {
  constructor(baseURL) {
    console.log(baseURL);
    this.baseURL = baseURL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  async refreshToken() {    
    try {
      const res = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Refresh failed");
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  }

  processQueue(error = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      error ? reject(error) : resolve();
    });
    this.failedQueue = [];
  }

  async handleResponse(response, originalRequest) {
    if (
      response.status === 401 &&
      !originalRequest._retry
    ) {
      let errorData;
      try {
        errorData = await response.clone().json();
      } catch {
        errorData = {};
      }

      if (errorData?.error === "token expired") {
        originalRequest._retry = true;

        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedQueue.push({
              resolve: async () => {
                const retryRes = await fetch(originalRequest.url, originalRequest);
                resolve(this.handleResponse(retryRes, originalRequest));
              },
              reject,
            });
          });
        }

        this.isRefreshing = true;

        try {
          const result = await this.refreshToken();
          if (result.success) {
            this.processQueue(null);
            const retryRes = await fetch(originalRequest.url, originalRequest);
            return this.handleResponse(retryRes, originalRequest);
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (error) {
          this.processQueue(error);
          window.location.href = "/login";
          throw error;
        } finally {
          this.isRefreshing = false;
        }
      }
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.clone().json();
      } catch {
        errorData = {};
      }
      const message = errorData?.error || `HTTP error: ${response.status}`;
      throw new Error(message);
    }

    return response.json();
  }

  async request(path, { method = "GET", body = null, signal = null } = {}) {
    const url = `${this.baseURL}${path}`;

    const options = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      signal
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const originalRequest = { url, ...options };

    const response = await fetch(url, originalRequest);
    return this.handleResponse(response, originalRequest);
  }
}

export const apiFetcher = new APIFetcher(API_BASE_URL)
