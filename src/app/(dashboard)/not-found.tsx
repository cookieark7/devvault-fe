"use client";

import Link from "next/link";
import PageWrapper from "@/components/common/layout/PageWrapper";
import Button from "@/components/common/ui/Button";
import { ROUTES } from "@/lib/constants/routes";

export default function NotFound() {
  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-[60vh]">
      <span className="text-[120px] font-semibold leading-none text-border-base select-none">
        404
      </span>
      <p className="text-xl text-text-secondary mt-4">
        This page doesn&apos;t exist
      </p>
      <Link href={ROUTES.home} className="mt-6">
        <Button variant="primary">Go home</Button>
      </Link>
    </PageWrapper>
  );
}
