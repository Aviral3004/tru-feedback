"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import messages from "../../../public/message.json";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const SkeletonCard = () => {
  return (
    <div className="p-1 w-full max-w-xs mx-auto">
      <Skeleton className="h-105 w-full rounded-xl" />
    </div>
  );
};

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<typeof messages>([]);
  useEffect(() => {
    let timer = setTimeout(() => {
      setData(messages);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Say what you feel, stay truly anonymous.
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore TruFeedback — where your words matter, not your name.
          </p>
        </section>
        {loading ? (
          <SkeletonCard />
        ) : (
          <Carousel
            plugins={[AutoPlay({ delay: 2000, stopOnInteraction: false })]}
            className="w-full max-w-xs"
          >
            <CarouselContent>
              {data.map((msg, idx) => (
                <CarouselItem key={idx}>
                  <div className="p-1">
                    <Card>
                      <CardHeader className="text-center">
                        {msg.title}
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-lg font-semibold text-center">
                          {msg.content}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        )}
      </main>
      <footer className="text-center p-4 md:p-6">
        &copy; {new Date().getFullYear()} TruFeedback. All rights reserved.
      </footer>
    </>
  );
};

export default HomePage;
