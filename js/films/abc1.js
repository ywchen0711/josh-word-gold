// 《一字千金 ABC 海外特別節目》 Josh on the show: six children born abroad — Josh from San Diego, Emily from New York,
// Kevin from Texas, Ethan from London ("BBC"), Sophie from Vancouver ("CBC") and Mei from Sydney (the other ABC) — with
// 曾國城 hosting and Josh's family in the front row (Jasper with a sign: 哥哥加油 / GO JOSH!).
//   Round one, the tones: 水餃 said as 睡覺, 問你 as 吻你, 湯 as 糖, and 媽媽騎馬，馬慢，媽媽罵馬.
//   Round two, the customs: a red envelope (can it be Venmo'd?), the Mid-Autumn Festival (turkey? barbecue!), "吃飽了沒"
//   taken at its word, and the unlucky four.
//   Round three, idioms put into English: horse horse tiger tiger, people mountain people sea, chicken talks to duck,
//   drawing a snake and adding feet, playing the zither to a cow (in Texas, country music).
//   The final, Josh against Emily from nothing: 家 (both right), 龜 (Josh puts in a stroke too many, Emily leads), and
//   for double, 媽 — Emily writes 嗎. Josh wins by a word, and thanks his mum for the Saturdays.
//   Written as it runs and timed from the recordings (abc1.durs.js, by tools/voices.py), like Wulin Bricks' films.
import { DURS } from './abc1.durs.js';
import { STUDIO } from '../studio.js';

const PI = Math.PI;
const ORDER = ['emily', 'kevin', 'josh', 'ethan', 'sophie', 'mei'], NAMES = ['Emily', 'Kevin', 'Josh', 'Ethan', 'Sophie', 'Mei'], POD = Object.fromEntries(ORDER.map((n, i) => [n, i]));
const COL = { emily: '#e8b81a', kevin: '#3a7ad8', josh: '#2a3a8a', ethan: '#d8462a', sophie: '#f08a2a', mei: '#e86aa0' };
const pod = (n) => STUDIO.podium(POD[n]);
const HX = STUDIO.host[0], HZ = STUDIO.host[1], HYAW = Math.atan2(0 - HX, -1.6 - HZ);
const FAM = { erin: [-4.5, 5.45], jasper: [-3.7, 5.4], jeff: [-2.9, 5.45] };
const est = (s) => Math.max(1.0, [...s].length * 0.2);
// ---------------------------------------------------------------- the shots used again and again
const MASTER = { kind: 'at', pos: [0, 3.0, 9.2], look: [0, 1.1, -2.2], fov: 46 };
const KIDS = { kind: 'at', pos: [0, 1.45, 4.2], look: [0, 0.95, -2.0], fov: 54 };
const HOSTW = { kind: 'at', pos: [-1.6, 1.45, 3.6], look: [-5.0, 1.15, 0.6], fov: 34 };
const SCREEN = { kind: 'at', pos: [0, 2.3, 1.6], look: [0, 2.55, -5.4], fov: 44 };
const FAMILY = { kind: 'at', pos: [-3.5, 1.3, 2.9], look: [-3.7, 0.95, 5.5], fov: 40 };
const JASPERC = { kind: 'close', on: 'jasper', side: -1, dist: 1.5, angle: 0.3 };
const close = (on, o = {}) => ({ kind: 'close', on, side: o.side ?? (on === 'host' ? -1 : 1), dist: o.dist ?? (on === 'host' ? 1.9 : 1.55), ...o });
const two = (a, b, dist = 2.4) => ({ kind: 'two', on: [a, b], side: -1, dist }); // (a pair left to right: side -1 is the audience's side)

// ---------------------------------------------------------------- a scene, written as it runs
let LI = 0; const SCENES = [];
function scene(o, write) {
  const lines = [], cues = [], shots = [], say = []; let t = o.lead ?? 0.8, last = t, lastWho = null, side = 1;
  const sc = {
    L(who, zh, en, feel = '', x = {}) {
      t += x.gap ?? 0.3; lines.push([t, who, zh, en, feel]); say.push(x.say || null);
      if (x.shot) shots.push([t - 0.12, x.shot]); else if (!x.keep && who !== lastWho) { side = -side; shots.push([t - 0.12, who === 'jasper' ? JASPERC : who === 'erin' || who === 'jeff' ? FAMILY : close(who, { side: who === 'host' ? -1 : side })]); }
      if (x.cue) cues.push([t + (x.at ?? 0), x.cue]);
      lastWho = who; last = t; t += DURS[LI] ?? est(x.say || zh); LI++; return sc;
    },
    W(s) { t += s; return sc; }, C(fn, off = 0) { cues.push([t + off, fn]); return sc; }, S(shot, off = 0) { shots.push([t + off, shot]); lastWho = null; return sc; },
  };
  write(sc);
  SCENES.push({ ...o, len: t + (o.tail ?? 1.2), lines, cues, shots: shots.sort((a, b) => a[0] - b[0]), say });
}
// ---------------------------------------------------------------- what happens on the floor
const set = (F) => F.set();
const TAKES = { laugh_s: 4, laugh_m: 6, laugh_b: 4, aww: 2, ooh: 4, cheer: 2, applause: 4 };
const pick = (F, base) => base + (1 + Math.floor(F.now() * 7.31) % TAKES[base]);
const buzz = (n) => (A, F) => { A[n].gest('buzz'); set(F).buzz(POD[n]); F.sfx('buzzer'); };
const right = (n, score) => (A, F) => { F.sfx('ding'); set(F).score(POD[n], score, 'good'); set(F).crowd('clap', 2.4); F.sfx('sample', pick(F, 'applause'), 0.55); A[n].gest('cheer'); };
const wrong = (n) => (A, F) => { F.sfx('wrong'); set(F).flash(POD[n], 'bad'); };
const laugh = (k = 1, who = []) => (A, F) => { F.sfx('sample', pick(F, k > 1.5 ? 'laugh_b' : k < 0.8 ? 'laugh_s' : 'laugh_m'), 0.75 + 0.15 * k); set(F).crowd('laugh', 1.8 + k); for (const n of who) A[n]?.gest(n === 'host' ? 'laughbig' : 'laugh'); };
const clap = (len = 3) => (A, F) => { F.sfx('sample', len > 4 ? 'applause_long' : pick(F, 'applause'), 0.7); set(F).crowd('clap', len); };
const ooh = (A, F) => { F.sfx('sample', pick(F, 'ooh'), 0.85); set(F).crowd('ooh', 2); };
const aww = (A, F) => { F.sfx('sample', pick(F, 'aww'), 0.9); set(F).crowd('aww', 3); };
const screen = (mode, d) => (A, F) => { set(F).screen(mode, d); F.sfx('swoosh'); };
const SCORES = (list) => (A, F) => { set(F).names(NAMES); set(F).scores(list); };
const placeAll = (o = {}) => { const p = { host: { x: o.host?.[0] ?? HX, z: o.host?.[1] ?? HZ, yaw: o.hostYaw ?? HYAW } }; ORDER.forEach((n) => { const L = STUDIO.podium(POD[n]); p[n] = { x: L.stand[0], z: L.stand[1], yaw: L.yaw }; }); for (const [n, [x, z]] of Object.entries(FAM)) p[n] = { x, z, yaw: PI }; return p; };
const sign = (A, F) => { F.put('sign', 'board:GO JOSH!', F.P(0, -9)); F.give('sign', 'jasper', 'R', [0.04, 0.03, 0.12]); A.jasper.gest('show', { hold: true }); };
const board = (who, text) => (A, F) => { const n = who + ':' + text; F.put(n, 'board:' + text, F.P(0, -9)); F.give(n, who, 'R', [0.06, 0.04, 0.14]); A[who].gest('show', { hold: true }); F.sfx('swoosh'); };
const down = (...names) => (A, F) => { for (const n of names) if (F.prop(n)) F.hide(n); for (const w of ['josh', 'emily']) A[w].gesture = null; };
const common = (scores) => (A, F) => { SCORES(scores)(A, F); sign(A, F); A.jasper.gesture = null; };

