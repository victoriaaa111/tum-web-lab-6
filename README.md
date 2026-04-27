# Workout Journal

A mobile-first web app for logging and managing gym workouts. Built with React, Vite, and Tailwind CSS. All data is stored locally in the browser.

---

## Features

- **Create workouts** - add a title, muscle group tags, and a list of exercises with sets and reps
- **Edit workouts** - update any workout after it's been saved
- **Delete workouts** - remove a workout with a single tap
- **Favorite workouts** - mark workouts you return to often
- **Filter by muscle group** - select one or more tags to narrow the list; filters stack
- **Favorites filter** - show only favorited workouts, combinable with tag filters
- **Track a session** - start any workout, tick off exercises as you go, then finish to save it
- **Session history** - view all past sessions with date, duration, muscle groups, and exercise results
- **Filter history** - narrow past sessions by muscle group tag
- **Export** - download workouts or session history as separate `.json` files
- **Import** - load workouts or session history from a `.json` file; type is auto-detected
- **Light / Dark theme** - toggle between a light mode and a dark mode; preference is saved to localStorage

---

## User Flows

### Adding a workout
1. Tap the **+** button (bottom-right of the card)
2. Enter a title and select muscle group tags
3. Add exercises: each row has a name, sets, and reps
4. Tap **Save**

### Editing a workout
1. Tap the **pencil icon** on any workout card
2. Modify title, tags, or exercises
3. Tap **Save**

### Filtering workouts
- Tap one or more **muscle group chips** at the top of the list to filter by tag
- Tap **Favorites** to show only favorited workouts
- Filters combine: selecting Favorites + Chest shows only favorited Chest workouts
- Tap an active chip again to deselect it

### Tracking a session
1. Tap **Start workout** on any workout card
2. Tick off exercises as you complete them
3. Tap **Finish Workout** — the session is saved and you are taken to the History tab

### Viewing session history
- Switch to the **History** tab to see all past sessions
- Each card shows the workout name, date, start/end time, total duration, muscle groups, and whether you did the exercises or not
- Completed exercises are shown with a strikethrough
- Tap the **trash icon** on a session card to delete it
- Use the **filter chips** at the top to filter sessions by muscle group

### Exporting data
1. Tap the **download icon** in the header
2. Choose **Workouts** or **History** from the dropdown
3. The corresponding `.json` file is saved to your device

### Importing data
1. Tap the **upload icon** in the header
2. Review the expected formats shown in the popover
3. Tap **Choose file** and select a `.json` file
4. The file type is auto-detected: arrays with `finishedAt` are treated as history, everything else as workouts
5. Entries are merged with existing data;

---

## Import Formats

### Workouts

```json
[
  {
    "title": "Push Day",
    "tags": ["Chest", "Arms"],
    "favorite": false,
    "exercises": [
      { "name": "Bench Press", "sets": 4, "reps": 10 },
      { "name": "Tricep Dips", "sets": 3, "reps": 12 }
    ]
  }
]
```

### History

```json
[
  {
    "workoutTitle": "Push Day",
    "tags": ["Chest"],
    "startedAt": "2025-01-10T09:00:00Z",
    "finishedAt": "2025-01-10T09:45:00Z",
    "exercises": [
      { "name": "Bench Press", "sets": 4, "reps": 10, "completed": true },
      { "name": "Tricep Dips", "sets": 3, "reps": 12, "completed": false }
    ]
  }
]
```

---

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Framer Motion for animations
- Lucide React for icons
- localStorage (no backend)
