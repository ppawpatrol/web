import { writable } from 'svelte/store';
import { derived } from 'svelte/store';
import { sensors } from './sensors';

export const systemStatus = derived(sensors, $sensors => {
  const online = $sensors.filter(s => s.status === 'online').length;
  const offline = $sensors.filter(s => s.status === 'offline').length;
  const maintenance = $sensors.filter(s => s.status === 'maintenance').length;
  
  const onlineSensors = $sensors.filter(s => s.status === 'online' && s.batteryLevel > 0);
  const avgBattery = onlineSensors.length 
    ? Math.round(onlineSensors.reduce((sum, s) => sum + s.batteryLevel, 0) / onlineSensors.length) 
    : 0;
  
  const coverage = Math.round((online / 156) * 100);
  
  return {
    sensors: { online, offline, maintenance },
    battery: avgBattery,
    coverage: coverage > 100 ? 100 : coverage,
    lastUpdate: new Date().toISOString()
  };
});