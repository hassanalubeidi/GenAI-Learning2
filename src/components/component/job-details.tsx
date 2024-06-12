import { JobListing } from "@prisma/client";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

type RelatedJobCardProps = {
  job: JobListing
};

const RelatedJobCard = ({ job }: RelatedJobCardProps) => {
  const router = useRouter()

  const openJobDetails = (e: any) => {
    e.preventDefault()
    router.push('/jobs/' + job.id)
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold cursor-pointer" onClick={openJobDetails}>{job.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{job.company}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{job.location}</p>
    </div>
  )
};

export function JobDetails() {
  const router = useRouter()
  const applyNow = (e: any) => {
    e.preventDefault()
    const jobId = parseInt(router.query.id as string)
    router.push(`/jobs/${jobId}/apply`)
  }

  const jobId = parseInt(router.query.id as string)

  const {data: job, isLoading: jobLoading} = api.jobListing.getJobListing.useQuery({ id: jobId })
  const {data: relatedJobs, isLoading: relatedJobsLoading} = api.jobListing.getRelatedJobs.useQuery({ id: jobId })

  // const job = api.jobListing

  if (jobLoading || relatedJobsLoading) {
    return <div>Loading...</div>
  }

  if(!job) {
    return <div>Job not found</div>
  }

  return (
    <section className="w-full py-4 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-3">
          <div className="lg:col-span-2 xl:col-span-2 space-y-6">
            <h1 className="text-4xl font-bold">{job.title}</h1>
            <div className="text-lg text-gray-500 dark:text-gray-400">
              <p className="font-semibold">{job.company}</p>
              <p>San Francisco, CA</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Job Description</h2>
              <p className="text-gray-500 dark:text-gray-400">
                {job.description}
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Requirements</h2>
              <ul className="list-disc pl-5">
                <li>Proven work experience as a Senior Frontend Developer</li>
                <li>Hands on experience with markup languages</li>
                <li>Experience with JavaScript, CSS and jQuery</li>
                <li>Familiarity with browser testing and debugging</li>
                <li>
                  In-depth understanding of the entire web development process
                  (design, development and deployment)
                </li>
              </ul>
            </div>
            <Button className="w-full md:w-auto" onClick={applyNow}>Apply Now</Button>
          </div>
          <div className="xl:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold">Related Jobs</h2>
            <div className="space-y-4">
              {relatedJobs && relatedJobs.map((job) => (
                <RelatedJobCard
                  key={job.title}
                  job={job}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}