import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Simple redirect to quizzes as the main dashboard view for now
  redirect('/quizzes');
}
