"use client";

import { useState } from "react";
import Input from "@/components/common/ui/Input";
import Button from "@/components/common/ui/Button";
import TagSelector from "@/components/tags/TagSelector";
import { cn } from "@/lib/utils/cn";
import type { Prompt, PromptCreateInput, Tag } from "@/lib/types";

interface PromptFormProps {
  initialValues?: Partial<Prompt>;
  onSubmit: (data: PromptCreateInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const MODELS = [
  "gpt-4o",
  "gpt-4-turbo",
  "claude-3-5-sonnet",
  "claude-opus-4",
  "claude-sonnet-4",
  "gemini-1.5-pro",
  "gemini-flash",
  "qwen-2.5-72b",
  "llama-3.3",
  "any / model-agnostic",
  "Custom...",
];

export default function PromptForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
}: PromptFormProps) {
  const isCustomInitial =
    initialValues?.model && !MODELS.slice(0, -1).includes(initialValues.model);
  const [title, setTitle] = useState(initialValues?.title || "");
  const [model, setModel] = useState(
    isCustomInitial ? "Custom..." : initialValues?.model || "any / model-agnostic"
  );
  const [customModel, setCustomModel] = useState(
    isCustomInitial ? initialValues?.model || "" : ""
  );
  const [useCase, setUseCase] = useState(initialValues?.useCase || "");
  const [content, setContent] = useState(initialValues?.content || "");
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    initialValues?.tags || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedModel = model === "Custom..." ? customModel : model;
    await onSubmit({
      title,
      content,
      model: resolvedModel,
      useCase: useCase || undefined,
      tagIds: selectedTags.map((t) => t.id),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Title */}
      <Input
        label="Title"
        placeholder="What is this prompt for?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Model */}
      <div className="w-full">
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Model
        </label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className={cn(
            "w-full rounded border border-border-base bg-bg-subtle",
            "px-3 py-1.5 text-sm text-text-primary",
            "focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-accent/20",
            "transition-colors duration-100"
          )}
        >
          {MODELS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        {model === "Custom..." && (
          <Input
            placeholder="Enter model name..."
            value={customModel}
            onChange={(e) => setCustomModel(e.target.value)}
            required
            className="mt-2"
          />
        )}
      </div>

      {/* Use Case */}
      <Input
        label="Use Case"
        placeholder="e.g. Code review, Documentation, Brainstorming"
        value={useCase}
        onChange={(e) => setUseCase(e.target.value)}
      />

      {/* Prompt Content */}
      <div className="w-full">
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Prompt Content
        </label>
        <div className="bg-bg-subtle border border-border-base rounded overflow-hidden">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            required
            placeholder="Write your prompt here..."
            className={cn(
              "w-full bg-transparent resize-none p-4",
              "text-sm text-text-primary leading-relaxed",
              "placeholder:text-text-tertiary",
              "focus:outline-none",
              "min-h-[400px]"
            )}
          />
          <div className="px-4 pb-2 text-right">
            <span className="text-xs text-text-tertiary">
              {content.length.toLocaleString()} chars
            </span>
          </div>
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
          Save prompt
        </Button>
      </div>
    </form>
  );
}
