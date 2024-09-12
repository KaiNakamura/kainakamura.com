import { redirect } from 'next/navigation';
export default async function ResumeRedirect() {
  redirect('/resume.pdf');
}
