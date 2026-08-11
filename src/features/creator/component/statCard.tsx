import { StatCard as SharedStatCard } from '@/features/shared/component/statCard';
import { formatStat } from '../utils/overview.utils';

interface StatCardProps {
  label: string;
  value?: string;
  rawValue?: number;
  sub?: string;
  accent?: boolean;
}

export function StatCard(props: StatCardProps) {
  return <SharedStatCard {...props} formatValue={props.rawValue !== undefined ? formatStat : undefined} />;
}