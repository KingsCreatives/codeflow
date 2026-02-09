import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const TOTAL_USERS = 50;
const TOTAL_QUESTIONS = 200;
const TOTAL_ANSWERS = 400;

const REAL_CLERK_IDS = [
  'user_36ZpxYRfl0toaH5kThuPIfOl8yO',
  'user_36OdMjJtowQDIXhZz46K66zznFV',
];

const TAGS_LIST = [
  'react',
  'next.js',
  'typescript',
  'javascript',
  'node.js',
  'python',
  'django',
  'flask',
  'css',
  'tailwindcss',
  'mongodb',
  'postgresql',
  'docker',
  'kubernetes',
  'aws',
  'git',
  'ci-cd',
  'redux',
  'zustand',
  'graphql',
  'prisma',
  'angular',
  'vue',
  'svelte',
  'rust',
  'go',
  'java',
  'spring-boot',
  'c#',
  '.net',
];

async function main() {
  console.log('🌱 Starting "Connection-Safe" Seed...');

  const deleteOrder = ['Interaction', 'Tag', 'Answer', 'Question', 'User'];

  for (const model of deleteOrder) {
    // @ts-ignore
    await prisma[model.toLowerCase()].deleteMany();
    console.log(`Cleared ${model}s`);
  }

  console.log(
    `Generating users (Including ${REAL_CLERK_IDS.length} real admins)...`,
  );

  const realUsersData = REAL_CLERK_IDS.map((clerkId, index) => ({
    clerkId,
    name: index === 0 ? 'Admin User 1' : 'Admin User 2',
    username: index === 0 ? 'admin_one' : 'admin_two',
    email: `admin${index + 1}@example.com`,
    password: 'password123',
    bio: 'I am a real system administrator and developer.',
    picture: faker.image.avatar(),
    location: 'Accra, Ghana',
    reputation: 1000,
    joinedAt: new Date(),
  }));

  const remainingUsers = TOTAL_USERS - REAL_CLERK_IDS.length;
  const fakeUsersData = Array.from({ length: remainingUsers }).map((_, i) => ({
    clerkId: `user_${faker.string.uuid()}`,
    name: faker.person.fullName(),
    username: faker.internet.username() + i,
    email: faker.internet.email(),
    password: 'password123',
    bio: faker.person.bio(),
    picture: faker.image.avatar(),
    location: faker.location.city() + ', ' + faker.location.country(),
    reputation: faker.number.int({ min: 0, max: 1000 }),
    joinedAt: faker.date.past({ years: 5 }),
  }));

  const allUsersData = [...realUsersData, ...fakeUsersData];
  await prisma.user.createMany({ data: allUsersData });

  const allUsers = await prisma.user.findMany({ select: { id: true } });
  console.log(`✅ Created ${allUsers.length} users`);

  console.log('Generating Tags...');
  for (const name of TAGS_LIST) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  const allTags = await prisma.tag.findMany({ select: { id: true } });

  console.log(`Generating ${TOTAL_QUESTIONS} questions (Sequentially)...`);
  const allQuestions = [];

  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const createdAt = faker.date.between({
      from: '2022-01-01',
      to: new Date(),
    });

    const author = allUsers[Math.floor(Math.random() * allUsers.length)];
    const tech = TAGS_LIST[Math.floor(Math.random() * TAGS_LIST.length)];
    const title = `How to ${faker.hacker.verb()} ${faker.hacker.noun()} in ${tech}?`;

    const shuffledTags = allTags.sort(() => 0.5 - Math.random());
    const selectedTags = shuffledTags.slice(
      0,
      faker.number.int({ min: 1, max: 3 }),
    );

    const question = await prisma.question.create({
      data: {
        title,
        content: generateMarkdownContent(tech),
        views: faker.number.int({ min: 10, max: 50000 }),
        createdAt,
        authorId: author.id,
        tags: {
          connect: selectedTags.map((t) => ({ id: t.id })),
        },
      },
    });

    allQuestions.push(question);
    if (i % 10 === 0) process.stdout.write('.');
  }
  console.log(`\n✅ Created ${allQuestions.length} questions`);

  console.log(`Generating ${TOTAL_ANSWERS} answers...`);
  const answersToCreate = [];

  for (let i = 0; i < TOTAL_ANSWERS; i++) {
    const question =
      allQuestions[Math.floor(Math.random() * allQuestions.length)];
    const author = allUsers[Math.floor(Math.random() * allUsers.length)];

    answersToCreate.push({
      content: `Here is a solution using **${faker.hacker.noun()}**:\n\n\`\`\`javascript\nconsole.log("Fixed!");\n\`\`\`\n\nHope this helps!`,
      views: faker.number.int({ min: 0, max: 5000 }),
      createdAt: faker.date.between({
        from: question.createdAt,
        to: new Date(),
      }),
      questionId: question.id,
      authorId: author.id,
    });
  }

  await prisma.answer.createMany({ data: answersToCreate });
  const allAnswers = await prisma.answer.findMany({ select: { id: true } });
  console.log(`✅ Created ${allAnswers.length} answers`);

  console.log('Simulating Votes...');

  for (const q of allQuestions) {
    if (Math.random() > 0.7) {
      const voters = allUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, faker.number.int({ min: 1, max: 20 }));
      await prisma.question.update({
        where: { id: q.id },
        data: {
          upvotes: { connect: voters.map((u) => ({ id: u.id })) },
        },
      });
    }
  }

  for (const a of allAnswers) {
    if (Math.random() > 0.7) {
      const voters = allUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, faker.number.int({ min: 1, max: 20 }));
      await prisma.answer.update({
        where: { id: a.id },
        data: {
          upvotes: { connect: voters.map((u) => ({ id: u.id })) },
        },
      });
    }
  }

  console.log('🎉 Seed Completed Successfully!');
}

function generateMarkdownContent(tech: string) {
  return `
I am having trouble with **${tech}**. I tried to implement a custom hook but it fails.

### My Code
\`\`\`javascript
const [state, setState] = useState(null);

useEffect(() => {
  // fetching data
  console.log("Bug here?");
}, []);
\`\`\`

**Error Log:**
> Uncaught Error: Invalid hook call. Hooks can only be called inside of the body of a function component.

Any ideas on how to fix this ${faker.hacker.adjective()} error?
    `;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
