import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const upcoming = [
  { title: "DSA Mock Test", when: "Tomorrow, 10:00 AM" },
  { title: "System Design Review", when: "Wed, 2:00 PM" },
  { title: "HR Interview Prep", when: "Friday, 11:00 AM" },
];

function AssessmentsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessments</CardTitle>
        <CardDescription>Upcoming evaluation slots. Use Practice to generate analysis before each round.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {upcoming.map((item) => (
            <li key={item.title} className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm text-slate-600">{item.when}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default AssessmentsPage;
