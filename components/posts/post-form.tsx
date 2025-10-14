"use client";

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
  POST_TYPES_ET,
  TIME_OPTIONS,
  DEFAULT_TIME,
  CHANNEL_NAMES,
  CHANNEL_ICONS,
} from "@/lib/constants";
import { format } from "date-fns";
import type { Channel } from "@/types";

interface PostFormProps {
  onSubmit: (data: PostSchemaType) => void;
  onCancel: () => void;
  initialDate?: Date;
}

export default function PostForm({
  onSubmit,
  onCancel,
  initialDate,
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      datetime: initialDate ? format(initialDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      time: DEFAULT_TIME,
      channels: [],
      type: "other",
    },
  });

  const selectedChannels = watch("channels") || [];
  const selectedType = watch("type");

  const toggleChannel = (channel: Channel) => {
    const updated = selectedChannels.includes(channel)
      ? selectedChannels.filter((c) => c !== channel)
      : [...selectedChannels, channel];
    setValue("channels", updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="font-heading text-xl font-semibold">Lisa uus postitus</h3>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="datetime">Kuupäev</Label>
          <Input id="datetime" type="date" {...register("datetime")} />
          {errors.datetime && (
            <p className="text-xs text-destructive">{errors.datetime.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Kellaaeg</Label>
          <Select
            value={watch("time")}
            onValueChange={(value) => setValue("time", value)}
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
        <Label htmlFor="type">Postituse tüüp</Label>
        <Select
          value={selectedType}
          onValueChange={(value) => setValue("type", value as any)}
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
        <Label htmlFor="title">Pealkiri *</Label>
        <Input id="title" {...register("title")} placeholder="Postituse pealkiri" />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Owner */}
      <div className="space-y-2">
        <Label htmlFor="owner">Vastutaja</Label>
        <Input id="owner" {...register("owner")} placeholder="Nimi" />
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
        <Label htmlFor="copy">Postituse tekst</Label>
        <Textarea
          id="copy"
          {...register("copy")}
          placeholder="Postituse sisu..."
          rows={3}
        />
      </div>

      {/* Materials */}
      <div className="space-y-2">
        <Label htmlFor="materials">Materjalid (lingid)</Label>
        <Textarea
          id="materials"
          {...register("materials")}
          placeholder="Lingid piltidele, videotele..."
          rows={2}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Märkused</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Täiendavad märkused..."
          rows={2}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Salvesta
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Tühista
        </Button>
      </div>
    </form>
  );
}
