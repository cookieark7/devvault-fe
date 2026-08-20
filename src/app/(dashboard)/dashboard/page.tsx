"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Bookmark,
  Terminal,
  Sparkles,
  Clock,
  Plus,
} from "lucide-react";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import Button from "@/components/common/ui/Button";
import EmptyState from "@/components/common/ui/EmptyState";
import { ROUTES } from "@/lib/constants/routes";
import { snippetsService, bookmarksService, commandsService, promptsService } from "@/lib/api";

const STATS_CONFIG = [
  {
    id: "snippets",
    label: "Snippets",
    icon: Code2,
    color: "var(--snippet)",
    route: ROUTES.snippets,
  },
  {
    id: "bookmarks",
    label: "Bookmarks",
    icon: Bookmark,
    color: "var(--bookmark)",
    route: ROUTES.bookmarks,
  },
  {
    id: "commands",
    label: "Commands",
    icon: Terminal,
    color: "var(--command)",
    route: ROUTES.commands,
  },
  {
    id: "prompts",
    label: "Prompts",
    icon: Sparkles,
    color: "var(--prompt)",
    route: ROUTES.prompts,
  },
];

const quickActions = [
  { label: "+ Snippet", icon: Code2, route: ROUTES.snippetNew },
  { label: "+ Bookmark", icon: Bookmark, route: ROUTES.bookmarkNew },
  { label: "+ Command", icon: Terminal, route: ROUTES.commandNew },
  { label: "+ Prompt", icon: Sparkles, route: ROUTES.promptNew },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.25,
      ease: "easeOut" as const,
    },
  }),
};

export default function DashboardPage() {
  const router = useRouter();
  
  const [counts, setCounts] = useState({
    snippets: 0,
    bookmarks: 0,
    commands: 0,
    prompts: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [sRes, bRes, cmdRes, pRes] = await Promise.all([
           snippetsService.list({ limit: 1 }),
           bookmarksService.list({ limit: 1 }),
           commandsService.list({ limit: 1 }),
           promptsService.list({ limit: 1 })
        ]);
        
        setCounts({
          snippets: sRes?.total || 0,
          bookmarks: bRes?.total || 0,
          commands: cmdRes?.total || 0,
          prompts: pRes?.total || 0,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    }

    fetchStats();
  }, []);

  return (
    <>
      <TopBar
        title="Home"
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => router.push(ROUTES.snippetNew)}
          >
            New
          </Button>
        }
      />
      <PageWrapper>
        {/* Section 1 — Greeting */}
        <motion.div
          custom={0}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-text-primary">
            Your Developer Vault
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Everything you know, organized.
          </p>
        </motion.div>

        {/* Section 2 — Stats Row */}
        <motion.div
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          {STATS_CONFIG.map((stat) => {
            const Icon = stat.icon;
            const countValue = counts[stat.id as keyof typeof counts];
            return (
              <div
                key={stat.id}
                onClick={() => router.push(stat.route)}
                className="bg-bg-main border border-border-base rounded p-4 hover:shadow-notion-card transition-all duration-100 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${stat.color} 10%, transparent)`,
                    }}
                  >
                    <Icon size={18} style={{ color: stat.color }} />
                  </div>
                  <span className="text-2xl font-semibold text-text-primary">
                    {countValue}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mt-2">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Section 3 — Quick Actions */}
        <motion.div
          custom={2}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h3 className="text-sm font-medium text-text-secondary mb-3">
            Add something new
          </h3>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="secondary"
                  size="sm"
                  leftIcon={<Icon size={14} />}
                  onClick={() => router.push(action.route)}
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Section 4 — Recent Items */}
        <motion.div
          custom={3}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mt-8 mb-3">
            <h3 className="text-sm font-medium text-text-primary">Recent</h3>
            <span className="text-xs text-accent cursor-pointer hover:underline">
              View all
            </span>
          </div>

          <EmptyState
            icon={<Clock size={20} />}
            title="Nothing here yet"
            description="Items you create will appear here"
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(ROUTES.snippetNew)}
              >
                Add your first snippet
              </Button>
            }
          />
        </motion.div>
      </PageWrapper>
    </>
  );
}
