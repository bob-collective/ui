import { redirect } from 'next/navigation';

import { RoutesPath } from '@/constants';

export default function NotFound(): JSX.Element {
  redirect(RoutesPath.NOT_FOUND);
}
