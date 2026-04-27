# Workout Journal

A mobile-first web app for logging and managing gym workouts. Built with React, Vite, and Tailwind CSS. All data is stored locally in the browser — no account or backend required.

---

## Features

- **Create workouts** - add a title, muscle group tags, and a list of exercises with sets and reps
- **Edit workouts** - update any workout after it's been saved
- **Delete workouts** - remove a workout with a single tap
- **Favorite workouts** - mark workouts you return to often
- **Filter by muscle group** - select one or more tags to narrow the list; filters stack
- **Favorites filter** - show only favorited workouts, combinable with tag filters
- **Export** - download all workouts as a `.json` file
- **Import** - load workouts from a `.json` file
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

### Filtering
- Tap one or more **muscle group chips** at the top of the list to filter by tag
- Tap **Favorites** to show only favorited workouts
- Filters combine: selecting Favorites + Chest shows only favorited Chest workouts
- Tap an active chip again to deselect it

### Exporting workouts
1. Tap the **download icon** in the header
2. A `.json` file containing all workouts is saved to your device

### Importing workouts
1. Tap the **upload icon** in the header
2. Review the expected JSON format shown in the popover
3. Tap **Choose file** and select a `.json` file
4. Workouts are merged, existing entries are not duplicated

---

## Expected Import Format

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

---

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Framer Motion for animations
- Lucide React for icons
- localStorage (no backend)
