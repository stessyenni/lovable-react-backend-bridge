import { useState, useEffect, useCallback } from "react";

interface NotificationSettings {
  pushNotifications: boolean;
  medication: boolean;
  meal: boolean;
  exercise: boolean;
  goals: boolean;
  healthTips: boolean;
  quietHours: string;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  pushNotifications: true,
  medication: true,
  meal: true,
  exercise: true,
  goals: false,
  healthTips: false,
  quietHours: 'none',
};

const HEALTH_TIPS = [
  "Stay hydrated! Aim for at least 8 glasses of water daily for optimal body function.",
  "Include more fiber-rich foods like fruits, vegetables, and whole grains in your diet.",
  "Take short breaks every hour to stretch and move around if you sit for long periods.",
  "Try to eat at regular intervals to maintain stable blood sugar levels.",
  "Include protein in every meal to help maintain muscle mass and feel fuller longer.",
  "Limit processed foods and choose whole, natural ingredients when possible.",
  "Practice mindful eating - take time to enjoy your meals without distractions.",
  "Get adequate sleep (7-9 hours) as it's essential for overall health and metabolism.",
  "Include colorful vegetables in your meals - different colors provide different nutrients.",
  "Consider taking a short walk after meals to aid digestion.",
];

const EXERCISE_REMINDERS = [
  "Time to move! A 10-minute walk can boost your energy and mood.",
  "Remember to stretch! Gentle stretching helps improve flexibility and reduce tension.",
  "Try taking the stairs today for some extra cardiovascular exercise.",
  "Stand up and do some light exercises - your body will thank you!",
  "Consider a quick strength exercise - even bodyweight squats help maintain muscle.",
  "Movement break! Try some neck rolls and shoulder shrugs to release tension.",
  "Aim for at least 30 minutes of moderate activity today.",
  "Try a short yoga session to improve both flexibility and mental clarity.",
  "Walking meetings or phone calls are a great way to add movement to your day.",
  "Remember: any movement is better than none. Start small and build up!",
];

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  const [currentHealthTip, setCurrentHealthTip] = useState<string | null>(null);
  const [currentExerciseReminder, setCurrentExerciseReminder] = useState<string | null>(null);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  // Generate health tip when healthTips is enabled
  useEffect(() => {
    if (settings.healthTips) {
      const randomTip = HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)];
      setCurrentHealthTip(randomTip);
    } else {
      setCurrentHealthTip(null);
    }
  }, [settings.healthTips]);

  // Generate exercise reminder when exercise is enabled
  useEffect(() => {
    if (settings.exercise) {
      const randomReminder = EXERCISE_REMINDERS[Math.floor(Math.random() * EXERCISE_REMINDERS.length)];
      setCurrentExerciseReminder(randomReminder);
    } else {
      setCurrentExerciseReminder(null);
    }
  }, [settings.exercise]);

  const updateSetting = useCallback(<K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const refreshHealthTip = useCallback(() => {
    if (settings.healthTips) {
      const randomTip = HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)];
      setCurrentHealthTip(randomTip);
    }
  }, [settings.healthTips]);

  const refreshExerciseReminder = useCallback(() => {
    if (settings.exercise) {
      const randomReminder = EXERCISE_REMINDERS[Math.floor(Math.random() * EXERCISE_REMINDERS.length)];
      setCurrentExerciseReminder(randomReminder);
    }
  }, [settings.exercise]);

  return {
    settings,
    updateSetting,
    currentHealthTip,
    currentExerciseReminder,
    refreshHealthTip,
    refreshExerciseReminder,
  };
};