// ================================================================ 1 開場
scene({ set: 'studio', tod: 'night', focus: [0, 0], caption: { zh: '一字千金・ABC 海外特別節目', en: 'A Word Worth Gold — the ABC special' }, lead: 0.5,
  place: placeAll({ host: [-9.0, 1.2], hostYaw: PI / 2 }), setup: (A, F) => { set(F).names(NAMES); set(F).lights('dim'); set(F).screen('off'); sign(A, F); } }, (sc) => {
  sc.S({ kind: 'at', pos: [0, 4.6, 9.4], look: [0, 2.2, -4.5], fov: 50, drift: [0, -0.1, -0.22] })
    .C((A, F) => F.sfx('sample', 'drumroll26', 0.9)).W(2.6)
    .C((A, F) => { set(F).lights('party'); set(F).screen('logo', {}); F.sfx('jingle'); F.sfx('sample', pick(F, 'cheer'), 0.8); set(F).crowd('cheer', 4); }).W(0.6)
    .C((A, F) => F.title(6)).W(5.4)
    .C((A, F) => { set(F).lights('show'); F.walk('host', HX, HZ, { speed: 1.5 }); A.host.gest('wave'); F.sfx('sample', 'applause_long', 0.7); set(F).crowd('clap', 5); })
    .S({ kind: 'at', pos: [-3.2, 1.5, 4.2], look: [-7.5, 1.2, 1.0], fov: 36, follow: 'host' }).W(3.2).C((A, F) => F.face('host', [0, 7]))
    .L('host', '各位觀眾朋友大家好！歡迎收看《一字千金》ABC 海外特別節目，我是主持人曾國城！', 'Good evening, everyone! Welcome to A Word Worth Gold — the ABC special. I’m your host, Tseng Kuo-cheng!', 'excited', { say: '各位觀眾朋友大家好！歡迎收看一字千金，A B C 海外特別節目，我是主持人增國城！', shot: MASTER, cue: clap(3), at: 4 })
    .L('host', '今天的六位小朋友，都是在國外出生、長大的華人小孩。他們的中文程度……我們等一下就知道了。', 'Tonight’s six kids were all born and raised abroad. As for their Chinese… we’ll find out.', 'thinking', { shot: HOSTW })
    .C(laugh(1)).W(1.2)
    .L('host', '現場也來了很多爸爸媽媽。我看到有人拿著牌子——', 'Lots of mums and dads came along too. I can see somebody with a sign —', 'happy', { cue: (A) => A.host.gest('point'), at: 1.5 })
    .L('jasper', '哥哥加油！Add oil！', 'Go, big brother! Add oil!', 'excited', { shot: FAMILY, cue: (A) => A.jasper.gest('jump'), at: 0.4 })
    .C(laugh(1.6, ['erin'])).W(1.4)
    .L('host', 'Add oil……好，這位弟弟的翻譯，很有創意。', '“Add oil”… OK, that’s a creative translation, little brother.', 'calm', { shot: close('host', { dist: 1.6 }) })
    .C(laugh(1.2)).W(1.2).C((A) => A.jasper.gest('show', { hold: true }));
});

