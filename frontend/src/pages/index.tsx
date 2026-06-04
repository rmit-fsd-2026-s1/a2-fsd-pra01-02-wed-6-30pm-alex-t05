import { Image } from "@chakra-ui/react"
import Link from "next/link";
import { useEvent } from "@/context/EventContext";
import IndexCard from "@/components/indexCard";
export default function Home() {
  const { events } = useEvent();
  interface grid2 {
    title: string;
    description: string;
    url: string
  }
  const grid2: grid2[] = [
    { title: "Sign In", description: "Sign in and test being vendor or hirer", url: "/signin" },
    { title: "Sign Up", description: "Sign up to become a hirer", url: "/signup" },
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
      <h2 className="!text-3xl flex items-center justify-center pt-5">Here is one of our example Venues</h2>
      {events.length > 0 && ( // Checks if there any avaliable events. if there is, display the first on the array list.
        <IndexCard
          eventID={events[0].eventId}
          eventName={events[0].eventName}
          numberOfGuest={events[0].numberOfGuest}
          image={events[0].image}
          shortDescription={events[0].shortDescription}
          isBlocked={events[0].isBlocked}
        />
      )}

      <h2 className="!text-3xl flex items-center justify-center pt-5">Explore being a hirer or vendor with us!</h2>
      <section id="contact" className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          {grid2.map((grid2) => ( // Goes through the grid2 array and display the values the a grid format
            <div key={grid2.title} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <Link href={grid2.url}>
                <p className="font-medium">{grid2.title}</p>
                <p className="text-sm text-gray-500 mt-1">{grid2.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main >

  );
}