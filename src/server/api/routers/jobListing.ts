import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const jobListingRouter = createTRPCRouter({
    getFeaturedJobs: publicProcedure.query(({ ctx }) => {
        return ctx.db.jobListing.findMany({
            where: {
                featured: true
            }
        })
    }),
    getJobListing: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ ctx, input }) => {
        return ctx.db.jobListing.findFirst({
            where: {
                id: input.id
            }
        })
    }),
    getRelatedJobs: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const job = await ctx.db.jobListing.findFirst({
                where: {
                    id: input.id
                }
            })

            if (!job) {
                return []
            }

            // Find jobs with similar title, company, or description
            // Exclude the current job

            const recommended = await ctx.db.jobListing.findMany({
                where: {
                    id: {
                        not: input.id
                    },
                    AND: {
                        OR: [
                            {
                                title: {
                                    contains: job.title
                                }
                            },
                            {
                                company: {
                                    contains: job.company
                                }
                            },
                        ]
                    }
                }
            })

            if(recommended && recommended.length < 3) {
                // fill up with randomly selected jobs until we have 3
                const randomJobs = await ctx.db.jobListing.findMany().then(jobs => {
                    return jobs.sort(() => Math.random() - 0.5).slice(0, 3 - recommended.length)
                })

                return recommended.concat(randomJobs)
            }

            return recommended
    }),
    searchJobListings: publicProcedure
        .input(z.object({ query: z.string() }))
        .query(({ ctx, input }) => {
        return ctx.db.jobListing.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: input.query
                        }
                    },
                    {
                        company: {
                            contains: input.query
                        }
                    },
                    {
                        description: {
                            contains: input.query
                        }
                    }
                ]
            }
        })
    }),
    getStats: publicProcedure.query(async ({ ctx }) => {
        const totalApplications = await ctx.db.application.count()
        const totalApplicationsChange = await ctx.db.application.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
                }
            }
        })

        const newCandidates = await ctx.db.application.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
                }
            }
        })

        const newCandidatesChange = await ctx.db.application.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
                }
            }
        })

        const openPositions = await ctx.db.jobListing.count({
            where: {
                status: 'OPEN'
            }
        })

        const openPositionsChange = await ctx.db.jobListing.count({
            where: {
                status: 'OPEN',
                createdAt: {
                    gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
                }
            }
        })

        return {
            totalApplications,
            totalApplicationsChange,
            newCandidates,
            newCandidatesChange,
            openPositions,
            openPositionsChange
        }
    })
        

        
})