// ================================================================ 2 自我介紹
scene({ set: 'studio', tod: 'night', focus: [0, 0], place: placeAll(), setup: (A, F) => { common([0, 0, 0, 0, 0, 0])(A, F); set(F).screen('logo', { sub: '參賽者介紹' }); } }, (sc) => {
  const visit = (n) => (A, F) => { const L = pod(n); F.walk('host', L.x + 0.15, L.z + 1.05, { speed: 1.7 }); };
  const mic = (n) => (A, F) => { F.face('host', n); A.host.gest('mic', { hold: true }); };
  sc.S(MASTER).C(visit('emily')).W(2.2).C(mic('emily'))
    .L('emily', 'Hi 大家好！我是 Emily，from New York！我的中文名字叫林……林什麼來著？', 'Hi everyone! I’m Emily, from New York! My Chinese name is Lin… Lin what again?', 'excited', { shot: two('host', 'emily', 2.2) })
    .W(0.6).L('emily', '林美麗！對，我媽說因為我很美麗。', 'Lin Meili — “beautiful”! Right — my mum says it’s because I’m beautiful.', 'proud', { keep: true })
    .C(laugh(1.2)).W(1.0)
    .L('host', '很有自信，很紐約。', 'Very confident. Very New York.', 'happy', { shot: close('host', { dist: 1.6 }) })
    .C(laugh(0.7)).C(visit('kevin')).W(1.6).C(mic('kevin'))
    .L('kevin', 'Howdy y’all！我是 Kevin，我住在 Texas！我家有一頭牛，還有兩台卡車！', 'Howdy y’all! I’m Kevin, I live in Texas! We’ve got a cow and two trucks!', 'excited', { shot: two('host', 'kevin', 2.2) })
    .L('host', '你今天是來比國字，還是來比牛仔？', 'Are you here for the characters, or for the rodeo?', 'surprised')
    .L('kevin', '都可以！Yeehaw！', 'Either! Yeehaw!', 'excited', { cue: (A) => A.kevin.gest('wave') })
    .C(laugh(1.6)).W(1.4).C(visit('josh')).W(1.4).C(mic('josh'))
    .L('josh', '大家好，我叫 Josh，十歲，住在加州聖地牙哥。我每個星期六都要去上中文學校。', 'Hello everyone, I’m Josh, ten, from San Diego, California. Every Saturday I go to Chinese school.', 'calm', { shot: two('host', 'josh', 2.2), cue: (A) => A.josh.gest('bow'), at: 0.6 })
    .L('host', '每個星期六！那你喜歡中文學校嗎？', 'Every Saturday! So do you like Chinese school?', 'surprised')
    .L('josh', '……我喜歡下課的時候。', '…I like the breaks.', 'shy', { gap: 0.6 })
    .C(laugh(1.8, ['jasper'])).W(1.6)
    .L('host', '非常誠實！媽媽在下面笑得很尷尬喔。', 'Very honest! Mum down there is laughing very awkwardly.', 'happy', { shot: FAMILY, cue: (A) => A.erin.gest('facepalm'), at: 0.4 })
    .C(laugh(1)).W(0.8).C(visit('ethan')).W(1.6).C(mic('ethan'))
    .L('ethan', 'Hello，我是 Ethan，我是 BBC。', 'Hello. I’m Ethan. I’m a BBC.', 'calm', { shot: two('host', 'ethan', 2.2) })
    .L('host', 'BBC？你是英國廣播公司派來的記者嗎？', 'The BBC? Did the British Broadcasting Corporation send you as a reporter?', 'surprised')
    .L('ethan', '不是啦。BBC 是 British-born Chinese，英國出生的華人。', 'No, no. BBC means British-born Chinese.', 'calm')
    .C(ooh).C(laugh(0.7), 0.8).C(visit('sophie')).W(2.0).C(mic('sophie'))
    .L('sophie', '大家好，我是 Sophie，從加拿大溫哥華來的，我是 CBC。Sorry，我有一點緊張。', 'Hello everyone, I’m Sophie from Vancouver, Canada — a CBC. Sorry, I’m a bit nervous.', 'shy', { shot: two('host', 'sophie', 2.2) })
    .L('host', '你又沒做錯事，為什麼要說 sorry？', 'You haven’t done anything wrong — why say sorry?', 'surprised')
    .L('sophie', 'Sorry……啊，sorry！', 'Sorry… oh — sorry!', 'shy', { cue: (A) => A.sophie.gest('bow') })
    .C(laugh(1.8)).W(1.6).C(visit('mei')).W(1.6).C(mic('mei'))
    .L('mei', 'G’day！我是 Mei，從澳洲雪梨來的，我是 ABC！', 'G’day! I’m Mei, from Sydney, Australia — I’m an ABC!', 'excited', { shot: two('host', 'mei', 2.2) })
    .L('host', '等一下，ABC 不是 American-born Chinese 嗎？', 'Hold on — doesn’t ABC mean American-born Chinese?', 'surprised')
    .L('mei', '在澳洲，ABC 是 Australian-born Chinese！', 'In Australia, ABC is Australian-born Chinese!', 'proud')
    .L('host', 'ABC、BBC、CBC……我們今天到底是比國字，還是電視台聯誼會？', 'ABC, BBC, CBC… are we here for a quiz, or a TV networks’ get-together?', 'surprised', { shot: close('host', { dist: 1.6 }) })
    .C(laugh(2.2, ['kevin', 'josh', 'emily'])).W(2.0)
    .C((A, F) => F.walk('host', HX, HZ, { speed: 1.8 })).S(MASTER).W(2.2).C((A, F) => F.face('host', [0, 7]))
    .L('host', '好！六位小朋友都到齊了，比賽正式開始！', 'Right! All six are here — let the game begin!', 'excited', { shot: HOSTW, cue: (A, F) => { F.sfx('jingle'); set(F).lights('party'); } })
    .C(clap(4)).W(1.8).C((A, F) => set(F).lights('show'));
});

