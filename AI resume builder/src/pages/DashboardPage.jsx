import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const readinessScore = 72;
const readinessMax = 100;

const radarData = [
  { skill: "DSA", score: 75 },
  { skill: "System Design", score: 60 },
  { skill: "Communication", score: 80 },
  { skill: "Resume", score: 85 },
  { skill: "Aptitude", score: 70 },
];

const weeklyDays = [
  { day: "Mon", active: true },
  { day: "Tue", active: true },
  { day: "Wed", active: false },
  { day: "Thu", active: true },
  { day: "Fri", active: false },
  { day: "Sat", active: true },
  { day: "Sun", active: false },
];

function buildStudyAnalysis(rawTopic) {
  const topic = rawTopic.trim();
  if (!topic) return null;

  const lower = topic.toLowerCase();

  const tracks = [
    {
      keywords: ["dsa", "algorithm", "data structure", "dynamic programming", "graph"],
      title: "DSA Mastery",
      focus: "Prioritize problem patterns, complexity trade-offs, and timed coding drills.",
      links: [
        { label: "DSA roadmap", query: "DSA roadmap for placement preparation" },
        { label: "Top coding patterns", query: "most important coding interview patterns" },
        { label: "Practice sets", query: "DSA practice sheet for placements" },
      ],
    },
    {
      keywords: ["react", "frontend", "javascript", "typescript", "next"],
      title: "Frontend Track",
      focus: "Strengthen component architecture, state management, and performance optimization.",
      links: [
        { label: "React interview prep", query: "React interview questions and answers for freshers" },
        { label: "Frontend system design", query: "frontend system design preparation" },
        { label: "TypeScript essentials", query: "TypeScript concepts for frontend interviews" },
      ],
    },
    {
      keywords: ["node", "backend", "api", "express", "graphql", "rest"],
      title: "Backend Track",
      focus: "Focus on API design, scalability basics, and production-grade debugging workflows.",
      links: [
        { label: "Node.js interview prep", query: "Node.js backend interview preparation guide" },
        { label: "REST API best practices", query: "REST API best practices interview" },
        { label: "System design basics", query: "system design basics for backend interviews" },
      ],
    },
    {
      keywords: ["sql", "database", "postgres", "mysql", "mongodb", "redis"],
      title: "Database Track",
      focus: "Revise schema design, indexing, joins, and query optimization methods.",
      links: [
        { label: "SQL interview topics", query: "SQL interview questions indexing joins" },
        { label: "Database design basics", query: "database design basics for interviews" },
        { label: "Query optimization", query: "how to optimize SQL queries interview" },
      ],
    },
    {
      keywords: ["system design", "scalability", "architecture", "distributed"],
      title: "System Design Track",
      focus: "Practice trade-offs, component decomposition, and reliability-focused design decisions.",
      links: [
        { label: "System design primer", query: "system design interview beginner guide" },
        { label: "Common architectures", query: "system design case studies interviews" },
        { label: "Scalability fundamentals", query: "scalability concepts for software engineers" },
      ],
    },
  ];

  const matched = tracks.find((track) => track.keywords.some((keyword) => lower.includes(keyword)));

  if (matched) {
    return {
      title: matched.title,
      focus: matched.focus,
      links: [
        ...matched.links,
        { label: `Google: ${topic}`, query: `${topic} placement study material` },
      ],
    };
  }

  return {
    title: "General Placement Track",
    focus: "Split study across aptitude, coding fundamentals, project storytelling, and mock interviews.",
    links: [
      { label: "General placement prep", query: `${topic} placement preparation guide` },
      { label: "Interview question sets", query: `${topic} interview questions and answers` },
      { label: "Revision resources", query: `${topic} complete revision notes` },
    ],
  };
}

function StudyDirectionCard() {
  const [studyInput, setStudyInput] = useState("");
  const [submittedTopic, setSubmittedTopic] = useState("");

  const analysis = useMemo(() => buildStudyAnalysis(submittedTopic), [submittedTopic]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedTopic(studyInput);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Direction Engine</CardTitle>
        <CardDescription>
          Tell us what you want to study. We analyze your focus and generate targeted Google study material links.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="study-focus" className="text-sm font-medium text-slate-700">
            What do you want to study?
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="study-focus"
              value={studyInput}
              onChange={(e) => setStudyInput(e.target.value)}
              placeholder="e.g. React state management, DSA graphs, SQL indexing"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-primary"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Analyze
            </button>
          </div>
        </form>

        {analysis ? (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Track: {analysis.title}</p>
            <p className="text-sm text-slate-600">{analysis.focus}</p>
            <div className="space-y-2">
              {analysis.links.map((link) => (
                <a
                  key={link.query}
                  href={`https://www.google.com/search?q=${encodeURIComponent(link.query)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-primary hover:border-primary/40"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Enter a topic and click Analyze to get study links.</p>
        )}
      </CardContent>
    </Card>
  );
}

function OverallReadinessCard() {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - readinessScore / readinessMax);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Readiness</CardTitle>
        <CardDescription>Your current placement preparation score.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center pb-8">
        <div className="relative flex h-64 w-64 items-center justify-center">
          <svg className="h-56 w-56 -rotate-90" viewBox="0 0 200 200" aria-label="Readiness score">
            <circle cx="100" cy="100" r={radius} fill="none" stroke="hsl(226 23% 88%)" strokeWidth="14" />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="hsl(245 58% 51%)"
              strokeLinecap="round"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="readiness-ring-progress"
              style={{
                ["--ring-length"]: `${circumference}`,
                ["--ring-target"]: `${offset}`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-5xl font-bold text-slate-900">{readinessScore}/100</p>
            <p className="mt-2 text-sm font-medium text-slate-600">Readiness Score</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillBreakdownCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Breakdown</CardTitle>
        <CardDescription>Performance across core placement dimensions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="74%">
              <PolarGrid stroke="hsl(215 20% 80%)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(215 16% 35%)", fontSize: 12 }} />
              <Tooltip />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(245 58% 51%)"
                fill="hsl(245 58% 51%)"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function ContinuePracticeCard() {
  const completed = 3;
  const total = 10;
  const progressPercent = (completed / total) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Practice</CardTitle>
        <CardDescription>Pick up where you left off.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-base font-medium text-slate-900">Last Topic: Dynamic Programming</p>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-slate-600">{completed}/10 completed</p>
        <button className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90">
          Continue
        </button>
      </CardContent>
    </Card>
  );
}

function WeeklyGoalsCard() {
  const solved = 12;
  const goal = 20;
  const progressPercent = (solved / goal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
        <CardDescription>Track momentum for this week.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-base font-medium text-slate-900">Problems Solved: 12/20 this week</p>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {weeklyDays.map(({ day, active }) => (
            <div key={day} className="flex flex-col items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full border border-slate-300 ${
                  active ? "bg-primary" : "bg-white"
                }`}
                title={day}
              />
              <span className="text-xs text-slate-500">{day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <StudyDirectionCard />
      </div>
      <OverallReadinessCard />
      <SkillBreakdownCard />
      <ContinuePracticeCard />
      <WeeklyGoalsCard />
    </section>
  );
}

export default DashboardPage;
