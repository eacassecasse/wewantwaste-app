import { api } from "../lib/axios";

export default function useApi() {
  const fetch = async (url: string, options = {}): Promise<any> => {
    try {
      const { data } = await api({
        url,
        method: "GET",
        ...options,
      });

      return data;
    } catch (error) {
      console.error("Failed to authenticate", error);
      throw error;
    }
  };

  return { fetch };
}
