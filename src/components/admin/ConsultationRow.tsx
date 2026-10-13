'use client';

import Link from 'next/link';
import {
  StatusProvider,
  StatusBadge,
  ToggleButton,
  type ConsultationStatus,
} from './consultation-status';

export interface ConsultationRowProps {
  id: string;
  brand: string;
  name: string;
  phone: string;
  email: string;
  createdAtLabel: string;
  status: ConsultationStatus;
}

export function ConsultationRow(props: ConsultationRowProps): JSX.Element {
  const { id, brand, name, phone, email, createdAtLabel, status } = props;
  return (
    <StatusProvider id={id} initial={status}>
      <tr className="hover:bg-ink-100/30">
        <td className="px-4 py-3">
          <StatusBadge />
        </td>
        <td className="px-4 py-3 font-semibold text-ink-900">
          <Link href={`/admin/consultations/${id}`} className="hover:underline">
            {brand}
          </Link>
        </td>
        <td className="px-4 py-3 text-ink-700">{name}</td>
        <td className="px-4 py-3 text-ink-700">{phone}</td>
        <td className="px-4 py-3 text-ink-700">{email}</td>
        <td className="px-4 py-3 text-ink-500">{createdAtLabel}</td>
        <td className="px-4 py-3 text-right">
          <ToggleButton
            variant="list"
            className="rounded-md border border-ink-100 px-3 py-1 text-xs font-semibold text-ink-700 hover:bg-ink-100"
          />
        </td>
      </tr>
    </StatusProvider>
  );
}
