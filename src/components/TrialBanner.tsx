import { useSubscription } from '@/hooks/useSubscription';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export function TrialBanner() {
  const { isSubscribed, isTrialing, trialEndsAt } = useSubscription();

  if (isSubscribed || !isTrialing || !trialEndsAt) {
    return null;
  }

  return (
    <div className="bg-primary/20 py-2">
      <div className="container text-center text-sm">
        Trial ends in {formatDistanceToNow(trialEndsAt)}.{' '}
        <Link href="/settings" className="font-medium underline">
          Subscribe now
        </Link>
      </div>
    </div>
  );
}