// ================================================================ 3 第一關 聲調大考驗
scene({ set: 'studio', tod: 'night', focus: [0, 0], place: placeAll(), setup: (A, F) => common([0, 0, 0, 0, 0, 0])(A, F) }, (sc) => {
  const R = '第一關　聲調大考驗', PTS = '每題 100 分';
  sc.S(SCREEN).C(screen('round', { n: '第一關', name: '聲調大考驗', sub: '一聲二聲三聲四聲，念錯意思差很多' })).W(0.6)
    .L('host', '第一關，聲調大考驗！中文有四個聲調，念錯一個，意思就差很多。請念出螢幕上的句子！', 'Round one: the tones! Chinese has four tones — get one wrong and the meaning changes. Read out the sentence on the screen!', 'excited', { keep: true })
    .C(screen('ask', { round: R, pts: PTS, text: '我最喜歡吃水餃', size: 110 })).W(0.6).C(buzz('kevin')).S(close('kevin')).W(0.5)
    .L('kevin', '我最喜歡吃睡覺！', 'My favourite food is… sleep!', 'excited', { cue: wrong('kevin'), at: 1.4 })
    .C(laugh(2, ['josh', 'mei'])).W(1.9)
    .L('host', '睡覺可以吃喔？那我每天都吃得很飽。', 'You can eat sleep? Then I’m full every single day.', 'thinking', { shot: close('host', { dist: 1.6 }) })
    .C(laugh(1.4)).W(1.0).C(buzz('josh')).S(close('josh')).W(0.5)
    .L('josh', '我最喜歡吃水餃！我阿嬤包的韭菜水餃最好吃。', 'My favourite food is dumplings! The chive dumplings my grandma makes are the best.', 'happy', { keep: true })
    .C(right('josh', 100)).W(1.2)
    .L('host', '答對了！聽得我都餓了。', 'Correct! Now I’m hungry.', 'happy')
    .C(screen('ask', { round: R, pts: PTS, text: '我可以問你一個問題嗎？', size: 96 })).W(0.6).C(buzz('ethan')).S(close('ethan')).W(0.5)
    .L('ethan', '主持人，我可以吻你一個問題嗎？', 'Host — may I kiss you a question?', 'calm', { cue: wrong('ethan'), at: 2.0 })
    .C(laugh(2.4, ['kevin', 'emily', 'mei', 'jasper'])).C((A) => A.host.gest('scared'), 0.2).W(2.0)
    .L('host', '不、不用了！我們是闔家觀賞的節目！', 'N-no thank you! This is a family show!', 'scared', { shot: close('host', { dist: 1.6 }) })
    .C(laugh(2)).W(1.8).C(buzz('sophie')).S(close('sophie')).W(0.5)
    .L('sophie', '我可以問你一個問題嗎？……Sorry，我答對了。', 'May I ask you a question? …Sorry, I got it right.', 'shy', { keep: true })
    .C(right('sophie', 100)).C(laugh(0.7), 0.8).W(1.4)
    .C(screen('ask', { round: R, pts: PTS, text: '我感冒了，媽媽煮湯給我喝', size: 88 })).W(0.6).C(buzz('mei')).S(close('mei')).W(0.5)
    .L('mei', '我感冒了，媽媽煮糖給我喝！', 'I had a cold, so my mum cooked me some… sugar!', 'excited', { cue: wrong('mei'), at: 1.8 })
    .C(laugh(1.4)).W(1.2)
    .L('host', '煮糖？你媽媽是開糖果店的嗎？', 'Cooked sugar? Does your mum run a sweet shop?', 'surprised', { shot: close('host', { dist: 1.6 }) })
    .C(laugh(1.3)).W(1.0).C(buzz('emily')).S(close('emily')).W(0.5)
    .L('emily', '我感冒了，媽媽煮湯給我喝！Easy！', 'I had a cold, so my mum made me soup! Easy!', 'proud', { keep: true })
    .C(right('emily', 100)).W(1.2)
    .L('host', '最後一題，繞口令！答對兩百分！', 'Last one — a tongue twister! Two hundred points!', 'excited', { shot: HOSTW, cue: screen('ask', { round: R, pts: '200 分', text: '媽媽騎馬，馬慢，媽媽罵馬', size: 88 }), at: 1.0 })
    .W(0.6).C(buzz('kevin')).S(close('kevin')).W(0.5)
    .L('kevin', '馬馬騎媽……媽慢……馬罵媽媽？', 'Horse horse rides mum… mum slow… horse scolds mum?', 'thinking', { cue: wrong('kevin'), at: 3.2 })
    .C(laugh(2.2, ['ethan', 'host'])).W(2.0)
    .L('host', '現在變成馬在罵媽媽了，這匹馬很兇。', 'Now the horse is telling off the mum. That’s one fierce horse.', 'thinking', { shot: close('host', { dist: 1.6 }) })
    .C(laugh(1.4)).W(1.0).C(buzz('josh')).S(close('josh')).W(0.8)
    .L('josh', '媽媽……騎馬。馬……慢。媽媽……罵馬。', 'Mum… rides the horse. The horse… is slow. Mum… scolds the horse.', 'thinking', { keep: true })
    .C(right('josh', 300)).W(1.4)
    .L('jasper', '哥哥好厲害！我們家媽媽也常常罵——', 'You’re amazing, brother! Our mum scolds all the time too —', 'excited', { cue: (A) => A.jasper.gest('jump') })
    .C((A) => { A.erin.gest('grab', { hold: true }); }, -0.6)
    .L('erin', '噓——！', 'Shhh—!', 'shout', { shot: FAMILY, gap: 0.05 })
    .C(laugh(2.2)).W(2.0).C((A) => { A.erin.gesture = null; })
    .L('host', '第一關結束！Josh 三百分領先，Emily、Sophie 各一百分，其他三位……還在暖身。', 'End of round one! Josh leads with three hundred, Emily and Sophie a hundred each, and the other three… are still warming up.', 'happy', { shot: KIDS })
    .C(laugh(0.7)).W(0.8);
});

// ================================================================ 4 第二關 文化大不同
scene({ set: 'studio', tod: 'night', focus: [0, 0], place: placeAll(), setup: (A, F) => common([100, 0, 300, 0, 100, 0])(A, F) }, (sc) => {
  const R = '第二關　文化大不同', PTS = '每題 100 分';
  sc.S(SCREEN).C(screen('round', { n: '第二關', name: '文化大不同', sub: '華人的習俗，你知道多少？' })).W(0.6)
    .L('host', '第二關，文化大不同！考考大家對華人習俗的了解。', 'Round two: culture clash! How well do you know Chinese customs?', 'excited', { keep: true })
    .L('host', '第一題：過年的時候，長輩給你紅包，你要說什麼？', 'Question one: at New Year, an elder gives you a red envelope. What do you say?', 'calm', { shot: SCREEN, cue: screen('ask', { round: R, pts: PTS, text: '長輩給你紅包，你要說什麼？', size: 84 }), at: 0.4 })
    .W(0.4).C(buzz('kevin')).S(close('kevin')).W(0.5)
    .L('kevin', 'Thank you！請問可以用 Venmo 轉帳嗎？', 'Thank you! Er, can you Venmo it to me?', 'excited', { cue: wrong('kevin'), at: 2.4 })
    .C(laugh(2.2, ['josh', 'ethan'])).W(2.0)
    .L('host', '阿公阿嬤聽到 Venmo，紅包會直接收回去！', 'Say “Venmo” to Grandpa and Grandma and that envelope goes straight back in their pocket!', 'thinking', { shot: close('host', { dist: 1.6 }) })
    .C(laugh(1.2)).W(0.8).C(buzz('josh')).S(close('josh')).W(0.5)
    .L('josh', '恭喜發財，紅包拿來！', 'Gong xi fa cai — now hand over the red envelope!', 'excited', { keep: true })
    .C(laugh(1.8)).W(1.6)
    .L('host', '前面對，後面那句不要對阿公說！這題不給分！', 'The first half’s right — just don’t say the second half to Grandpa! No points!', 'happy', { cue: wrong('josh'), at: 0.4 })
    .C(laugh(1)).W(0.6).C(buzz('emily')).S(close('emily')).W(0.5)
    .L('emily', '新年快樂，身體健康，萬事如意！', 'Happy New Year — good health, and may all go as you wish!', 'proud', { keep: true })
    .C(right('emily', 200)).W(1.2)
    .L('host', '第二題：中秋節，要吃什麼？', 'Question two: what do you eat at the Mid-Autumn Festival?', 'calm', { shot: SCREEN, cue: screen('ask', { round: R, pts: PTS, text: '中秋節要吃什麼？', size: 110 }), at: 0.4 })
    .W(0.3).C(buzz('emily')).S(close('emily')).W(0.4)
    .L('emily', 'Turkey！', 'Turkey!', 'excited', { cue: wrong('emily'), at: 0.8 })
    .C(laugh(1.8)).W(1.4)
    .L('host', '那是感恩節！', 'That’s Thanksgiving!', 'shout', { shot: close('host', { dist: 1.6 }) })
    .C(laugh(1.2)).W(0.8).C(buzz('mei')).S(close('mei')).W(0.5)
    .L('mei', '月餅！', 'Mooncakes!', 'excited', { keep: true })
    .C(right('mei', 100)).W(1.0)
    .L('sophie', 'Sorry，可以補充嗎？我們台灣的親戚，中秋節還會烤肉！', 'Sorry, may I add something? Our relatives in Taiwan have a barbecue at Mid-Autumn too!', 'shy', { shot: close('sophie') })
    .L('host', '對！台灣中秋節真的會烤肉！Sophie 加一百分！', 'Yes! In Taiwan they really do barbecue at Mid-Autumn! A hundred points for Sophie!', 'excited', { shot: HOSTW, cue: right('sophie', 200), at: 2.4 })
    .W(0.8)
    .L('host', '第三題：阿姨看到你，問你「吃飽了沒？」你要怎麼回答？', 'Question three: an auntie sees you and asks, “Have you eaten?” How do you answer?', 'calm', { shot: SCREEN, cue: screen('ask', { round: R, pts: PTS, text: '阿姨問你：「吃飽了沒？」', size: 96 }), at: 0.4 })
    .W(0.4).C(buzz('ethan')).S(close('ethan')).W(0.5)
    .L('ethan', '還沒，我好餓。阿姨，你要請我吃飯嗎？', 'Not yet, I’m starving. Auntie, are you buying me lunch?', 'calm', { cue: wrong('ethan'), at: 2.6 })
    .C(laugh(2)).W(1.8)
    .L('host', '那只是打招呼啦！阿姨沒有要請你吃飯！', 'That’s just a greeting! Auntie isn’t buying you lunch!', 'shout', { shot: close('host', { dist: 1.6 }) })
    .C(laugh(1.2)).W(0.8).C(buzz('josh')).S(close('josh')).W(0.5)
    .L('josh', '吃飽了，謝謝阿姨！', 'I’ve eaten, thank you, Auntie!', 'happy', { keep: true })
    .C(right('josh', 400)).W(1.2)
    .L('host', '第四題：在華人文化裡，數字「四」為什麼不吉利？', 'Question four: why is the number four unlucky in Chinese culture?', 'calm', { shot: SCREEN, cue: screen('ask', { round: R, pts: PTS, big: '4', foot: '為什麼不吉利？' }), at: 0.4 })
    .W(0.4).C(buzz('kevin')).S(close('kevin')).W(0.5)
    .L('kevin', '因為四個輪子的卡車，很耗油？', 'Because a four-wheel truck eats up so much gas?', 'thinking', { cue: wrong('kevin'), at: 2.2 })
    .C(laugh(1.8)).W(1.4).C(buzz('emily')).S(close('emily')).W(0.5)
    .L('emily', '因為「四」聽起來像「死」！所以我們紐約的大樓沒有四樓，三樓上去直接就是五樓。', 'Because “four” sounds like “death”! So our building in New York has no fourth floor — it goes straight from three to five.', 'proud', { keep: true })
    .C(right('emily', 300)).W(1.0)
    .L('jasper', '那我們家為什麼有四個人？', 'Then why are there four people in our family?', 'thinking', { shot: FAMILY })
    .L('jeff', '……因為我們家不迷信。', '…Because our family isn’t superstitious.', 'calm', { gap: 0.6 })
    .C(laugh(2.2)).W(2.0)
    .L('host', '第二關結束！Josh 四百分，Emily 三百分，Sophie 兩百分，Mei 一百分！', 'End of round two! Josh four hundred, Emily three hundred, Sophie two hundred, Mei one hundred!', 'happy', { shot: KIDS })
    .W(0.4).L('kevin', '那我跟 Ethan 呢？', 'What about me and Ethan?', 'surprised', { shot: two('kevin', 'ethan', 3.0) })
    .L('host', '你們兩位……一起努力。', 'You two… are working on it together.', 'thinking', { shot: close('host', { dist: 1.6 }) })
    .C(laugh(1.4)).W(1.2);
});

