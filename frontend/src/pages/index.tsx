//TODO
// Depending on your logged or not it changes the <section>

import React from "react";
import { Image } from "@chakra-ui/react"
import Link from "next/link";

export default function Home() {
  interface grid3 { // Need to change name
    title: string;
    description: string;
    url: string
  }
  const grid3: grid3[] = [
    { title: "Sign In", description: "test1", url: "/signin" },
    { title: "Development", description: "test2", url: "/vendor" },
    { title: "Sign Up", description: "test3", url: "/signup" },
  ];

  return (
    <main>
      <div className="relative text-center">
        <Image
          width="100%"
          height="600px"
          className="opacity-35"
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2698&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="formal dinner table" />
        <h1 className="absolute inset-0 flex items-center justify-center text-black !text-6xl">Welcome to the Venue Vendors</h1>
      </div>
      <h2 className="!text-3xl flex items-center justify-center">Here are some of the services we offer</h2>
      <h2 className="!text-2xl flex items-center justify-center">Explore being a hirer or vendor with us!</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-center">
          <h3>Hirer</h3>
        </div>
        <div className="flex items-center justify-center">
          <h3 >Vendor</h3>
        </div>
      </div>
      <section id="contact" className="mb-6">
        <h3 className="font-semibold mb-4">Services</h3>
        <div className="grid grid-cols-3 gap-4">
          {grid3.map((grid3) => (
            <div key={grid3.title} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <Link href={grid3.url}>
                <p className="font-medium">{grid3.title}</p>
                <p className="text-sm text-gray-500 mt-1">{grid3.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main >

  );
}