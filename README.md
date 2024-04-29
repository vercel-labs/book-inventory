This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# book-inventory

TODO:

- Add instructions on how to get up and running, like running `seed`
- Replace `dotenv` with `@next/env`
- Move `prettier` to `devDependencies`
- Remove `public` assets if they're not used
- I know we can colocate files with App Router, but we usually move `lib` out. Should we also create a `components`?
- Run `prettier` over the codebase. It was added late and there's 18 files not passing the prettier check.
- Setup GitHub Actions to run `prettier:check` on PRs (reference `commerce`)
- Are we using `npm` or `pnpm` on this project? Looks like `npm` as I don't see a `pnpm` lockfile
