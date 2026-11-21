// scenes.js — the registry of the six Twin Vistas hunts. Each scene module
// paints one picture twice: with an empty "altered" set for the left panel
// and with every difference id in it for the right, so the right panel can
// only differ where a difference declares it.

import * as harbour from './scene-harbour.js';
import * as forest from './scene-forest.js';
import * as kitchen from './scene-kitchen.js';
import * as alpine from './scene-alpine.js';
import * as oasis from './scene-oasis.js';
import * as reef from './scene-reef.js';

function register(mod, id, title, place, blurb) {
  return {
    id,
    title,
    place,
    blurb,
    paint: mod.paint,
    diffs: mod.DIFFS,
    allAltered: new Set(mod.DIFFS.map((d) => d.id)),
  };
}

export const SCENES = [
  register(harbour, 'harbour', 'Sunset Harbour', 'Port Solana', 'A lighthouse, two sailboats and the last light of the day.'),
  register(forest, 'forest', 'Firefly Hollow', 'The Whisperwood', 'Moonlight, mushrooms and an owl that will not blink first.'),
  register(kitchen, 'kitchen', 'Hearthside Kitchen', 'Rose Cottage', 'Tea is on, the cat is asleep, and something is not where it was.'),
  register(alpine, 'alpine', 'First Snow Cabin', 'The High Pass', 'Fresh snow covers everything — except ten small changes.'),
  register(oasis, 'oasis', 'Mirage Oasis', 'The Singing Dunes', 'A striped tent, a patient camel and a pool of impossible blue.'),
  register(reef, 'reef', 'Coral Garden', 'The Shallows', 'A turtle, a treasure chest and a garden under the sea.'),
];

export function sceneById(id) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}
