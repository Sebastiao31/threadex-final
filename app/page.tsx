'use client'
import Image from "next/image";
import NavBar from "@/components/layout/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import Features from "@/components/landing/Features";
import TwitterSignIn from "@/components/TwitterSignIn";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {

  

  

  return (
    <div className="pt-4 px-12 max-w-[1200px] mx-auto pb-16">
      <main className="">
        <div className="fixed top-0 left-0 right-0 z-50 max-w-[1200px] mx-auto mt-8 px-5">
          <NavBar />
        </div>
        
        <div>
          <HeroSection />
        </div>

        <div >
          <Features />
        </div>


      </main>
    </div>
  );
}
