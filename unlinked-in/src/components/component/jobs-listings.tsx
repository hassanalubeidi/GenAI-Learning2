import { Input } from "~/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "~/components/ui/select";
import {
  PaginationPrevious,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationContent,
  Pagination,
} from "~/components/ui/pagination";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { JobListing } from "@prisma/client";

type JobCardProps = {
  job: JobListing;
};

const JobCard = ({ job }: JobCardProps) => {
  const router = useRouter()

  const openJobDetails = (e: any) => {
    e.preventDefault()
    router.push('/jobs/' + job.id)
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold text-lg cursor-pointer" onClick={openJobDetails}>{job.title}</h3>
      <p className="text-sm text-gray-500">{job.company}</p>
    </div>
  )
};

export function JobListings() {
  const router = useRouter()

  const {data: jobs, isLoading: jobsLoading} = api.jobListing.searchJobListings.useQuery({
    query: router.query.query as string
  })

  return (
    <section className="container mx-auto px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Filter Jobs</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-semibold">Location</p>
              <Input id="location" placeholder="Enter location" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Job Type</p>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Experience Level</p>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry-level">Entry Level</SelectItem>
                  <SelectItem value="mid-level">Mid Level</SelectItem>
                  <SelectItem value="senior-level">Senior Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Available Jobs</h2>
          <div className="space-y-6">
            {jobs && jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
            {
              (jobs && jobs.length === 0 && !jobsLoading) && (
                <div>No jobs found</div>
              )
            }
          </div>
          {/* <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div> */}
        </div>
      </div>
    </section>
  );
}