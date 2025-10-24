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
      <h3 className="font-heading text-xl font-semibold mb-4">Lisa postitus valitud kuupäevale</h3>

      {/* Row 1: Date, Time, Type */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="datetime" className="text-sm font-semibold">Kuupäev</Label>
          <Input id="datetime" type="date" {...register("datetime")} className="h-11" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="time" className="text-sm font-semibold">Kellaaeg</Label>
          <Select
            value={watch("time")}
            onValueChange={(value) => setValue("time", value)}
          >
            <SelectTrigger className="h-11">
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
        <div className="space-y-1">
          <Label htmlFor="type" className="text-sm font-semibold">Tüüp</Label>
          <Select
            value={selectedType}
            onValueChange={(value) => setValue("type", value as any)}
          >
            <SelectTrigger className="h-11">
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
      </div>

      {/* Row 2: Title and Owner */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="title" className="text-sm font-semibold">Pealkiri</Label>
          <Input id="title" {...register("title")} placeholder="Näiteks: Gorilla neuroloogi update" className="h-11" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="owner" className="text-sm font-semibold">Vastutaja</Label>
          <Input id="owner" {...register("owner")} placeholder="Kes teeb" className="h-11" />
        </div>
      </div>

      {/* Row 3: Channels */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Kanalid</Label>
        <div className="flex gap-3">
          {(["tiktok", "facebook", "instagram"] as Channel[]).map((channel) => (
            <label
              key={channel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-pink-200 bg-white cursor-pointer hover:border-pink-300 transition-colors"
            >
              <Checkbox
                checked={selectedChannels.includes(channel)}
                onCheckedChange={() => toggleChannel(channel)}
              />
              <span className="text-base font-medium flex items-center gap-1.5">
                {channel === 'tiktok' && '▶️'}
                {channel === 'facebook' && '📘'}
                {channel === 'instagram' && '📷'}
                {CHANNEL_NAMES[channel]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Row 4: Notes (full width) */}
      <div className="space-y-1">
        <Label htmlFor="notes" className="text-sm font-semibold">Märkmed</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="CTA, visuaalid, lingid"
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Row 5: Copy and Materials */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="copy" className="text-sm font-semibold">Copy tekst</Label>
          <Textarea
            id="copy"
            {...register("copy")}
            placeholder="Postituse tekst, hashtagid, CTA"
            rows={3}
            className="resize-none"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="materials" className="text-sm font-semibold">Materjalid</Label>
          <Textarea
            id="materials"
            {...register("materials")}
            placeholder="Video/pildi lingid, visuaalid"
            rows={3}
            className="resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button 
          type="submit" 
          className="flex-1 h-12 text-white font-medium rounded-full" 
          style={{ backgroundColor: '#ffb3d1' }}
        >
          Lisa postitus
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="h-12 px-8 rounded-full"
        >
          Tühista
        </Button>
      </div>
    </form>
  );
}
