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
  background: #0A0F1A;
  border: 1px solid #2A3A4A;
}

.graph-legend__item--available::before {
  background: #1A2744;
  border: 2px solid #588288;
  box-shadow: 0 0 4px rgba(88, 130, 136, 0.4);
}

.graph-legend__item--in-progress::before {
  background: #2A3A5A;
  border: 2px dashed #8A9DBB;
}

.graph-legend__item--completed::before {
  background: radial-gradient(circle, #588288 30%, #1A2744 100%);
  border: 1px solid rgba(232, 227, 216, 0.7);
  box-shadow: 0 0 6px rgba(88, 130, 136, 0.7);
}
</style>
