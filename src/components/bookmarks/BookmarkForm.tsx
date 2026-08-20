"use client";

import { useState } from "react";
import Input from "@/components/common/ui/Input";
import Textarea from "@/components/common/ui/Textarea";
import Button from "@/components/common/ui/Button";
import TagSelector from "@/components/tags/TagSelector";
import type { Bookmark, BookmarkCreateInput, Tag } from "@/lib/types";

interface BookmarkFormProps {
  initialValues?: Partial<Bookmark>;
  onSubmit: (data: BookmarkCreateInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function BookmarkForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
}: BookmarkFormProps) {
  const [url, setUrl] = useState(initialValues?.url || "");
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    initialValues?.tags || []
  );

  const handleUrlBlur = () => {
    if (url && !title) {
      try {
        const hostname = new URL(url).hostname;
        setTitle(hostname);
      } catch {
        // ignore invalid URLs
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      url,
      title,
      description: description || undefined,
      tagIds: selectedTags.map((t) => t.id),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="URL"
        type="url"
        placeholder="https://..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onBlur={handleUrlBlur}
        required
      />
      <Input
        label="Title"
        placeholder="What is this link?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        label="Description"
        placeholder="Why is this worth saving? (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
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
      <div className="mt-6 flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Save bookmark
        </Button>
      </div>
    </form>
  );
}