// ================================================================ 5 第三關 成語英文翻
scene({ set: 'studio', tod: 'night', focus: [0, 0], place: placeAll(), setup: (A, F) => common([300, 0, 400, 0, 200, 100])(A, F) }, (sc) => {
  const R = '第三關　成語英文翻', PTS = '每題 200 分';
  sc.S(SCREEN).C(screen('round', { n: '第三關', name: '成語英文翻', sub: '用中文或英文說出成語的意思' })).W(0.6)
    .L('host', '第三關，成語！我念一個成語，請你用中文或英文，說出它的意思。每題兩百分！', 'Round three: idioms! I read one out, you tell me what it means, in Chinese or English. Two hundred points each!', 'excited', { keep: true })
    .L('host', '第一題：馬馬虎虎。', 'Question one: ma ma hu hu.', 'calm', { shot: SCREEN, cue: screen('q', { round: R, pts: PTS, word: '馬馬虎虎' }), at: 0.3 })
    .W(0.3).C(buzz('emily')).S(close('emily')).W(0.4)
    .L('emily', 'Horse horse tiger tiger！', 'Horse horse tiger tiger!', 'excited', { keep: true })
    .C(laugh(2, ['kevin', 'josh'])).W(1.8)
    .L('host', '字面上是沒錯啦……那意思呢？', 'Well, word for word, yes… but what does it mean?', 'thinking', { shot: close('host', { dist: 1.6 }) })
    .L('emily', '呃……so-so？', 'Er… so-so?', 'shy', { shot: close('emily') })
    .C(right('emily', 500)).C(screen('q', { round: R, pts: PTS, word: '馬馬虎虎', answer: 'so-so　普普通通' }), 0.2).W(1.0)
    .L('host', '對！就是 so-so！Emily 五百分，超前了！', 'Yes! It’s so-so! Emily’s on five hundred — she’s in front!', 'excited', { shot: HOSTW })
    .C(ooh).W(0.8)
    .L('host', '第二題：人山人海。', 'Question two: ren shan ren hai.', 'calm', { shot: SCREEN, cue: screen('q', { round: R, pts: PTS, word: '人山人海' }), at: 0.3 })
    .W(0.3).C(buzz('ethan')).S(close('ethan')).W(0.4)
    .L('ethan', 'People mountain, people sea！', 'People mountain, people sea!', 'proud', { keep: true })
    .C(laugh(1.2)).W(0.8)
    .L('host', '直接翻譯！意思是人非常多，就像今天現場一樣。算你對！', 'Straight translation! It means a huge crowd — like here tonight. I’ll give it to you!', 'happy', { shot: close('host', { dist: 1.6 }), cue: right('ethan', 200), at: 3.2 })
    .W(0.6).L('ethan', 'Brilliant！', 'Brilliant!', 'excited', { shot: close('ethan') })
    .C(laugh(0.7)).W(0.6)
    .L('host', '第三題：雞同鴨講。', 'Question three: ji tong ya jiang.', 'calm', { shot: SCREEN, cue: screen('q', { round: R, pts: PTS, word: '雞同鴨講' }), at: 0.3 })
    .W(0.3).C(buzz('kevin')).S(close('kevin')).W(0.4)
    .L('kevin', 'Chicken talk to duck！在德州，我們家的雞跟鴨真的會聊天！', 'Chicken talk to duck! In Texas, our chickens and ducks really do chat!', 'excited', { cue: wrong('kevin'), at: 3.4 })
    .C(laugh(1.8)).W(1.4)
    .L('host', '它的意思是兩個人講話完全對不上……就像我跟你們今天一樣！', 'It means two people talking past each other… like me and you lot tonight!', 'happy', { shot: close('host', { dist: 1.6 }) })
    .C(laugh(2.4, ['josh', 'mei', 'sophie'])).W(2.2).C(buzz('sophie')).S(close('sophie')).W(0.5)
    .L('sophie', 'Sorry——可是我想說，就是兩個人說話對不上！', 'Sorry — but I was going to say it: two people who can’t understand each other!', 'shy', { keep: true })
    .C(right('sophie', 400)).W(1.0)
    .L('host', '第四題：畫蛇添足。', 'Question four: hua she tian zu.', 'calm', { shot: SCREEN, cue: screen('q', { round: R, pts: PTS, word: '畫蛇添足' }), at: 0.3 })
    .W(0.3).C(buzz('josh')).S(close('josh')).W(0.4)
    .L('josh', 'Drawing a snake and adding feet——就是做了多餘的事，反而把事情搞砸了。', 'Drawing a snake and adding feet — doing something extra that ends up spoiling it.', 'calm', { keep: true })
    .C(right('josh', 600)).C(screen('q', { round: R, pts: PTS, word: '畫蛇添足', answer: '多此一舉，反而壞事' }), 0.2).W(1.2)
    .L('host', '完美！中英文都完美！Josh 六百分！', 'Perfect! Perfect in both languages! Josh, six hundred!', 'excited', { shot: HOSTW })
    .L('jasper', '那是我哥！That’s my brother！', 'That’s my brother! That’s my brother!', 'excited', { shot: FAMILY, cue: (A) => A.jasper.gest('jump') })
    .C(laugh(0.7)).C(clap(2), 0.3).W(1.2)
    .L('host', '最後一題：對牛彈琴。', 'Last question: dui niu tan qin.', 'calm', { shot: SCREEN, cue: screen('q', { round: R, pts: PTS, word: '對牛彈琴' }), at: 0.3 })
    .W(0.3).C(buzz('kevin')).S(close('kevin')).W(0.4)
    .L('kevin', '這個我會！在德州，我們會對牛唱 country music，牛都很喜歡！', 'I know this one! In Texas we sing country music to the cows — they love it!', 'excited', { cue: wrong('kevin'), at: 3.6 })
    .C(laugh(2)).W(1.6).C(buzz('mei')).S(close('mei')).W(0.5)
    .L('mei', '對聽不懂的人講道理，白費力氣！', 'Reasoning with someone who can’t understand — a waste of breath!', 'proud', { keep: true })
    .C(right('mei', 300)).W(1.0)
    .L('host', 'Kevin，你今天雖然零分，但是你一定是全場最開心的人。', 'Kevin, you may be on zero, but you’re definitely the happiest person here.', 'happy', { shot: two('host', 'kevin', 4.0) })
    .L('kevin', 'Yeehaw！', 'Yeehaw!', 'excited', { cue: (A) => A.kevin.gest('cheer') })
    .C(laugh(1.4)).C(clap(3), 0.4).W(1.6)
    .L('host', '第三關結束！最高分的兩位是——', 'End of round three! The two highest scorers are —', 'excited', { shot: SCREEN, cue: (A, F) => { F.sfx('sample', 'drumroll22', 0.9); set(F).screen('scores', { title: '第三關結束', rows: [['Josh', 600, COL.josh], ['Emily', 500, COL.emily], ['Sophie', 400, COL.sophie], ['Mei', 300, COL.mei], ['Ethan', 200, COL.ethan], ['Kevin', 0, COL.kevin]] }); }, at: 0.6 })
    .W(1.0)
    .L('host', 'Josh 六百分，Emily 五百分！兩位進入最後的「一字千金」決戰！', 'Josh with six hundred, Emily with five! They go through to the final: A Word Worth Gold!', 'excited', { shot: two('emily', 'josh', 3.2), cue: (A, F) => { F.sfx('jingle'); set(F).lights('party'); }, at: 2.8 })
    .C((A, F) => { F.sfx('sample', pick(F, 'cheer'), 0.9); set(F).crowd('cheer', 4); A.josh.gest('fist'); A.emily.gest('cheer'); A.jasper.gest('jump'); }).W(1.6)
    .L('emily', 'Josh，game on！我不會輸給你的！', 'Josh — game on! I’m not losing to you!', 'proud', { shot: close('emily') })
    .L('josh', '……我也不會。', '…Neither am I.', 'calm', { shot: close('josh') })
    .C((A, F) => set(F).lights('show')).C(ooh).W(1.4);
});

