import { Skeleton } from '@/components';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator } from '@/components';

export default function LoadingItemDetail() {
  return (
    <div className="container mx-auto px-4 py-10 lg:py-20">
      <main className="mt-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Makanan</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-5 w-32" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="md:hidden mt-6 mb-8">
          <Skeleton className="w-full h-[250px] rounded-lg" />
        </div>

        <div className="grid md:grid-cols-6 gap-7 mt-10">
          <div className="col-span-full md:col-span-4">
            <div className="mb-6">
              <Skeleton className="h-9 w-[60%] mb-2" />
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 mr-1" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>

            <Skeleton className="h-20 w-full mb-8" />

            <div className="mb-8">
              <Skeleton className="h-7 w-32 mb-4" />
              <div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between py-3 ">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <Skeleton className="h-7 w-40 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className=" rounded-md p-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-16 w-full mt-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-full md:col-span-2">
            <div className="hidden md:block mb-8">
              <Skeleton className="w-full h-[300px] rounded-lg" />
            </div>

            <div className="rounded-lg p-6 ">
              <Skeleton className="h-7 w-[80%] mb-4" />
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <div key={item} className="flex justify-between py-3 ">
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-16" />
                    {item <= 2 && <Skeleton className="h-4 w-8 ml-2" />}
                  </div>
                  <Skeleton className="h-5 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Skeleton className="h-8 w-56 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="border rounded-lg overflow-hidden">
                <Skeleton className="w-full h-40" />
                <div className="p-4">
                  <Skeleton className="h-6 w-[80%] mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
