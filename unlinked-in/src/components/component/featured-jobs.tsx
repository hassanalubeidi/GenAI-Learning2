import { Input } from "~/components/ui/input";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useRouter } from 'next/router'
import { api } from "~/utils/api";
import { JobListing } from "@prisma/client";

type JobCardProps = {
  job: JobListing;
};


const JobCard = ({ job } : JobCardProps) => {
  const router = useRouter()

  const openJobDetails = (e: any) => {
    e.preventDefault()
    router.push('/jobs/' + job.id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.company}</CardDescription>
      </CardHeader>
      <CardContent>{job.description}</CardContent>
      <CardFooter>
        <Button onClick={openJobDetails}>Learn More</Button>
      </CardFooter>
    </Card>
  );
}

export function SearchJobs() {
  const router = useRouter()

  const searchJobs = (e: any) => {
    e.preventDefault()
    const query = e.target.elements[0].value;
    router.push(`/jobs?query=${encodeURIComponent(query)}`)
  }
  
  return (
    <form onSubmit={searchJobs}>
      <Input
        type="search"
        name="query"
        placeholder="Search job titles or keywords" 
      />
    </form>
  )
}

export function FeaturedJobs() {
  const { data: jobs, isLoading: jobsLoading } = api.jobListing.getFeaturedJobs.useQuery();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Find Your Dream Job
            </h1>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Explore our featured job listings and find the perfect fit for
              you.
            </p>
          </div>
          <div className="w-full max-w-md">
            <SearchJobs />
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-6xl lg:grid-cols-3 py-12">
          {jobs && jobs.map((job) => (
            <JobCard
              job={job}
            />
          ))}
        </div>
      </div>
    </section>
  );
}