// ================================================================ 6 決戰 一字千金
scene({ set: 'studio', tod: 'night', focus: [0, 0], place: placeAll(), setup: (A, F) => { common([0, 0, 0, 200, 400, 300])(A, F); set(F).lights('dim'); } }, (sc) => {
  const R = '決戰　一字千金';
  const write = (A) => { A.josh.gest('write', { hold: true }); A.emily.gest('write', { hold: true }); };
  sc.S({ kind: 'at', pos: [-0.8, 1.6, 5.0], look: [-1.6, 1.3, -4], fov: 40, drift: [0, 0, -0.18] }).C((A, F) => { F.sfx('sample', 'drumroll26', 0.9); set(F).screen('final', { a: 'Josh', b: 'Emily' }); }).W(3.0)
    .L('host', '最後決戰，一字千金！Josh 對 Emily，分數從零開始，一共三題，最高分的就是冠軍！', 'The final: A Word Worth Gold! Josh against Emily, scores back to zero, three questions — highest score wins!', 'excited', { shot: HOSTW })
    .L('host', '第一題，一千分：請寫出「家」這個字！', 'Question one, a thousand points: write the character for “home”!', 'calm', { shot: SCREEN, cue: screen('ask', { round: R, pts: '1000 分', text: '請寫出「家」', size: 120 }), at: 0.4 })
    .C(write).C((A, F) => F.sfx('ticktock', 4)).S(two('emily', 'josh', 3.2)).W(4.4)
    .L('host', '時間到！請亮板！', 'Time! Boards up!', 'excited', { shot: HOSTW })
    .C(board('josh', '家')).C(board('emily', '家')).S(two('emily', 'josh', 3.2)).W(0.8)
    .C((A, F) => { F.sfx('ding'); set(F).score(0, 1000); set(F).score(2, 1000); set(F).crowd('clap', 3); F.sfx('sample', pick(F, 'applause'), 0.6); }).W(0.8)
    .L('josh', '屋頂下面養一隻豬，就是家。', 'A pig under a roof — that’s a home.', 'calm', { shot: close('josh') })
    .L('host', '說得好！以前的人家裡真的養豬！一千比一千！', 'Well said! People really did keep pigs at home! A thousand all!', 'happy', { shot: close('host', { dist: 1.7 }) })
    .C(down('josh:家', 'emily:家'))
    .L('host', '第二題，一千分：請寫出「烏龜」的「龜」，一筆都不能錯！', 'Question two, a thousand: write the “gui” of “tortoise” — not a stroke wrong!', 'calm', { shot: SCREEN, cue: screen('ask', { round: R, pts: '1000 分', text: '寫出「烏龜」的「龜」', foot: '一筆都不能錯', size: 100 }), at: 0.4 })
    .C(write).C((A, F) => F.sfx('ticktock', 4)).S({ kind: 'close', on: 'josh', side: 1, dist: 1.4, down: 0.3 }).W(2.2).S({ kind: 'close', on: 'emily', side: -1, dist: 1.4, down: 0.3 }).W(2.2)
    .L('host', '時間到！亮板！', 'Time! Boards up!', 'excited', { shot: HOSTW })
    .C(board('josh', '龜丶')).C(board('emily', '龜')).S(two('emily', 'josh', 3.2)).W(0.8)
    .L('host', 'Emily 的烏龜，十六畫，完全正確！', 'Emily’s tortoise: sixteen strokes, exactly right!', 'excited', { shot: { kind: 'prop', on: 'emily:龜', fov: 30 }, cue: (A, F) => { F.sfx('ding'); set(F).score(0, 2000, 'good'); }, at: 2.2 })
    .L('host', 'Josh 的烏龜……一、二、三……十七畫？多了一點！', 'Josh’s tortoise… one, two, three… seventeen? There’s an extra dot!', 'surprised', { shot: { kind: 'prop', on: 'josh:龜丶', fov: 30 }, cue: wrong('josh'), at: 3.6 })
    .C(ooh).C((A) => { A.jasper.gest('facepalm'); A.erin.gest('scared'); A.josh.gest('facepalm'); }).S(FAMILY).W(1.8)
    .L('josh', '我太緊張了，烏龜多長了一顆痣……', 'I was so nervous, I gave the tortoise a mole…', 'sad', { shot: close('josh') })
    .C(laugh(0.7)).C(aww, 0.5).W(1.4).C(down('josh:龜丶', 'emily:龜'))
    .L('host', '兩千比一千，Emily 領先！最後一題，兩千分！', 'Two thousand to one thousand, Emily leads! Last question — two thousand points!', 'excited', { shot: HOSTW, cue: (A, F) => F.sfx('sample', 'drumroll16', 0.8), at: 1.0 })
    .L('host', 'Josh 如果答對、Emily 答錯，Josh 就會逆轉勝！', 'If Josh gets it right and Emily gets it wrong — Josh comes from behind!', 'excited', { keep: true })
    .C((A, F) => { F.sfx('warm', 30); })
    .L('host', '請寫出「媽媽」的「媽」，然後對你的媽媽說一句話。', 'Write the “ma” of “mummy” — then say something to your mum.', 'calm', { shot: SCREEN, cue: screen('ask', { round: R, pts: '2000 分', text: '寫出「媽媽」的「媽」', foot: '然後對媽媽說一句話', size: 100 }), at: 0.4 })
    .C(write).S(two('emily', 'josh', 3.2)).W(2.4).S({ kind: 'close', on: 'emily', side: -1, dist: 1.4, down: 0.2, push: 0.04 }).W(1.8).S({ kind: 'close', on: 'josh', side: 1, dist: 1.4, down: 0.2, push: 0.04 }).W(1.8)
    .L('host', '時間到。Emily，請亮板。', 'Time. Emily, your board.', 'calm', { shot: HOSTW })
    .C(board('emily', '嗎')).S({ kind: 'prop', on: 'emily:嗎', fov: 30 }).W(1.4)
    .L('host', 'Emily……這是「嗎」，問問題的那個「嗎」，口字旁，不是媽媽的「媽」！', 'Emily… that’s “ma” — the question “ma”, with the mouth radical — not the “ma” of mummy!', 'surprised', { shot: close('host', { dist: 1.7 }), cue: wrong('emily'), at: 1.8 })
    .C(ooh)
    .L('emily', 'Oh no！Mom，are you……嗎？', 'Oh no! Mom, are you… “ma”?', 'surprised', { shot: close('emily') })
    .C(laugh(1.4)).W(1.2)
    .L('host', 'Josh，換你。', 'Josh, your turn.', 'calm', { shot: HOSTW })
    .C(board('josh', '媽')).S({ kind: 'prop', on: 'josh:媽', fov: 30 }).W(1.4)
    .L('host', '女字旁，一個馬……正確！Josh，請對媽媽說一句話。', 'Woman radical, and a horse… correct! Josh, say something to your mum.', 'excited', { shot: close('host', { dist: 1.7 }) })
    .C((A, F) => { F.face('josh', [FAM.erin[0], FAM.erin[1]]); A.josh.gesture = null; F.hide('josh:媽'); })
    .L('josh', '媽媽，謝謝你每個星期六都載我去中文學校。以後在車上……我不會再抱怨了。', 'Mum, thank you for driving me to Chinese school every Saturday. From now on… I won’t complain in the car any more.', 'calm', { shot: close('josh', { dist: 1.6 }) })
    .W(0.6).L('josh', '……大概。', '…Probably.', 'shy', { keep: true })
    .C(laugh(1.2)).C(aww, 0.6).C((A) => A.erin.gest('cry', { hold: true })).S(FAMILY).W(2.0)
    .L('host', '三千比兩千——今天的冠軍是……Josh！', 'Three thousand to two thousand — tonight’s champion is… Josh!', 'excited', { shot: MASTER, cue: (A, F) => { F.sfx('sample', 'drumroll16', 0.9); }, at: 0.8 })
    .C((A, F) => { F.callout({ zh: '冠軍！', en: 'Champion!' }, { dur: 2.2 }); set(F).score(2, 3000, 'good'); set(F).screen('win', { name: 'Josh', sub: '加州聖地牙哥' }); set(F).lights('party'); set(F).confetti(); F.sfx('jingle'); F.sfx('coins'); F.sfx('sample', pick(F, 'cheer'), 1); set(F).crowd('cheer', 6); down('emily:嗎')(A, F); A.josh.gest('jump'); A.erin.gesture = null; A.erin.gest('cheer'); A.jeff.gest('cheer'); for (const n of ['kevin', 'ethan', 'sophie', 'mei', 'emily']) A[n].gest('clap'); })
    .S({ kind: 'at', pos: [-1.0, 2.2, 4.6], look: [-0.8, 1.5, -2.4], fov: 52, drift: [0, 0.06, -0.15] }).W(2.4)
    .C((A, F) => { F.hide('sign'); F.walk('jasper', pod('josh').x - 0.5, pod('josh').z - 0.95, { speed: 1.8 }); F.walk('josh', pod('josh').x + 0.1, pod('josh').z - 0.95, { speed: 1.2 }); }).W(2.6)
    .C((A, F) => { F.face('jasper', 'josh'); F.face('josh', 'jasper'); A.jasper.gest('hug', { hold: true }); A.josh.gest('hug', { hold: true }); aww(A, F); }).S(two('jasper', 'josh', 2.0)).W(1.4)
    .L('jasper', '哥哥！你是冠軍！You’re the champion！', 'Brother! You’re the champion! You’re the champion!', 'excited', { keep: true })
    .C(clap(5)).W(1.6);
});

