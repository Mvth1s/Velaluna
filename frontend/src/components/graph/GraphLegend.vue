<template>
  <div class="graph-legend">
    <span class="graph-legend__item graph-legend__item--locked">Verrouillé</span>
    <span class="graph-legend__item graph-legend__item--available">Disponible</span>
    <span class="graph-legend__item graph-legend__item--in-progress">En cours</span>
    <span class="graph-legend__item graph-legend__item--completed">Terminé</span>
  </div>
</template>

<style scoped>
.graph-legend {
  display: flex;
  gap: 1.25rem;
  padding: 0.625rem 1rem;
  font-size: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.graph-legend__item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #4b5563;
}

.graph-legend__item::before {
  content: '';
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.graph-legend__item--locked::before    { background: #9ca3af; }
.graph-legend__item--available::before { background: #3b82f6; }
.graph-legend__item--in-progress::before { background: #f59e0b; }
.graph-legend__item--completed::before  { background: #22c55e; }
</style>
