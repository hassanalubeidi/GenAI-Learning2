/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/RPXFyNJFuY4
 */
import Link from "next/link"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { CardTitle, CardHeader, CardContent, Card } from "~/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "~/components/ui/table"
import { api } from "~/utils/api"
import { Application, Prisma } from "@prisma/client"
import { useRouter } from "next/router"


export function DashboardHeader() {
  return (
    <header className="flex items-center h-16 border-b shrink-0 md:px-6">
        <nav className="flex-col hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
          <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" href="#">
            <BriefcaseIcon className="w-6 h-6" />
            <span className="sr-only">Employer Dashboard</span>
          </Link>
          <Link className="font-bold" href="#">
            Applications
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" href="#">
            Positions
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" href="#">
            Candidates
          </Link>
        </nav>
        <div className="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="flex-1 ml-auto sm:flex-initial">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                placeholder="Search applications..."
                type="search"
              />
            </div>
          </form>
          <Button className="rounded-full" size="icon" variant="ghost">
            <img
              alt="Avatar"
              className="rounded-full"
              height="32"
              src="/placeholder.svg"
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </div>
      </header>
  )
}

export function DashboardStats() {
  const { data: applicationStats } = api.application.getStats.useQuery()
  const { data: jobListingStats } = api.jobListing.getStats.useQuery()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <ClipboardIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{applicationStats?.totalApplications}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{applicationStats?.totalApplicationsChange} from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
          <BuildingIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{jobListingStats?.openPositions}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{jobListingStats?.openPositionsChange} from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">New Candidates</CardTitle>
          <GroupIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{applicationStats?.newCandidates}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{applicationStats?.newCandidatesChange} since last month</p>
        </CardContent>
      </Card>
    </div>
  )
}

type ApplicationWithUserAndJobListing = Prisma.ApplicationGetPayload<{
  include: { user: true, jobListing: true }
}>

export function RecentApplicationsTable() {
  const router = useRouter()
  const { data: recentApplications } = api.application.getRecentApplications.useQuery()
  const openApplicationDetails = (application: Application) => {
    router.push('/employer-dashboard/applications/' + application.id)
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Applicant</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentApplications?.map((application: ApplicationWithUserAndJobListing) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.user.name}</TableCell>
              <TableCell>{application.jobListing.title}, {application.jobListing.company}</TableCell>
              <TableCell>{application.createdAt.toDateString()}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={() => openApplicationDetails(application)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

export function EmployerDashboard() {
  return (
    <div className="flex flex-col w-full min-h-screen container">
      <DashboardHeader />
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 py-4 md:gap-8 md:p-10">
        <DashboardStats />
        <RecentApplicationsTable />
      </main>
    </div>
  )
}


function BriefcaseIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}


function SearchIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function ClipboardIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}


function BuildingIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}


function GroupIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7V5c0-1.1.9-2 2-2h2" />
      <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
      <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
      <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
      <rect width="7" height="5" x="7" y="7" rx="1" />
      <rect width="7" height="5" x="10" y="12" rx="1" />
    </svg>
  )
}