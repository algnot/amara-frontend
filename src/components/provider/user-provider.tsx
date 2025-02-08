/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { BackendClient } from "@/lib/request";
import { isErrorResponse, UserType } from "@/types/request";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const UserContext = createContext<UserType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const client = new BackendClient();
  const [userData, setUserData] = useState<UserType | null>(null);

  const fetchData = async () => {
    const response = await client.getUserInfo();

    if (isErrorResponse(response)) {
      setUserData(null);
      return;
    }

    setUserData(response);
  };

  useEffect(() => {
    fetchData();
  }, []); 

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
