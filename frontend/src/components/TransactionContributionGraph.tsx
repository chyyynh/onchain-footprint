"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionContributionGraphProps {
  transactions: Array<{
    block_time: string;
    chain: string;
  }>;
  className?: string;
}

interface DayData {
  date: string;
  count: number;
  level: number; // 0-4 intensity levels
}

export function TransactionContributionGraph({ 
  transactions, 
  className = "" 
}: TransactionContributionGraphProps) {
  const contributionData = useMemo(() => {
    // Generate last 365 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 364); // 365 days total
    
    // Create map of date -> transaction count
    const dailyCounts = new Map<string, number>();
    
    // Initialize all dates with 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyCounts.set(dateStr, 0);
    }
    
    // Count transactions per day
    transactions.forEach(tx => {
      const date = new Date(tx.block_time).toISOString().split('T')[0];
      if (dailyCounts.has(date)) {
        dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
      }
    });
    
    // Convert to array with intensity levels
    const data: DayData[] = [];
    const counts = Array.from(dailyCounts.values());
    const maxCount = Math.max(...counts);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const count = dailyCounts.get(dateStr) || 0;
      
      // Calculate intensity level (0-4)
      let level = 0;
      if (count > 0) {
        if (maxCount <= 1) level = 1;
        else if (count === 1) level = 1;
        else if (count <= Math.ceil(maxCount * 0.25)) level = 1;
        else if (count <= Math.ceil(maxCount * 0.5)) level = 2;
        else if (count <= Math.ceil(maxCount * 0.75)) level = 3;
        else level = 4;
      }
      
      data.push({
        date: dateStr,
        count,
        level
      });
    }
    
    return data;
  }, [transactions]);
  
  // Group data by weeks
  const weeks = useMemo(() => {
    const weeksData: DayData[][] = [];
    let currentWeek: DayData[] = [];
    
    contributionData.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay();
      
      // Start new week on Sunday (day 0)
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(day);
      
      // Add the last week
      if (index === contributionData.length - 1) {
        weeksData.push(currentWeek);
      }
    });
    
    return weeksData;
  }, [contributionData]);
  
  const totalTransactions = contributionData.reduce((sum, day) => sum + day.count, 0);
  const activeDays = contributionData.filter(day => day.count > 0).length;
  
  const getColorClass = (level: number) => {
    switch (level) {
      case 0: return "bg-slate-100 dark:bg-slate-800";
      case 1: return "bg-green-200 dark:bg-green-900";
      case 2: return "bg-green-300 dark:bg-green-700";
      case 3: return "bg-green-400 dark:bg-green-600";
      case 4: return "bg-green-500 dark:bg-green-500";
      default: return "bg-slate-100 dark:bg-slate-800";
    }
  };
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Transaction Activity</span>
          <div className="text-sm font-normal text-muted-foreground">
            {totalTransactions} transactions in the last year
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>{activeDays} active days</span>
            <span>Longest streak: {calculateLongestStreak(contributionData)} days</span>
            <span>Current streak: {calculateCurrentStreak(contributionData)} days</span>
          </div>
          
          {/* Graph */}
          <div className="overflow-x-auto">
            <div className="flex flex-col gap-1 min-w-fit">
              {/* Month labels */}
              <div className="flex">
                <div className="w-6"></div> {/* Space for day labels */}
                <div className="flex-1 flex justify-between text-xs text-muted-foreground pl-2">
                  {Array.from({ length: 12 }, (_, i) => {
                    const monthIndex = (new Date().getMonth() - 11 + i + 12) % 12;
                    return (
                      <span key={i} className="w-10 text-center">
                        {months[monthIndex]}
                      </span>
                    );
                  })}
                </div>
              </div>
              
              {/* Days grid */}
              <div className="flex">
                {/* Day labels */}
                <div className="flex flex-col text-xs text-muted-foreground pr-2">
                  {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                    <div key={i} className="h-3 flex items-center justify-end w-6">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Contribution squares */}
                <div className="flex gap-1">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        const day = week[dayIndex];
                        return (
                          <div
                            key={dayIndex}
                            className={`w-3 h-3 rounded-sm ${
                              day ? getColorClass(day.level) : 'bg-slate-100 dark:bg-slate-800'
                            } hover:ring-2 hover:ring-slate-400 transition-all cursor-pointer`}
                            title={
                              day 
                                ? `${day.count} transactions on ${new Date(day.date).toLocaleDateString()}`
                                : 'No data'
                            }
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map(level => (
                    <div
                      key={level}
                      className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">More</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper functions
function calculateLongestStreak(data: DayData[]): number {
  let longest = 0;
  let current = 0;
  
  data.forEach(day => {
    if (day.count > 0) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  });
  
  return longest;
}

function calculateCurrentStreak(data: DayData[]): number {
  let streak = 0;
  
  // Count backwards from the end
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].count > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}