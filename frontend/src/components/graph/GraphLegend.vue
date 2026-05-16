<template>
  <div class="graph-legend">
    <span class="graph-legend__item graph-legend__item--locked">Verrouillé</span>
    <span class="graph-legend__item graph-legend__item--available">Disponible</span>
    <span class="graph-legend__item graph-legend__item--in-progress">En cours</span>
    <span class="graph-legend__item graph-legend__item--completed">Maîtrisé</span>
  </div>
</template>

<style scoped>
.graph-legend {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem 1.5rem;
  font-family: var(--font-label);
  font-size: 0.6875rem;
  font-weight: 300;
  letter-spacing: 0.06em;
  border-bottom: 1px solid rgba(26, 39, 68, 0.8);
  background: rgba(0, 0, 26, 0.6);
  backdrop-filter: blur(4px);
}

.graph-legend__item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-sand);
  opacity: 0.7;
}

.graph-legend__item::before {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.graph-legend__item--locked::before {
  background: #1A2744;
}

.graph-legend__item--available::before {
  background: #588288;
  box-shadow: 0 0 5px rgba(88, 130, 136, 0.5);
}

.graph-legend__item--in-progress::before {
  background: #C8B898;
}

.graph-legend__item--completed::before {
  background: #E8E3D8;
  box-shadow: 0 0 6px rgba(232, 227, 216, 0.5);
}

@media (max-width: 640px) {
  .graph-legend {
    gap: 0.875rem;
    padding: 0.375rem 1rem;
    flex-wrap: wrap;
  }
}
</style>
