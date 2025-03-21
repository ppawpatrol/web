import { writable } from 'svelte/store';
import { derived } from 'svelte/store';
import { nodes } from './nodes';
import { alerts } from './alerts';

export const systemStatus = derived([nodes, alerts], ([$nodes, $alerts]) => {
  const online = $nodes.filter(s => s.status === 'online').length;
  const offline = $nodes.filter(s => s.status === 'offline').length;
  const maintenance = $nodes.filter(s => s.status === 'maintenance').length;
  
  const avgBattery = Math.round($nodes.reduce((acc, s) => acc + s.batteryLevel, 0) / $nodes.length);
  
  const coverage = Math.round((online / 156) * 100);
  
  const activeAlerts = $alerts.filter(a => a.status === 'active').length;
  
  return {
    nodes: { online, offline, maintenance },
    battery: avgBattery,
    coverage: coverage > 100 ? 100 : coverage,
    activeAlerts: activeAlerts,
    lastUpdate: new Date().toISOString(),
  };
});
