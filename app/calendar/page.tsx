import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CalendarView from "@/components/calendar/calendar-view";

export default async function CalendarPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("kitten-session");

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-paper">
      <CalendarView />
    </main>
  );
}
