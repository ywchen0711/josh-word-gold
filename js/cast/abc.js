// The people of 《一字千金 ABC 海外特別節目》: a family from San Diego, California, and five more children born abroad.
//   Josh 10 — goes to Chinese school every Saturday: black hair, a navy California tee with the bear on it, khaki
//   shorts, white sneakers.  Jasper 8 — his little brother, in the audience with a sign: spiky hair, a red dinosaur tee.
//   Dad Jeff (glasses, a green tee with </> on it) and Mum Erin (a ponytail, a pink top), in the front row.
//   Emily from New York (ponytail, black NY tee); Kevin from Texas (a cowboy hat, a lone-star tee); Ethan from London,
//   "BBC" (a school blazer and a striped tie); Sophie from Vancouver, "CBC" (a maple-leaf tee, hair in a bun); Mei from
//   Sydney — the other ABC (a yellow kangaroo tee).
import * as THREE from '../../lib/three.module.min.js';
import { makeFig, plastic, rbox } from '../brick/minifig.js';

const mk = (g, m, p) => { const o = new THREE.Mesh(g, m); o.castShadow = true; o.receiveShadow = true; p.add(o); return o; };
const build = (spec, dress) => (scene) => { const F = makeFig(spec), extra = dress?.(F) || {}; scene?.add(F.root); return { F, grips: [], tip: null, remove() { F.root.parent?.remove(F.root); }, sway() {}, setGlow() {}, ...extra }; };
const rest = (face = {}, fidget = 0) => (c) => ({ pose: { armR: -0.2 + Math.sin(c * 1.3) * 0.03, outR: 0.12, armL: -0.2, outL: 0.12, hipR: -0.06, hipL: 0.06, head: Math.sin(c * 0.5) * 0.25, y: Math.abs(Math.sin(c * 4)) * 0.015 * fidget + Math.sin(c * 1.7) * 0.004 }, face: { mouth: { smile: 0.45 }, ...face } });
const who = (id, zh, en, tzh, ten, spec, o = {}) => ({ id, name: { zh, en }, title: { zh: tzh, en: ten }, bio: o.bio || { zh: tzh, en: ten }, spec, moves: [], idle: o.idle || rest(o.face, o.fidget), build: build(spec, o.dress), poem: o.poem });

export const JOSH = who('josh', 'Josh', 'Josh', '十歲・加州聖地牙哥', 'Ten, San Diego, California',
  { age: 'kid', cheeks: true, colors: { top: '#1f3e7a', bottom: '#c8b07a', shoes: '#f2f2f2' }, outfit: { top: 'print', bottom: 'pants', pic: '🐻', size: 84 }, hair: { style: 'short', color: '#141012' } },
  { face: { mouth: { smile: 0.5 } }, poem: { zh: ['星期六的中文學校，', '一筆一畫寫到老；', '今天站上一字千金，', '媽媽的媽要寫好。'], en: ['Chinese school every Saturday,', 'stroke by stroke, week after week;', 'today on A Word Worth Gold —', 'Mum’s 媽 had better be right.'] } });
export const JASPER = who('jasper', 'Jasper', 'Jasper', '八歲・Josh 的弟弟', 'Eight, Josh’s little brother',
  { age: 'kid', cheeks: true, colors: { top: '#d8342a', bottom: '#2a3a5a', shoes: '#3a7ad8' }, outfit: { top: 'print', bottom: 'pants', pic: '🦖', size: 90 }, hair: { style: 'spiky', color: '#141012' } }, { fidget: 2, face: { mouth: { smile: 0.9 }, eyes: 1.1 } });
export const JEFF = who('jeff', '爸爸 Jeff', 'Dad (Jeff)', 'Josh 和 Jasper 的爸爸', 'Josh and Jasper’s dad',
  { age: 'adult', glasses: '#1a1a1a', colors: { top: '#2f6a4a', bottom: '#3a3e48', shoes: '#2a2a2a' }, outfit: { top: 'print', bottom: 'pants', pic: '</>', size: 60 }, hair: { style: 'short', color: '#141012' } });
