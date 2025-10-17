"use client";

import MemoryIcon from '@mui/icons-material/Memory';
import TvIcon from '@mui/icons-material/Tv';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { useUnidade } from '../hooks/useUnidade';

export function MenuItems() {
  const { unidade } = useUnidade();

  const items = [
    {
      icon: SpaceDashboardIcon,
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      icon: TvIcon,
      label: 'Visão TV',
      href: `/tv/${unidade}`
    },
    {
      icon: MemoryIcon,
      label: 'Parâmetros',
      href: '/dashboard/parametros'
    }
  ];

  return items;
}
