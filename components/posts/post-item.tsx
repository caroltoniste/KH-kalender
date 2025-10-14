"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { POST_TYPE_EMOJIS, CHANNEL_ICONS } from "@/lib/constants";
import { formatEstonianDateTime, getWeekdayName } from "@/lib/date-utils";
import { parseISO } from "date-fns";
import type { Post } from "@/types";
import { cn } from "@/lib/utils";
import PostEditor from "./post-editor";

interface PostItemProps {
  post: Post;
  onUpdate: (id: string, data: Partial<Post>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function PostItem({ post, onUpdate, onDelete }: PostItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const postDate = parseISO(post.datetime);

  const handleToggleDone = async () => {
    await onUpdate(post.id, { done: !post.done });
  };

  const handleUpdate = async (data: Partial<Post>) => {
    await onUpdate(post.id, data);
    setIsEditing(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsEditing(!isEditing)}
        className={cn("post-item w-full text-left", post.done && "done")}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox checked={post.done} onCheckedChange={handleToggleDone} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1">
              <span className="text-xl">{POST_TYPE_EMOJIS[post.type]}</span>
              <div className="flex-1">
                <h4 className="font-semibold">{post.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatEstonianDateTime(postDate)} •{" "}
                  {getWeekdayName(postDate)}
                </p>
              </div>
            </div>

            {/* Owner */}
            {post.owner && (
              <p className="text-sm text-muted-foreground mb-2">
                👤 {post.owner}
              </p>
            )}

            {/* Channels */}
            {post.channels.length > 0 && (
              <div className="flex gap-2 mb-2">
                {post.channels.map((channel) => (
                  <span key={channel} className={cn("channel-badge", channel)}>
                    {CHANNEL_ICONS[channel]}
                  </span>
                ))}
              </div>
            )}

            {/* Notes */}
            {post.notes && (
              <p className="text-sm text-muted-foreground italic">
                💭 {post.notes}
              </p>
            )}
          </div>
        </div>
      </button>

      {/* Inline Editor */}
      {isEditing && (
        <div className="mt-3 p-4 bg-accent3 rounded-lg border-2 border-accent2 slide-down">
          <PostEditor
            post={post}
            onSave={handleUpdate}
            onDelete={onDelete}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
}
