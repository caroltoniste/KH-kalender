---
trigger: always_on
---

# 🐱 Kitten Calendar Next.js - Development Rules

## 1. Code Style & Conventions

### TypeScript
- ✅ **Always use TypeScript** - No `any` types unless absolutely necessary
- ✅ **Strict mode enabled** - `"strict": true` in tsconfig.json
- ✅ **Define interfaces** for all data structures
- ✅ **Use type inference** where obvious
- ✅ **Export types** from `types/index.ts` for shared use
- ❌ **Never use `// @ts-ignore`** - Fix the type issue instead

### Naming Conventions
```typescript
// Components: PascalCase
CalendarView, PostForm, PostEditor

// Files: kebab-case
calendar-view.tsx, post-form.tsx, use-posts.ts

// Functions: camelCase
handleSubmit, formatDate, fetchPosts

// Constants: SCREAMING_SNAKE_CASE
WEEKDAYS_ET, POST_TYPES, SESSION_DURATION

// Types/Interfaces: PascalCase
Post, CalendarState, AuthUser

// Props interfaces: ComponentNameProps
PostFormProps, CalendarDayProps
```

### File Organization
```
Each component file should contain:
1. Imports (grouped: React, third-party, local)
2. Types/Interfaces
3. Constants (if any)
4. Component definition
5. Helper functions (at bottom)
6. Export statement
```

## 2. Component Architecture

### Component Rules
- ✅ **Server Components by default** - Use `"use client"` only when needed
- ✅ **Client components for**: interactivity, hooks, browser APIs, real-time subscriptions
- ✅ **Small, focused components** - Single responsibility principle
- ✅ **Extract reusable logic** into custom hooks
- ✅ **Props destructuring** at component level
- ❌ **No logic in JSX** - Extract to variables or functions

### Component Structure
```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types";

interface PostFormProps {
  onSubmit: (post: Post) => void;
  initialDate?: Date;
}

export function PostForm({ onSubmit, initialDate }: PostFormProps) {
  // 1. Hooks (state, context, custom hooks)
  const [title, setTitle] = useState("");
  
  // 2. Derived state
  const isValid = title.length > 0;
  
  // 3. Event handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // logic
  };
  
  // 4. Effects (if any)
  // 5. Early returns
  
  // 6. Render
  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  );
}
```

## 3. State Management Rules

### Local State
- ✅ **Use `useState`** for simple component state
- ✅ **Use `useReducer`** for complex state with multiple actions
- ✅ **Lift state up** only when needed by multiple components
- ❌ **Don't prop drill** more than 2 levels - use Context instead

### Global State
- ✅ **React Context** for auth, theme, calendar state
- ✅ **Supabase real-time** for posts data
- ✅ **URL state** for shareable state (month/year)
- ❌ **No Redux/Zustand** - Keep it simple for this project

### Data Fetching
```typescript
// ✅ DO: Server Components for initial data
async function CalendarPage() {
  const posts = await getPosts();
  return <Calendar initialPosts={posts} />;
}

// ✅ DO: Client Components for real-time updates
"use client";
function Calendar({ initialPosts }) {
  const { posts } = usePosts(initialPosts); // Real-time hook
}
```

## 4. Supabase Rules

### Database Operations
- ✅ **Server-side queries** in Server Components and Route Handlers
- ✅ **Client-side subscriptions** for real-time updates only
- ✅ **Type-safe queries** using generated types
- ✅ **Error handling** on all database operations
- ✅ **Optimistic updates** for better UX
- ❌ **Never expose ANON_KEY** in comments or logs

### Query Patterns
```typescript
// ✅ DO: Specific queries
const { data } = await supabase
  .from("tasks")
  .select("id, title, datetime, type")
  .eq("team", "kittenhelp")
  .order("datetime");

// ❌ DON'T: Select all with no filters
const { data } = await supabase
  .from("tasks")
  .select("*");
```

### Real-time Subscriptions
- ✅ **Subscribe in `useEffect`** with cleanup
- ✅ **Filter by team** to avoid unnecessary updates
- ✅ **Unsubscribe** on unmount
- ✅ **Handle connection errors** gracefully

