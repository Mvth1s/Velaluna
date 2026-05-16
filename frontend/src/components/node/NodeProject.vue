<script setup lang="ts">
import type { NodeProject, Difficulty } from '../../types/velaluna'

defineProps<{
  project: NodeProject
  completed: boolean
}>()

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé'
}
</script>

<template>
  <div class="project-card" :class="{ 'project-card--done': completed }">
    <div class="project-card__head">
      <h3 class="project-card__title">{{ project.label }}</h3>
      <div class="project-card__badges">
        <span class="diff" :class="project.difficulty">{{ DIFFICULTY_LABELS[project.difficulty] }}</span>
        <span v-if="completed" class="done-chip">✦ Maîtrisé</span>
      </div>
    </div>
    <p class="project-card__desc">{{ project.description }}</p>
    <details class="project-card__hint">
      <summary class="project-card__hint-toggle">Voir l'indice</summary>
      <p class="project-card__hint-text">{{ project.hint }}</p>
    </details>
  </div>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 20px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-2);
  transition: border-color 0.2s;
}

.project-card--done {
  border-color: rgba(232, 227, 216, 0.25);
  background: rgba(232, 227, 216, 0.03);
}

.project-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.project-card__title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.15;
  color: var(--color-ivory);
  flex: 1;
}

.project-card__badges {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.diff {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  white-space: nowrap;
}
.diff::before {
  content: '';
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}
.diff.beginner    { color: var(--color-slate); }
.diff.intermediate { color: var(--color-sand); border-color: rgba(200, 184, 152, 0.4); }
.diff.advanced    { color: #d99780; border-color: rgba(217, 151, 128, 0.4); }

.done-chip {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-ivory);
  opacity: 0.7;
}

.project-card__desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(232, 227, 216, 0.75);
}

.project-card__hint {
  font-size: 0.875rem;
}

.project-card__hint-toggle {
  cursor: pointer;
  color: var(--color-stellar);
  font-family: var(--font-label);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  user-select: none;
  list-style: none;
}
.project-card__hint-toggle::-webkit-details-marker { display: none; }

.project-card__hint-text {
  margin-top: 10px;
  padding: 14px 16px;
  background: rgba(88, 130, 136, 0.06);
  border-left: 2px solid var(--accent);
  border-radius: 0 6px 6px 0;
  color: rgba(232, 227, 216, 0.8);
  line-height: 1.6;
}
</style>