// ================================================================ 7 尾聲
scene({ set: 'studio', tod: 'night', focus: [0, 0], place: { ...placeAll(), josh: { x: pod('josh').x + 0.1, z: pod('josh').z - 0.95, yaw: 0 }, jasper: { x: pod('josh').x - 0.5, z: pod('josh').z - 0.95, yaw: 0.3 } },
  setup: (A, F) => { SCORES([2000, 0, 3000, 200, 400, 300])(A, F); set(F).screen('win', { name: 'Josh', sub: '加州聖地牙哥' }); } }, (sc) => {
  sc.S(HOSTW)
    .L('host', '恭喜 Josh！Emily 也非常棒，給她掌聲！', 'Congratulations, Josh! And Emily was brilliant too — a big hand for her!', 'happy', { keep: true, cue: clap(4), at: 2 })
    .L('emily', 'Next year 我一定會贏！我回去要寫一百個「媽」！', 'Next year I’m totally winning! I’m going home to write “ma” a hundred times!', 'proud', { shot: close('emily') })
    .C(laugh(0.7)).W(0.8)
    .L('jasper', '哥哥，冠軍有獎金嗎？可以分我一半嗎？', 'Brother, is there prize money? Can I have half?', 'excited', { shot: two('jasper', 'josh', 2.2) })
    .L('josh', '要分可以，你要先說「請」。', 'You can — but you have to say “please” first.', 'calm', { keep: true })
    .L('jasper', '請……請你分我一半，我會一直吻你！', 'Please… please give me half, and I’ll kiss you all day!', 'excited', { keep: true })
    .C(laugh(2.4, ['host', 'kevin', 'ethan', 'mei'])).C((A) => A.josh.gest('scared'), 0.3).W(2.2)
    .L('josh', '是「問」！一直問我！不是吻！', 'It’s “ask”! Ask me all day! Not kiss!', 'shout', { shot: close('josh') })
    .C(laugh(2)).W(1.8)
    .L('host', '看來弟弟明年也要來報名了。我的耳朵，要先去補習。', 'Looks like little brother’s signing up next year. My ears need lessons first.', 'happy', { shot: close('host', { dist: 1.7 }) })
    .C(laugh(1.4)).W(1.2)
    .L('host', '《一字千金》ABC 海外特別節目，我們下次見！', 'That’s A Word Worth Gold, the ABC special — see you next time!', 'excited', { shot: MASTER, cue: (A) => { A.host.gest('wave'); for (const n of ['josh', 'jasper', 'emily', 'kevin', 'ethan', 'sophie', 'mei']) A[n].gest('wave'); }, at: 0.6 })
    .C(clap(6)).C((A, F) => { F.sfx('jingle'); set(F).lights('party'); }, 0.4)
    .S({ kind: 'at', pos: [0, 4.4, 9.4], look: [0, 1.6, -3.5], fov: 50, drift: [0, 0.08, 0.1] }).W(6.0);
});