## 5. Styling Rules

### Tailwind CSS
- ✅ **Use Tailwind utilities** first
- ✅ **Custom classes** in `globals.css` for repeated patterns
- ✅ **CSS variables** for theme colors
- ✅ **Responsive utilities** (mobile-first)
- ✅ **Group related utilities** with blank lines
- ❌ **No inline styles** unless dynamic values

### Class Organization
```typescript
// ✅ DO: Organized and readable
<div className={cn(
  // Layout
  "flex items-center gap-4",
  // Spacing
  "p-4 mb-2",
  // Visual
  "bg-accent3 border-2 border-accent2 rounded-xl",
  // Interactive
  "hover:border-accent1 transition-all",
  // Conditional
  done && "opacity-50"
)} />

// ❌ DON'T: Long unorganized string
<div className="flex items-center gap-4 p-4 mb-2 bg-accent3 border-2 border-accent2 rounded-xl hover:border-accent1 transition-all" />
```

### Theme Consistency
```typescript
// ✅ DO: Use CSS variables
bg-[var(--accent1)]
text-[var(--ink)]

// ✅ DO: Use configured Tailwind colors
bg-accent1
text-ink
```

## 6. Form Handling Rules

### React Hook Form + Zod
- ✅ **Use React Hook Form** for all forms
- ✅ **Zod schemas** for validation
- ✅ **Type inference** from schema
- ✅ **Field-level errors** displayed clearly
- ✅ **Disable submit** during submission
- ✅ **Reset form** after successful submit

```typescript
// ✅ DO: Define schema first
const postSchema = z.object({
  title: z.string().min(1, "Pealkiri on kohustuslik"),
  type: z.enum(["donation", "video", "event", /*...*/]),
  datetime: z.string().datetime(),
});

type PostFormData = z.infer<typeof postSchema>;

// ✅ DO: Use in component
const { register, handleSubmit, formState: { errors } } = useForm<PostFormData>({
  resolver: zodResolver(postSchema),
});
```

## 7. Error Handling Rules

### Try-Catch Patterns
```typescript
// ✅ DO: Handle errors gracefully
try {
  const { data, error } = await supabase.from("tasks").insert(post);
  if (error) throw error;
  toast.success("Postitus lisatud!");
} catch (error) {
  console.error("Failed to create post:", error);
  toast.error("Viga postituse lisamisel");
}

// ❌ DON'T: Silent failures
const { data } = await supabase.from("tasks").insert(post);
```

### User Feedback
- ✅ **Toast notifications** for actions (success/error)
- ✅ **Loading states** for async operations
- ✅ **Error boundaries** for component crashes
- ✅ **Fallback UI** for failed data loads
- ✅ **Confirmation dialogs** for destructive actions

## 8. Performance Rules

### Optimization
- ✅ **`use client` sparingly** - Default to Server Components
- ✅ **Memoization** for expensive calculations (`useMemo`)
- ✅ **Callback memoization** for child props (`useCallback`)
- ✅ **Dynamic imports** for large components
- ✅ **Image optimization** with Next.js `<Image>`
- ❌ **Don't over-optimize** - Profile first

### Data Loading
```typescript
// ✅ DO: Streaming with Suspense
<Suspense fallback={<CalendarSkeleton />}>
  <Calendar />
</Suspense>

// ✅ DO: Parallel data fetching
const [posts, user] = await Promise.all([
  getPosts(),
  getUser(),
]);
```

## 9. Accessibility Rules (A11y)

### Semantic HTML
- ✅ **Proper heading hierarchy** (h1 → h2 → h3)
- ✅ **Button vs Link** - Button for actions, Link for navigation
- ✅ **Form labels** for all inputs
- ✅ **Alt text** for images
- ✅ **ARIA labels** when text isn't visible

### Keyboard Navigation
- ✅ **Tab order** logical and complete
- ✅ **Focus styles** visible and clear
- ✅ **Escape key** closes modals/popups
- ✅ **Enter/Space** triggers buttons
- ✅ **Arrow keys** for calendar navigation

### shadcn-ui Components
- ✅ All shadcn components are accessible by default
- ✅ **Don't remove** focus outlines
- ✅ **Test with keyboard** only

