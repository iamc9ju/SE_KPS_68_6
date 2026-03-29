import { redirect } from "next/navigation";

export default function ApprovalRedirect() {
    redirect("/dashboard/admindashboard/nutritionists");
}