export const ERIN = who('erin', '媽媽 Erin', 'Mum (Erin)', 'Josh 和 Jasper 的媽媽', 'Josh and Jasper’s mum',
  { age: 'adult', lashes: true, cheeks: true, colors: { top: '#e86aa0', bottom: '#3a4a6a', shoes: '#f4f4f4' }, outfit: { top: 'print', bottom: 'pants', pic: '♥', size: 64, ink: '#ffffff' }, hair: { style: 'ponytail', color: '#2a1a12' } });
export const EMILY = who('emily', 'Emily', 'Emily', '十歲・紐約', 'Ten, New York',
  { age: 'kid', lashes: true, colors: { top: '#1a1a1e', bottom: '#c8282a', shoes: '#f4f4f4' }, outfit: { top: 'print', bottom: 'skirt', pic: 'NY', size: 80, ink: '#ffffff' }, hair: { style: 'ponytail', color: '#1a1210', clip: '#ff5a8a' } }, { face: { mouth: { smile: 0.7 }, brow: 0.2 } });
export const KEVIN = who('kevin', 'Kevin', 'Kevin', '十一歲・德州', 'Eleven, Texas',
  { age: 'kid', cheeks: true, colors: { top: '#2a3a8a', bottom: '#3a5a8a', shoes: '#6a4428' }, outfit: { top: 'print', bottom: 'pants', pic: '⭐', size: 84 }, hair: { style: 'short', color: '#2a1a10' } },
  { fidget: 1, dress: (F) => { const m = plastic('#a8743a'); const brim = mk(new THREE.CylinderGeometry(9.5, 9.5, 0.8, 28), m, F.headP); brim.position.y = 9.4; brim.scale.set(1, 1, 0.8); const crown = mk(new THREE.CylinderGeometry(4.6, 5.6, 5.4, 22), m, F.headP); crown.position.y = 12.2; mk(new THREE.CylinderGeometry(5.65, 5.65, 1.1, 22), plastic('#5a3a1a'), F.headP).position.y = 10.2; } });
export const ETHAN = who('ethan', 'Ethan', 'Ethan', '十歲・倫敦（BBC）', 'Ten, London (“BBC”)',
  { age: 'kid', colors: { top: '#1a2448', bottom: '#4a4e58', shoes: '#141414' }, outfit: { top: 'suit', bottom: 'pants', tie: '#8a1a2a', tieStripe: '#d8a838', shirt: '#f6f6f2', pocket: '#d8a838', pin: '#d8a838' }, hair: { style: 'short', color: '#2a1a12' } }, { face: { mouth: { smile: 0.35 } } });
export const SOPHIE = who('sophie', 'Sophie', 'Sophie', '九歲・溫哥華（CBC）', 'Nine, Vancouver (“CBC”)',
  { age: 'kid', lashes: true, cheeks: true, colors: { top: '#f4f4f0', bottom: '#c8282a', shoes: '#f4f4f4' }, outfit: { top: 'print', bottom: 'skirt', pic: '🍁', size: 84 }, hair: { style: 'bun', color: '#2a1a12' } }, { face: { mouth: { smile: 0.4 }, blush: 0.3 } });
export const MEI = who('mei', 'Mei', 'Mei', '十歲・雪梨（澳洲的 ABC）', 'Ten, Sydney (the other ABC)',
  { age: 'kid', lashes: true, cheeks: true, colors: { top: '#f2c21a', bottom: '#2a8a4a', shoes: '#f4f4f4' }, outfit: { top: 'print', bottom: 'pants', pic: '🦘', size: 84 }, hair: { style: 'ponytail', color: '#3a2014', clip: '#2a8a4a' } }, { fidget: 1 });
