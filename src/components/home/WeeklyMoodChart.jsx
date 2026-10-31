import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const moodLevels = {
  happy: 5,
  excited: 5,
  calm: 4,
  relaxed: 4,
  neutral: 3,
  tired: 2,
  anxious: 2,
  stressed: 2,
  sad: 1,
  angry: 1,
};

const getWeeklyData = () => {
  let entries = [];

  try {
    entries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
  } catch {
    entries = [];
  }

  const today = new Date();
  const weekData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - i,
    );

    const dateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    // Find the latest mood recorded for this day.
    const dailyEntries = entries
      .filter((entry) => entry.date === dateString)
      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    const mood = dailyEntries[0]?.mood?.toLowerCase() || "";

    weekData.push({
      date: dateString,
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      mood: mood || "Not recorded",
      level: moodLevels[mood] ?? null,
    });
  }

  return weekData;
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="weekly-mood-tooltip">
      <p>{item.date}</p>
      <strong>
        {item.mood === "Not recorded" ? "No mood recorded" : item.mood}
      </strong>
    </div>
  );
};

const WeeklyMoodChart = () => {
  const data = useMemo(() => getWeeklyData(), []);

  const recordedDays = data.filter((item) => item.level !== null).length;

  return (
    <section className="weekly-mood-card">
      <div className="weekly-mood-heading">
        <div>
          <h2>Weekly Mood Overview ♡</h2>
          <p>Your emotional journey over the last 7 days.</p>
        </div>

        <span>{recordedDays}/7 days</span>
      </div>

      {recordedDays === 0 ? (
        <div className="weekly-mood-empty">
          <span>🌱</span>
          <p>No mood records yet.</p>
          <small>Start recording your feelings to see your progress!</small>
        </div>
      ) : (
        <div className="weekly-mood-chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                stroke="#e8eee3"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                tick={{ fill: "#858c8c", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(value) =>
                  ({
                    1: "Sad",
                    2: "Low",
                    3: "Okay",
                    4: "Good",
                    5: "Great",
                  })[value]
                }
                tick={{ fill: "#858c8c", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="level"
                stroke="#eb8189"
                strokeWidth={3}
                connectNulls={false}
                dot={{
                  fill: "#ffffff",
                  stroke: "#eb8189",
                  strokeWidth: 3,
                  r: 5,
                }}
                activeDot={{
                  r: 7,
                  fill: "#df5462",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default WeeklyMoodChart;
