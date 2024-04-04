import Head from "next/head";
import Link from "next/link";
import { FeaturedJobs } from "~/components/component/featured-jobs";

import { Button } from "~/components/ui/button";

import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <FeaturedJobs />
    </>
  );
}
