import { writable } from 'svelte/store';
import { derived } from 'svelte/store';
import { nodes } from './nodes';

export const systemStatus = derived(nodes, $nodes => {
  const online = $nodes.filter(s => s.status === 'online').length;
  const offline = $nodes.filter(s => s.status === 'offline').length;
  const maintenance = $nodes.filter(s => s.status === 'maintenance').length;
  
  const onlinenodes = $nodes.filter(s => s.status === 'online' && s.batteryLevel > 0);
  const avgBattery = onlinenodes.length 
    ? Math.round(onlinenodes.reduce((sum, s) => sum + s.batteryLevel, 0) / onlinenodes.length) 
    : 0;
  
  const coverage = Math.round((online / 156) * 100);
  
  return {
    nodes: { online, offline, maintenance },
    battery: avgBattery,
    coverage: coverage > 100 ? 100 : coverage,
    lastUpdate: new Date().toISOString()
  };
});