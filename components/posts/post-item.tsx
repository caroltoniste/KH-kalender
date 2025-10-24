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
        className={cn(
          "w-full text-left p-3 rounded-lg border border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50 transition-all",
          post.done && "opacity-50"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Emoji */}
          <span className="text-2xl flex-shrink-0">{POST_TYPE_EMOJIS[post.type]}</span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-600 mb-0.5">
              {formatEstonianDateTime(postDate)} ({getWeekdayName(postDate)}) {post.time} • Vastutab: <span className="font-medium">{post.owner || 'test'}</span> • <span className="font-medium">{post.title}</span>
            </div>
            
            {/* Channels */}
            {post.channels.length > 0 && (
              <div className="flex gap-1 mt-1">
                {post.channels.map((channel) => (
                  <span key={channel} className={cn("channel-badge text-xs px-1.5 py-0.5", channel)}>
                    {CHANNEL_ICONS[channel]}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Checkbox */}
          <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
            <Checkbox checked={post.done} onCheckedChange={handleToggleDone} />
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