## 10. Security Rules

### Authentication
- ✅ **Server-side validation** for all protected routes
- ✅ **Middleware** for route protection
- ✅ **HTTP-only cookies** for session tokens
- ✅ **CSRF protection** enabled
- ❌ **Never trust client-side** auth checks alone

### Data Validation
```typescript
// ✅ DO: Validate on server
// app/api/posts/route.ts
export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) return new Response("Unauthorized", { status: 401 });
  
  const body = await request.json();
  const validated = postSchema.parse(body); // Throws if invalid
  
  // ... create post
}
```

### Environment Variables
- ✅ **NEXT_PUBLIC_** prefix for client-side vars only
- ✅ **Never commit** `.env.local`
- ✅ **Validate env vars** on startup
- ✅ **Different values** for dev/staging/prod

## 11. Testing Strategy

### Unit Tests (Optional but Recommended)
- ✅ **Test utilities** in `lib/`
- ✅ **Test custom hooks** with React Testing Library
- ✅ **Test validation schemas** with sample data
- ❌ **Don't test** third-party libraries

### Manual Testing Checklist
- [ ] All forms validate correctly
- [ ] Error states display properly
- [ ] Loading states work
- [ ] Real-time updates sync
- [ ] Calendar month transitions
- [ ] Mobile responsive layout
- [ ] Keyboard navigation
- [ ] Auth flow (login/logout)
- [ ] Session expiration

## 12. Git Workflow Rules

### Commit Messages
```bash
# ✅ DO: Conventional commits
feat: add post inline editor
fix: calendar week calculation for Estonian locale
style: update button hover states
refactor: extract calendar date logic to hook
docs: update setup instructions

# ❌ DON'T: Vague messages
update stuff
fixes
wip
```

### Branch Strategy
```bash
main          # Production-ready code
develop       # Development branch
feature/...   # Feature branches
fix/...       # Bug fix branches
```

### PR Guidelines
- ✅ **Small, focused PRs** (< 400 lines)
- ✅ **Descriptive title** and description
- ✅ **Link to issue/task** if applicable
- ✅ **Test before pushing**
- ✅ **Self-review** before requesting review

## 13. Documentation Rules

### Code Comments
```typescript
// ✅ DO: Explain WHY, not WHAT
// Estonian week starts on Monday, so we adjust getDay() which returns Sunday as 0
const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;

// ❌ DON'T: State the obvious
// Set the day index
const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
```

### Function Documentation
```typescript
/**
 * Calculates week number based on Estonian ISO 8601 standard (Monday start)
 * @param date - The date to get week number for
 * @returns Week number (1-53) and year
 */
export function getWeekNumber(date: Date): { week: number; year: number } {
  // ...
}
```

### README Updates
- ✅ **Keep README current** with setup steps
- ✅ **Environment variables** documented
- ✅ **Deployment steps** included
- ✅ **Troubleshooting** section

## 14. Deployment Rules

### Pre-Deployment Checklist
- [ ] All TypeScript errors resolved
- [ ] No console.errors in production
- [ ] Environment variables configured in Vercel
- [ ] Build succeeds locally (`npm run build`)
- [ ] Database migrations applied
- [ ] RLS policies tested
- [ ] Test in production-like environment

### Vercel Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### Environment Variables (Vercel)
```bash
# Required for production
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
TEAM_PASSWORD=your-secure-password
```

## 15. Estonian Localization Rules

### Language
- ✅ **All UI text in Estonian**
- ✅ **Consistent terminology** (use existing terms)
- ✅ **Estonian date formats**: DD.MM.YYYY
- ✅ **Estonian day/month names**: Esmaspäev, Jaanuar
- ✅ **Time format**: 24-hour (HH:mm)

### Common Terms
```typescript
const TERMS = {
  add: "Lisa",
  edit: "Muuda", 
  delete: "Kustuta",
  save: "Salvesta",
  cancel: "Tühista",
  done: "Tehtud",
  owner: "Vastutaja",
  post: "Postitus",
  calendar: "Kalender",
  notes: "Märkmed",
};
```