// ---------------------------------------------------------------- laid end to end
let T0 = 0; const lines = [], cues = [], shots = [], scenes = [], say = [];
for (const s of SCENES) {
  scenes.push({ t: T0, set: s.set, tod: s.tod, ambience: s.ambience, focus: s.focus, caption: s.caption, place: s.place, room: STUDIO.room, setup: s.setup });
  for (const [t, ...r] of s.lines) lines.push([T0 + t, ...r]); say.push(...s.say);
  for (const [t, f] of s.cues) cues.push([T0 + t, f]);
  for (const [t, sh] of s.shots) shots.push([T0 + t, sh]);
  T0 += s.len;
}
cues.sort((a, b) => a[0] - b[0]); shots.sort((a, b) => a[0] - b[0]);
export const ABC1 = {
  id: 'abc1', len: T0, voiced: true, audioV: 1, pace: 0, scenes, lines, cues, shots, say,
  samplesV: 1, samples: ['applause_long', 'drumroll26', 'drumroll22', 'drumroll16', ...Object.entries(TAKES).flatMap(([b, n]) => Array.from({ length: n }, (_, i) => b + (i + 1)))],
  title: { zh: ['一字千金', 'ABC 海外特別節目'], en: ['A Word Worth Gold', 'The ABC Special'] },
  end: { zh: '《一字千金》ABC 海外特別節目　完', en: 'The End' },
  blurb: { zh: '住在加州聖地牙哥的十歲 Josh，一個人去參加《一字千金》ABC 海外特別節目！紐約的 Emily、德州牛仔 Kevin、倫敦的「BBC」Ethan、溫哥華一直說 sorry 的 Sophie、澳洲的「另一個 ABC」Mei……睡覺可以吃嗎？可以吻你一個問題嗎？弟弟 Jasper 在台下舉牌「哥哥加油，Add oil！」，決賽最後一題，一個「媽」字定勝負。', en: 'Ten-year-old Josh from San Diego goes on A Word Worth Gold, the ABC special — against Emily from New York, Kevin the Texan, Ethan the “BBC”, Sophie the always-sorry Canadian and Mei, the other ABC. Can you eat sleep? May I kiss you a question? His little brother Jasper holds up a sign in the front row, and the final comes down to one character: 媽.' },
  cast: {
    host: ['host', { team: 'show' }], emily: ['emily', { team: 'show' }], kevin: ['kevin', { team: 'show' }], josh: ['josh', { team: 'show' }], ethan: ['ethan', { team: 'show' }],
    sophie: ['sophie', { team: 'show' }], mei: ['mei', { team: 'show' }], jasper: ['jasper', { team: 'show' }], jeff: ['jeff', { team: 'show' }], erin: ['erin', { team: 'show' }],
  },
};
