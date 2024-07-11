"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const GetIp = () => {
  const [ip, setIp] = useState<string>("Loading...");

  useEffect(() => {
    const getIp = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setIp(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
        setIp("Failed to get IP");
      }
    };

    void getIp();
  }, []);

  return {
    ip: ip,
  };
};

export default GetIp;
