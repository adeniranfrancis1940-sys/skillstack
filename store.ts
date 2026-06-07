import { useEffect, useState, useCallback } from "react";

export interface UserState {
  username: string;
  isGuest: boolean;
  xp: number;
  streak: number;
  lastActive: string;
  completedLessons: string[];
  onboarded: boolean;
  goals: {
    track?: "html" | "css" | "javascript";
    level?: "beginner" | "intermediate" | "advanced";
    daily?: 5 | 10 | 20 | 30;
  };
  badges: string[];
  soundOn: boolean;
}

const KEY = "skillstack:user";

const defaultUser: UserState = {
  username: "",
  isGuest: false,
  xp: 0,
  streak: 0,
  lastActive: "",
  completedLessons: [],
  onboarded: false,
  goals: {},
  badges: [],
  soundOn: true,
};

function read(): UserState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultUser, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}

function write(u: UserState) {
  localStorage.setItem(KEY, JSON.stringify(u));
  window.dispatchEvent(new CustomEvent("skillstack:user"));
}

export function useUser() {
  const [user, setUser] = useState<UserState | null>(() => read());

  useEffect(() => {
    const handler = () => setUser(read());
    window.addEventListener("skillstack:user", handler);
    window.addEventListener("storage", handler);
    if (!user) setUser(read());
    return () => {
      window.removeEventListener("skillstack:user", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const update = useCallback((patch: Partial<UserState>) => {
    const current = read() ?? defaultUser;
    const next = { ...current, ...patch };
    write(next);
    setUser(next);
  }, []);

  const signIn = useCallback((username: string, guest = false) => {
    const existing = read();
    const next: UserState = existing
      ? { ...existing, username, isGuest: guest }
      : { ...defaultUser, username, isGuest: guest };
    write(next);
    setUser(next);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(KEY);
    setUser(null);
    window.dispatchEvent(new CustomEvent("skillstack:user"));
  }, []);

  const completeLesson = useCallback((lessonId: string, xpGain = 10) => {
    const current = read() ?? defaultUser;
    if (current.completedLessons.includes(lessonId)) {
      return { newBadge: null as string | null, leveledStreak: false };
    }
    const today = new Date().toISOString().slice(0, 10);
    let streak = current.streak;
    let leveledStreak = false;
    if (current.lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      streak = current.lastActive === yesterday ? streak + 1 : 1;
      leveledStreak = true;
    }
    const completed = [...current.completedLessons, lessonId];
    const badges = [...current.badges];
    let newBadge: string | null = null;
    if (completed.length === 1 && !badges.includes("first-step")) {
      badges.push("first-step");
      newBadge = "First Step";
    }
    if (completed.length === 5 && !badges.includes("on-a-roll")) {
      badges.push("on-a-roll");
      newBadge = "On a Roll";
    }
    if (streak === 3 && !badges.includes("streak-3")) {
      badges.push("streak-3");
      newBadge = "3-Day Streak";
    }
    const next = {
      ...current,
      xp: current.xp + xpGain,
      streak,
      lastActive: today,
      completedLessons: completed,
      badges,
    };
    write(next);
    setUser(next);
    return { newBadge, leveledStreak };
  }, []);

  return { user, update, signIn, signOut, completeLesson };
}