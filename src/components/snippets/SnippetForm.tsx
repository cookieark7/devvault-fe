"use client";

import { useState } from "react";
import Input from "@/components/common/ui/Input";
import Textarea from "@/components/common/ui/Textarea";
import Button from "@/components/common/ui/Button";
import TagSelector from "@/components/tags/TagSelector";
import LanguageBadge from "./LanguageBadge";
import { SUPPORTED_LANGUAGES } from "@/lib/constants/languages";
import { cn } from "@/lib/utils/cn";
import type { Snippet, SnippetCreateInput, Tag } from "@/lib/types";

interface SnippetFormProps {
  initialValues?: Partial<Snippet>;
  onSubmit: (data: SnippetCreateInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function SnippetForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
}: SnippetFormProps) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [language, setLanguage] = useState(
    initialValues?.language || "javascript"
  );
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [code, setCode] = useState(initialValues?.code || "");
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    initialValues?.tags || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      code,
      language,
      description: description || undefined,
      tagIds: selectedTags.map((t) => t.id),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Title */}
      <Input
        label="Title"
        placeholder="What is this snippet?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Language */}
      <div className="w-full">
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={cn(
            "w-full rounded border border-border-base bg-bg-subtle",
            "px-3 py-1.5 text-sm text-text-primary",
            "focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-accent/20",
            "transition-colors duration-100"
          )}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <Input
        label="Description"
        placeholder="Brief context (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Code */}
      <div className="w-full">
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Code
        </label>
        <div className="bg-bg-subtle border border-border-base rounded overflow-hidden">
          <div className="flex items-center px-3 py-2 border-b border-border-base">
            <LanguageBadge language={language} size="sm" />
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={12}
            required
            placeholder="Paste your code here..."
            className={cn(
              "w-full bg-transparent resize-none p-4",
              "font-mono text-sm text-text-primary leading-relaxed",
              "placeholder:text-text-tertiary",
              "focus:outline-none"
            )}
          />
        </div>
      </div>

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
          Save snippet
        </Button>
      </div>
    </form>
  );
}
