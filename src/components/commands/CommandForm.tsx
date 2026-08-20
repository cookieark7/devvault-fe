"use client";

import { useState } from "react";
import Input from "@/components/common/ui/Input";
import Textarea from "@/components/common/ui/Textarea";
import Button from "@/components/common/ui/Button";
import TagSelector from "@/components/tags/TagSelector";
import { cn } from "@/lib/utils/cn";
import type { Command, CommandCreateInput, Tag, Platform } from "@/lib/types";

interface CommandFormProps {
  initialValues?: Partial<Command>;
  onSubmit: (data: CommandCreateInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const PLATFORMS = [
  { value: "macos", label: "macOS" },
  { value: "linux", label: "Linux" },
  { value: "windows", label: "Windows" },
  { value: "cross-platform", label: "Cross-platform" },
];

export default function CommandForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
}: CommandFormProps) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [command, setCommand] = useState(initialValues?.command || "");
  const [platform, setPlatform] = useState<Platform>(
    initialValues?.platform || "cross-platform"
  );
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    initialValues?.tags || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      command,
      platform,
      description: description || undefined,
      tagIds: selectedTags.map((t) => t.id),
    });
  };

  const handleCommandKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;
      const newValue = command.slice(0, start) + "  " + command.slice(end);
      setCommand(newValue);
      // Set cursor position after tab
      requestAnimationFrame(() => {
        target.setSelectionRange(start + 2, start + 2);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Title */}
      <Input
        label="Title"
        placeholder="What does this command do?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Command string */}
      <div className="w-full">
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Command
        </label>
        <div className="flex items-center bg-bg-subtle border border-border-base rounded px-3 py-1.5 focus-within:border-border-focus focus-within:ring-2 focus-within:ring-accent/20 transition-all duration-100">
          <span className="text-text-tertiary font-mono text-sm select-none mr-1">
            $
          </span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleCommandKeyDown}
            placeholder="Enter command..."
            required
            className="font-mono text-sm text-text-primary bg-transparent border-none focus:outline-none flex-1 placeholder:text-text-tertiary"
          />
        </div>
      </div>

      {/* Platform */}
      <div className="w-full">
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Platform
        </label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as Platform)}
          className={cn(
            "w-full rounded border border-border-base bg-bg-subtle",
            "px-3 py-1.5 text-sm text-text-primary",
            "focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-accent/20",
            "transition-colors duration-100"
          )}
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <Textarea
        label="Description"
        placeholder="Any additional context (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Tags
        </label>
        <TagSelector
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          availableTags={[]}
        />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Save command
        </Button>
      </div>
    </form>
  );
}
