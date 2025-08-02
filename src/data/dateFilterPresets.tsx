import Month from 'components/icons/main/transactions/calendar/month';
import Today from 'components/icons/main/transactions/calendar/today';
import Week from 'components/icons/main/transactions/calendar/week';

/**
 * Configuration for date filter presets.
 */
export const dateFilterPresets = [
  {
    label: 'Today',
    preset: 'today' as const,
    icon: (
      <Today
        width={20}
        height={20}
      />
    ),
  },
  {
    label: 'The last 7 days',
    preset: 'last7' as const,
    icon: (
      <Week
        width={20}
        height={20}
      />
    ),
  },
  {
    label: 'The last 30 days',
    preset: 'last30Days' as const,
    icon: (
      <Month
        width={20}
        height={20}
      />
    ),
  },
];