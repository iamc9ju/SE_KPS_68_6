import { redirect } from "next/navigation";

type AdminDashboardRedirectProps = {
  params: { slug?: string[] };
};

export default function AdminDashboardSubrouteRedirect({
  params,
}: AdminDashboardRedirectProps) {
  const slugPath = params.slug?.join("/") ?? "";
  const target = slugPath
    ? `/dashboard/admindashboard/${slugPath}`
    : "/dashboard/admindashboard";

  redirect(target);
}
