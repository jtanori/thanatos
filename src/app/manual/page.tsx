import { notFound } from "next/navigation";
import ManualClient from "./ManualClient";

export const dynamic = "force-dynamic";

// Dev-only usage guide: 404 on staging/production so end users never see it.
export default function ManualPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ManualClient />;
}
