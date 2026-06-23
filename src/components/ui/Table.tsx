import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: Props) {
  return (
	<div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
	  <table className={`w-full text-right border-collapse ${className}`}>
		{children}
	  </table>
	</div>
  );
}

export function Thead({ children, className = '' }: Props) {
  return (
	<thead className={`bg-gray-50 border-b border-gray-100 ${className}`}>
	  {children}
	</thead>
  );
}

export function Tbody({ children, className = '' }: Props) {
  return (
	<tbody className={`divide-y divide-gray-50 ${className}`}>
	  {children}
	</tbody>
  );
}

export function Tr({ children, className = '' }: Props) {
  return (
	<tr className={`hover:bg-gray-50/50 transition-colors ${className}`}>
	  {children}
	</tr>
  );
}

export function Th({ children, className = '' }: Props) {
  return (
	<th className={`px-4 py-3 text-sm font-semibold text-gray-600 ${className}`}>
	  {children}
	</th>
  );
}

export function Td({ children, className = '' }: Props) {
  return (
	<td className={`px-4 py-3 text-sm text-gray-800 ${className}`}>
	  {children}
	</td>
  );
}