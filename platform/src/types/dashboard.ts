export interface IDashboardData {
  userId: string;
  userName: string | null;
  userEmail: string | null;
  joinDate: string | null;
  hasData: boolean;

  // overview stats
  overview: IOverview;

  // Chart data
  charts: ICharts;

  //   Recent activity
  recentActivity: IRecentActivity[];

  //   Achievements
  achievements: IAchievements;

  //   Meta
  dateRange: IDateRange;
}

export interface IOverview {
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  totalDays: number;
  averageSecondsPerDay: number;
  averageHoursPerDay: number;
  formattedTotal: string;
  formattedAverage: string;
}

interface ICharts {
  dailyTrend: IChartsDailyTrend[];
  languageBreakdown: IChartsLanguageBreakdown[];
  dayOfWeekPattern: IChartsDayOfWeekPattern;
}

interface IChartsDailyTrend {
  date: string;
  hours: number;
  seconds: number;
}

interface IChartsLanguageBreakdown {
  language: string;
  seconds: number;
  hours: number;
  percentage: number;
}

interface IChartsDayOfWeekPattern {
  day: string;
  dayNumber: number;
  averageSeconds: number;
  averageHours: number;
  totalDays: number;
}

interface IRecentActivity {
  date: string;
  totalSeconds: number;
  formattedTime: string;
  topLanguage: string;
  languageCount: number;
}

interface IAchievements {
  currentStreak: number;
  longestStreak: number;
  peakDay: IAchievementsPeakDay;
  milestones: IAchievementsMilestones;
}

interface IAchievementsPeakDay {
  date: string;
  hours: number;
  formattedTime: string;
}

interface IAchievementsMilestones {
  title: string;
  achieved: boolean;
  progress?: number;
  target?: number;
}

interface IDateRange {
  start: string;
  end: string;
  days: number;
}
