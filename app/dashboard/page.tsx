import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import ThreadGeneratorForm from "@/components/ThreadGeneratorForm"
import Image from "next/image"

export default function Page() {
  return (
    <div className="flex flex-col items-center h-full justify-center gap-4 pb-24 px-4 lg:gap-2 lg:px-6 max-sm:justify-between max-sm:pt-32 max-sm:pb-4">
      <div className="flex flex-col gap-10 items-center justify-center">
        <Image src="/images/Logo.png" alt="Threadex" width={60} height={60} />
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-center">Hello, username 👋🏼</h1>
            <p className="text-sm text-gray-500 text-center">
                What thread do you want to create today?
            </p>
        </div>
      </div>

      <div className="mt-16 w-full">
        <ThreadGeneratorForm />
      </div>
    </div>
  )
}