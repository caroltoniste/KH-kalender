"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";
import { getMonthName } from "@/lib/date-utils";
import CalendarGrid from "./calendar-grid";
import PostList from "../posts/post-list";
import PostForm from "../posts/post-form";
import { usePosts } from "@/lib/hooks/use-posts";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { posts, loading, addPost, updatePost, deletePost } = usePosts(year, month);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleAddPost = async (postData: any) => {
    await addPost(postData);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img 
            src="/roosakitten.png" 
            alt="Kitten Help Logo" 
            className="w-12 h-12 object-contain logo-spin"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Kitten Help MTÜ turunduskalender
            </h1>
            <p className="text-sm text-muted-foreground">
              Linnuke kirja. Nurruke koju 😺
            </p>
          </div>
        </div>
        <LogoutButton />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Calendar + Add Post */}
        <div className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon" onClick={handlePrevMonth} className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl md:text-2xl font-semibold">
              {getMonthName(month)} {year}
            </h2>
            <Button variant="outline" size="icon" onClick={handleNextMonth} className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar */}
          <Card className="p-4 md:p-6">
            <CalendarGrid
              year={year}
              month={month}
              posts={posts}
              selectedDate={selectedDate}
              onDayClick={handleDayClick}
            />
          </Card>

          {/* Add Post Button or Form */}
          {showForm ? (
            <Card className="p-4 md:p-6 slide-down">
              <PostForm
                onSubmit={handleAddPost}
                onCancel={() => setShowForm(false)}
                initialDate={selectedDate || undefined}
              />
            </Card>
          ) : (
            <Button
              onClick={() => {
                setSelectedDate(null);
                setShowForm(true);
              }}
              className="w-full h-12 text-white font-medium rounded-full"
              style={{ backgroundColor: '#ffb3d1' }}
            >
              Lisa postitus
            </Button>
          )}
        </div>

        {/* Right Column: Post List */}
        <div className="space-y-4">
          <Card className="p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">Selle kuu postitused</h2>
            <PostList
              posts={posts}
              loading={loading}
              onUpdate={updatePost}
              onDelete={deletePost}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
