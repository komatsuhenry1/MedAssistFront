"use client"

import { Header } from "@/components/Header";
import Link from "next/link";
import { useState } from "react";

export default function Home() {

  const[value, setValue] = useState<string>("")
  
  fetch("http://localhost:8080/auth/testnext").then((apiResponse) => apiResponse.json()).then((data) => setValue(data.message))

  function contactApi() {
    return "ok"
  }

  return (
    <>
    <Header />
    <Link href="/register">Register</Link>
      <h1>ola</h1>
      <p>{value}</p>
    </>
  );
}
