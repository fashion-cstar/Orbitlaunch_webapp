# app.orbitlaunch.io decentralized application - frontend

Orbitlaunch.io dapp contains different products:
- Dashboard: allow user to get an updated status on kpi related to $M31, launchpad, fund, analytics, exchange and twitter latest news
- OrbitPad: tbd
- OrbitAnalytics: tbd
- OrbitFund: tbd
- OrbitExchange: tbd

## technical stack

- Frontend use: Next.js (react based framework), TailwindCSS, MUI material, Axios, Web3 libraries
- Deployment for development purpose used Vercel: https://vercel.com/teams/orbitdev
- Production deployment is based on AWS EC2

## start locally

- use node > v12.22
- npm i
- npm run dev

## practices and misc info

- start new branch for each development purpose, think small and tiny change easy to review and integrate quickly
- every components are available under src/components, we have a common layout which include header and sidebar
- routing is already managed by next.js and the folder configuration has been done for each products

#### More informations related to Next.js and Tailwind

This example shows how to use [Tailwind CSS](https://tailwindcss.com/) [(v3.0)](https://tailwindcss.com/blog/tailwindcss-v3) with Next.js. It follows the steps outlined in the official [Tailwind docs](https://tailwindcss.com/docs/guides/nextjs).

Preview the example live on [StackBlitz](http://stackblitz.com/):
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-tailwindcss)

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss&project-name=with-tailwindcss&repository-name=with-tailwindcss)
