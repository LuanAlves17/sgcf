"use client"

import { useRouter } from "next/navigation";



export default function Home() {
  const navigation = useRouter();

  return navigation.push("/dashboard");
}
