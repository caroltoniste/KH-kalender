"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostSchemaType } from "@/lib/validations/post-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  POST_TYPES_ET,
  TIME_OPTIONS,
  CHANNEL_NAMES,
  CHANNEL_ICONS,
} from "@/lib/constants";
import { format, parseISO } from "date-fns";
import type { Post, Channel } from "@/types";

interface PostEditorProps {
  post: Post;
  onSave: (data: Partial<Post>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCancel: () => void;
}

export default function PostEditor({
  post,
  onSave,
  onDelete,
  onCancel,
}: PostEditorProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  const postDate = parseISO(post.datetime);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      type: post.type,
      datetime: format(postDate, "yyyy-MM-dd"),
      time: post.time || format(postDate, "HH:mm"),
      owner: post.owner || "",
      channels: post.channels,
      notes: post.notes || "",
      copy: post.copy || "",
      materials: post.materials || "",
    },
  });

  const selectedChannels = watch("channels") || [];
  const selectedType = watch("type");

  const toggleChannel = (channel: Channel) => {
    const updated = selectedChannels.includes(channel)
      ? selectedChannels.filter((c) => c !== channel)
      : [...selectedChannels, channel];
    setValue("channels", updated, { shouldDirty: true });
  };

  const handleSave = async (data: PostSchemaType) => {
    setSaving(true);
    try {
      const datetime = `${data.datetime}T${data.time}:00`;
      await onSave({
        ...data,
        datetime,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(post.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
        <h4 className="font-heading text-lg font-semibold">Muuda postitust</h4>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-datetime">Kuupäev</Label>
            <Input id="edit-datetime" type="date" {...register("datetime")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-time">Kellaaeg</Label>
            <Select
              value={watch("time")}
              onValueChange={(value) => setValue("time", value, { shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="edit-type">Postituse tüüp</Label>
          <Select
            value={selectedType}
            onValueChange={(value) =>
              setValue("type", value as any, { shouldDirty: true })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(POST_TYPES_ET).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="edit-title">Pealkiri *</Label>
          <Input id="edit-title" {...register("title")} />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Owner */}
        <div className="space-y-2">
          <Label htmlFor="edit-owner">Vastutaja</Label>
          <Input id="edit-owner" {...register("owner")} />
        </div>

        {/* Channels */}
        <div className="space-y-2">
          <Label>Kanalid *</Label>
          <div className="flex gap-3">
            {(["tiktok", "facebook", "instagram"] as Channel[]).map((channel) => (
              <label
                key={channel}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={selectedChannels.includes(channel)}
                  onCheckedChange={() => toggleChannel(channel)}
                />
                <span className="text-sm">
                  {CHANNEL_ICONS[channel]} {CHANNEL_NAMES[channel]}
                </span>
              </label>
            ))}
          </div>
          {errors.channels && (
            <p className="text-xs text-destructive">{errors.channels.message}</p>
          )}
        </div>

        {/* Copy */}
        <div className="space-y-2">
          <Label htmlFor="edit-copy">Postituse tekst</Label>
          <Textarea id="edit-copy" {...register("copy")} rows={3} />
        </div>

        {/* Materials */}
        <div className="space-y-2">
          <Label htmlFor="edit-materials">Materjalid (lingid)</Label>
          <Textarea id="edit-materials" {...register("materials")} rows={2} />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="edit-notes">Märkused</Label>
          <Textarea id="edit-notes" {...register("notes")} rows={2} />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button type="submit" disabled={!isDirty || saving}>
            {saving ? "Salvestan..." : "Salvesta"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Tühista
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="ml-auto"
          >
            Kustuta
          </Button>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kustuta postitus?</DialogTitle>
            <DialogDescription>
              Kas oled kindel, et soovid kustutada postituse "{post.title}"? Seda
              toimingut ei saa tagasi võtta.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Tühista
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Kustuta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
