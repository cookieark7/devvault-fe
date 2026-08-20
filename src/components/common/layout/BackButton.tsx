"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/common/ui/Button";

interface BackButtonProps {
  href: string;
  label?: string;
}

export default function BackButton({
  href,
  label = "Back",
}: BackButtonProps) {
  return (
    <Link href={href}>
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />}>
        {label}
      </Button>
    </Link>
  );
}
