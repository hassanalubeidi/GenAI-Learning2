import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const jobListings = [
    {
      title: 'Software Engineer',
      description: 'We are seeking a talented Software Engineer to join our team. The ideal candidate should have experience in developing scalable and robust software solutions.',
      company: 'Acme Inc.',
      location: 'San Francisco, CA',
      jobType: 'Full-time',
      experienceLevel: 'Mid-level',
      featured: true,
    },
    {
      title: 'Marketing Manager',
      description: 'We are looking for a creative and data-driven Marketing Manager to lead our marketing efforts. The ideal candidate should have experience in developing and executing marketing strategies.',
      company: 'Globex Corporation',
      location: 'New York, NY',
      jobType: 'Full-time',
      experienceLevel: 'Senior-level',
      featured: false,
    },
    {
      title: 'Graphic Designer',
      description: 'We are seeking a talented Graphic Designer to create visually compelling designs for our brand. The ideal candidate should have a strong portfolio and experience in Adobe Creative Suite.',
      company: 'Initech',
      location: 'Los Angeles, CA',
      jobType: 'Part-time',
      experienceLevel: 'Entry-level',
      featured: false,
    },
    {
      title: 'Data Analyst',
      description: 'We are looking for a skilled Data Analyst to help us make data-driven decisions. The ideal candidate should have experience in SQL, data visualization, and statistical analysis.',
      company: 'Wonka Industries',
      location: 'Chicago, IL',
      jobType: 'Full-time',
      experienceLevel: 'Mid-level',
      featured: true,
    },
    {
      title: 'Frontend Developer',
      description: 'We are seeking a Frontend Developer to build intuitive and responsive user interfaces for our web applications. The ideal candidate should have experience in HTML, CSS, and JavaScript.',
      company: 'Stark Industries',
      location: 'Boston, MA',
      jobType: 'Contract',
      experienceLevel: 'Senior-level',
      featured: false,
    },
    {
      title: 'Product Manager',
      description: 'We are looking for a Product Manager to drive the development and success of our products. The ideal candidate should have experience in product strategy, roadmap planning, and cross-functional collaboration.',
      company: 'Wayne Enterprises',
      location: 'Gotham City',
      jobType: 'Full-time',
      experienceLevel: 'Mid-level',
      featured: true,
    },
    {
      title: 'Sales Representative',
      description: 'We are seeking a motivated Sales Representative to help us grow our customer base. The ideal candidate should have excellent communication skills and experience in B2B sales.',
      company: 'Umbrella Corporation',
      location: 'Seattle, WA',
      jobType: 'Full-time',
      experienceLevel: 'Entry-level',
      featured: false,
    },
    {
      title: 'DevOps Engineer',
      description: 'We are looking for a DevOps Engineer to streamline our development and deployment processes. The ideal candidate should have experience in cloud infrastructure, automation, and continuous integration/delivery.',
      company: 'Cyberdyne Systems',
      location: 'Austin, TX',
      jobType: 'Full-time',
      experienceLevel: 'Senior-level',
      featured: true,
    },
    {
      title: 'Content Writer',
      description: 'We are seeking a creative Content Writer to produce engaging and informative content for our website and marketing materials. The ideal candidate should have excellent writing skills and experience in SEO copywriting.',
      company: 'Aperture Science',
      location: 'Portland, OR',
      jobType: 'Part-time',
      experienceLevel: 'Mid-level',
      featured: false,
    },
    {
      title: 'HR Manager',
      description: 'We are looking for an experienced HR Manager to oversee our human resources operations. The ideal candidate should have a strong understanding of employment laws, employee relations, and talent acquisition.',
      company: 'Weyland-Yutani Corporation',
      location: 'Houston, TX',
      jobType: 'Full-time',
      experienceLevel: 'Senior-level',
      featured: true,
    },
  ];

  const users = [
    {
      email: 'john.doe@example.com',
      password: 'password123',
      name: 'John Doe',
    },
    {
      email: 'jane.smith@example.com',
      password: 'qwerty456',
      name: 'Jane Smith',
    },
    {
      email: 'michael.johnson@example.com',
      password: 'abcdefg',
      name: 'Michael Johnson',
    },
    {
      email: 'emily.davis@example.com',
      password: 'p@ssw0rd',
      name: 'Emily Davis',
    },
    {
      email: 'david.wilson@example.com',
      password: 'letmein',
      name: 'David Wilson',
    },
    {
      email: 'sarah.brown@example.com',
      password: 'secret123',
      name: 'Sarah Brown',
    },
    {
      email: 'robert.taylor@example.com',
      password: 'ilovecats',
      name: 'Robert Taylor',
    },
    {
      email: 'olivia.anderson@example.com',
      password: 'sunshine',
      name: 'Olivia Anderson',
    },
    {
      email: 'daniel.thomas@example.com',
      password: 'football',
      name: 'Daniel Thomas',
    },
    {
      email: 'sophia.jackson@example.com',
      password: 'musiclover',
      name: 'Sophia Jackson',
    },
  ];

  for (const jobListingData of jobListings) {
    const jobListing = await prisma.jobListing.create({
      data: jobListingData,
    });

    for (let i = 0; i < 3; i++) {
      const userData = users[Math.floor(Math.random() * users.length)];
      if(!userData) throw new Error('User data not found');

      let user = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: userData,
        });
      }

      await prisma.application.create({
        data: {
          userId: user.id,
          jobListingId: jobListing.id,
          status: Math.random() < 0.5 ? 'PENDING' : 'REVIEWED',
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });