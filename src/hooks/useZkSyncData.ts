import { useState, useEffect } from "react";
import { RestApiService } from "../lib/api/rest";
import { API_CONFIG, Network } from "../lib/api/config";

type DataType = "transactions" | "blocks" | "accounts" | "tokens";

interface UseZkSyncDataOptions {
  type: DataType;
  network?: Network;
  address?: string;
  hash?: string;
  number?: number;
  limit?: number;
  offset?: number;
  from?: string;
  to?: string;
  status?: string;
}

export const useZkSyncData = <T>({
  type,
  network = "mainnet",
  address,
  hash,
  number,
  limit,
  offset,
  from,
  to,
  status,
}: UseZkSyncDataOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [api] = useState(() => RestApiService.getInstance(network));

  useEffect(() => {
    api.setNetwork(network);
  }, [network, api]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let response;

      console.log("Fetching data with params:", {
        type,
        network,
        address,
        hash,
        number,
        limit,
        offset,
        from,
        to,
        status,
      });

      switch (type) {
        case "transactions":
          if (hash) {
            response = await api.getTransaction(hash);
          } else {
            response = await api.getTransactions({
              limit,
              offset,
              from,
              to,
              status,
            });
          }
          break;
        case "blocks":
          if (number) {
            response = await api.getBlock(number);
          } else {
            response = await api.getBlocks({
              limit,
              offset,
              from: from ? parseInt(from) : undefined,
              to: to ? parseInt(to) : undefined,
            });
          }
          break;
        case "accounts":
          if (!address) throw new Error("Account address is required");
          response = await api.getAccount(address);
          break;
        case "tokens":
          if (address) {
            response = await api.getToken(address);
          } else {
            response = await api.getTokens({ limit, offset });
          }
          break;
        default:
          throw new Error(`Unsupported data type: ${type}`);
      }

      if (response.error) {
        console.error("API Response Error:", {
          type,
          network,
          error: response.error,
          params: { address, hash, number, limit, offset, from, to, status },
        });
        throw new Error(response.error);
      }

      console.log("API Response Success:", {
        type,
        network,
        data: response.data,
      });

      setData(response.data as T);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch data";
      console.error("useZkSyncData Error:", {
        type,
        network,
        error: errorMessage,
        params: { address, hash, number, limit, offset, from, to, status },
      });
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up polling based on data type
    const interval = setInterval(() => {
      fetchData();
    }, API_CONFIG.POLLING_INTERVALS[type] || 10000);

    return () => clearInterval(interval);
  }, [type, network, address, hash, number, limit, offset, from, to, status]);

  return { data, loading, error, refetch: fetchData };
};
