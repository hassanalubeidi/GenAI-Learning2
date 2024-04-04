/*

    function RecentApplicationsTable() {
  const { data: recentApplications } = api.application.getRecentApplications.useQuery()

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
          {recentApplications?.map((application: Application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.userId}</TableCell>
              <TableCell>{application.jobListingId}</TableCell>
              <TableCell>{application.createdAt.toDateString()}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline">
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

*/

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const applicationRouter = createTRPCRouter({
    getStats: publicProcedure.query(async ({ ctx }) => {
        const applications = await ctx.db.application.findMany()

        const totalApplications = applications.length
        const totalApplicationsChange = applications.filter(application => application.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
        const newCandidates = applications.length
        const newCandidatesChange = applications.filter(application => application.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length

        return {
            totalApplications,
            totalApplicationsChange,
            newCandidates,
            newCandidatesChange
        }
    }),
    getRecentApplications: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.application.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 5,
            include: {
                jobListing: true,
                user: true
            }
        })
    }),
    getApplication: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.application.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    jobListing: true,
                    user: true
                }
            })
        }),
        

        
})