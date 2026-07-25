import {
  Users,
  UserPlus,
  PhoneCall,
  CircleCheckBig,
} from "lucide-react";
import { StatCard } from "../ui/StatCard";
import { StatCardSkeleton } from "../ui/Skeleton";
import { LeadStats } from "../../types/lead";

interface StatsCardsProps {
  stats: LeadStats;
  isLoading: boolean;
}

export const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Leads"
        value={stats.total}
        icon={Users}
        color="text-indigo-700"
        bgColor="bg-gradient-to-br from-indigo-100 to-violet-100"
      />

      <StatCard
        title="New Leads"
        value={stats.New}
        icon={UserPlus}
        color="text-cyan-700"
        bgColor="bg-gradient-to-br from-cyan-100 to-sky-100"
      />

      <StatCard
        title="Contacted"
        value={stats.Contacted}
        icon={PhoneCall}
        color="text-orange-700"
        bgColor="bg-gradient-to-br from-orange-100 to-amber-100"
      />

      <StatCard
        title="Closed"
        value={stats.Closed}
        icon={CircleCheckBig}
        color="text-emerald-700"
        bgColor="bg-gradient-to-br from-emerald-100 to-green-100"
      />
    </div>
  );
};