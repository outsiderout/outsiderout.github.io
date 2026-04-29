import { create } from 'zustand';
import { IMAGES } from '../assets/images';

export type Race = 'human' | 'elf' | 'orc' | 'dwarf' | 'undead';
export type Screen =
  | 'splash' | 'create-char' | 'hub'
  | 'arena' | 'arena-fight'
  | 'explore' | 'dungeon' | 'dungeon-fight'
  | 'inventory' | 'craft' | 'profile'
  | 'guild' | 'guild-war' | 'guild-create' | 'guild-diplomacy' | 'guild-raids' | 'guild-map'
  | 'shop' | 'quests' | 'rankings'
  | 'achievements' | 'daily';

export type EquipSlot = 'leftHand' | 'rightHand' | 'head' | 'body' | 'legs' | 'ring';
export type Handedness = '1h' | '2h';
export type BodyPart = 'head' | 'torso' | 'arms' | 'legs';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type GuildRank = 'leader' | 'officer' | 'veteran' | 'member' | 'recruit';

export interface Stats { strength: number; agility: number; fury: number; luck: number; revenge: number; constitution: number; }

export interface Item {
  id: string; name: string; slot: EquipSlot; handedness?: Handedness;
  type: 'weapon' | 'shield' | 'armor' | 'ring' | 'material';
  rarity: Rarity; stats: Partial<Stats>; level: number; icon: string;
  equipped?: boolean; equippedSlot?: EquipSlot;
}

export interface CraftRecipe {
  id: string; name: string; slot: EquipSlot; handedness?: Handedness;
  type: 'weapon' | 'shield' | 'armor' | 'ring';
  rarity: Rarity; level: number; icon: string; stats: Partial<Stats>;
  materialCosts: { iron: number; wood: number; leather: number; magic: number }; goldCost: number;
}

export interface Fighter {
  id: string; name: string; race: Race; level: number; stats: Stats;
  hp: number; maxHp: number; cp: number; maxCp: number; avatar: string; isBoss?: boolean;
}

export interface CombatAction { attackTarget: BodyPart; blockTarget: BodyPart; }

export interface CombatRound {
  round: number; playerAction: CombatAction; enemyAction: CombatAction;
  playerDmg: number; enemyDmg: number; playerDmgTaken: number; enemyDmgTaken: number;
  playerBlocked: boolean; enemyBlocked: boolean; playerDodge: boolean; enemyDodge: boolean;
  playerCrit: boolean; enemyCrit: boolean; playerCounter: boolean; enemyCounter: boolean;
  playerLuckBreak: boolean; enemyLuckBreak: boolean; narrative: string[];
}

export interface Guild { id: string; name: string; tag: string; level: number; treasury: number; members: { name: string; power: number }[]; }

export interface MapTile {
  id: number; name: string; icon: string;
  status: 'empty' | 'monster' | 'claimed'; ownerTag?: string; powerNeeded: number; bonus: string;
}

export interface Quest { id: string; title: string; desc: string; reward: string; progress: number; total: number; done: boolean; type?: 'daily' | 'weekly' | 'story'; }
export interface Achievement { id: string; icon: string; title: string; desc: string; progress: number; total: number; done: boolean; rewardGold: number; rewardDiamond: number; }
export interface DailyReward { day: number; icon: string; reward: string; claimed: boolean; }

export interface GameState {
  screen: Screen; playerName: string; playerRace: Race | null;
  level: number; xp: number; xpToNext: number; gold: number; diamonds: number;
  baseStats: Stats; freePoints: number; hp: number; maxHp: number;
  energy: number; maxEnergy: number; wins: number; losses: number;
  inventory: Item[]; materials: { iron: number; wood: number; leather: number; magic: number };
  equipped: Partial<Record<EquipSlot, Item>>;
  currentEnemy: Fighter | null; combatRounds: CombatRound[]; combatPhase: 'select' | 'done';
  playerHpCombat: number; enemyHpCombat: number; combatResult: 'win' | 'lose' | null;
  combatRewards: { xp: number; gold: number; item?: Item } | null;
  dungeon: { tierId: string; phase: 'map' | 'combat' | 'result'; currentRoomIndex: number; rooms: any[]; dungeonGold: number; dungeonXp: number; playerDungeonHp: number; playerDungeonMaxHp: number; eventLog: string[] };
  mapTiles: MapTile[]; playerGuild: Guild | null; guildNotifications: string[];
  quests: Quest[]; achievements: Achievement[]; dailyRewards: DailyReward[]; currentDay: number;
  notification: { text: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
}

// ============ КОНСТАНТЫ ============

export const RACE_INFO: Record<Race, { nameRu: string; img: string; icon: string; bonus: string; startStats: Stats; lore: string }> = {
  human: { nameRu: 'Человек', img: IMAGES.heroHuman, icon: '👨', bonus: '+3 Сила, +2 Удача', startStats: { strength: 8, agility: 6, fury: 5, luck: 7, revenge: 5, constitution: 6 }, lore: 'Тактические гении. Сила и удача.' },
  elf: { nameRu: 'Эльф', img: IMAGES.heroElf, icon: '🧝', bonus: '+4 Ловкость, +1 Ярость', startStats: { strength: 5, agility: 9, fury: 6, luck: 6, revenge: 4, constitution: 5 }, lore: 'Мастера уклонений. Быстры и опасны.' },
  orc: { nameRu: 'Орк', img: IMAGES.heroOrc, icon: '👹', bonus: '+4 Сила, +2 Месть', startStats: { strength: 10, agility: 4, fury: 5, luck: 4, revenge: 7, constitution: 6 }, lore: 'Неостановимая ярость. Бьют сильнее всех.' },
  dwarf: { nameRu: 'Гном', img: IMAGES.heroDwarf, icon: '🧔', bonus: '+4 Комплектация, +2 Месть', startStats: { strength: 6, agility: 4, fury: 4, luck: 6, revenge: 7, constitution: 10 }, lore: 'Несокрушимые. Огромный запас здоровья.' },
  undead: { nameRu: 'Нежить', img: IMAGES.heroUndead, icon: '💀', bonus: '+4 Ярость, +2 Ловкость', startStats: { strength: 5, agility: 7, fury: 9, luck: 4, revenge: 6, constitution: 5 }, lore: 'Берсерки смерти. Сокрушительные криты.' },
};

export const STAT_LABELS: Record<keyof Stats, string> = { strength: 'Сила', agility: 'Ловкость', fury: 'Ярость', luck: 'Удача', revenge: 'Месть', constitution: 'Комплект' };
export const BODY_PARTS: BodyPart[] = ['head', 'torso', 'arms', 'legs'];
export const BODY_LABELS: Record<BodyPart, string> = { head: 'Голову', torso: 'Торс', arms: 'Руки', legs: 'Ноги' };

export const DUNGEON_TIERS = [
  { id: 'dt1', name: 'Гоблинские Шахты', emoji: '⛏️', minLevel: 1, description: 'Рудники. Начальная добыча.' },
  { id: 'dt2', name: 'Катакомбы Смерти', emoji: '💀', minLevel: 5, description: 'Некрополь. Продвинутые ресурсы.' },
];

export const MAP_TILES: MapTile[] = [
  { id: 0, name: 'Деревня Ремесленников', icon: '🏘️', status: 'empty', powerNeeded: 0, bonus: 'Бесплатный вход', ownerTag: undefined },
  { id: 1, name: 'Орочьи Поля', icon: '⚔️', status: 'monster', powerNeeded: 1000, bonus: 'Пища +20' },
  { id: 2, name: 'Золотые Копи', icon: '⛏️', status: 'monster', powerNeeded: 2000, bonus: '+50 золота в день' },
  { id: 3, name: 'Башня Мага', icon: '🔮', status: 'monster', powerNeeded: 3500, bonus: 'Свитки магии' },
  { id: 4, name: 'Лагерь Лесорубов', icon: '🪵', status: 'monster', powerNeeded: 1500, bonus: 'Древесина +5' },
  { id: 5, name: 'Тёмный Замок', icon: '🏰', status: 'monster', powerNeeded: 5000, bonus: 'Легендарный лут' },
];

export const CRAFT_RECIPES: CraftRecipe[] = [
  { id: 'cr1', name: 'Меч Новичка', slot: 'leftHand', handedness: '1h', type: 'weapon', rarity: 'common', level: 1, icon: '🗡️', stats: { strength: 8 }, materialCosts: { iron: 3, wood: 1, leather: 0, magic: 0 }, goldCost: 50 },
  { id: 'cr2', name: 'Щит Ополченца', slot: 'rightHand', handedness: '1h', type: 'shield', rarity: 'common', level: 1, icon: '🛡️', stats: { constitution: 8 }, materialCosts: { iron: 2, wood: 2, leather: 1, magic: 0 }, goldCost: 50 },
  { id: 'cr3', name: 'Двуручный Меч', slot: 'leftHand', handedness: '2h', type: 'weapon', rarity: 'uncommon', level: 3, icon: '⚔️', stats: { strength: 20, fury: 5 }, materialCosts: { iron: 8, wood: 4, leather: 0, magic: 0 }, goldCost: 200 },
  { id: 'cr4', name: 'Стальной Шлем', slot: 'head', type: 'armor', rarity: 'uncommon', level: 2, icon: '🪖', stats: { constitution: 12 }, materialCosts: { iron: 5, wood: 0, leather: 2, magic: 0 }, goldCost: 150 },
  { id: 'cr5', name: 'Тяжёлая Кираса', slot: 'body', type: 'armor', rarity: 'uncommon', level: 4, icon: '🛡️', stats: { constitution: 20, strength: 5 }, materialCosts: { iron: 10, wood: 2, leather: 4, magic: 0 }, goldCost: 300 },
];

export const SHOP_ITEMS: Item[] = [
  { id: 's1', name: 'Железный Меч', slot: 'leftHand', handedness: '1h', type: 'weapon', rarity: 'common', stats: { strength: 10 }, level: 1, icon: '🗡️' },
  { id: 's2', name: 'Простой Щит', slot: 'rightHand', handedness: '1h', type: 'shield', rarity: 'common', stats: { constitution: 10 }, level: 1, icon: '🛡️' },
  { id: 's3', name: 'Двуручная Секира', slot: 'leftHand', handedness: '2h', type: 'weapon', rarity: 'rare', stats: { strength: 30, fury: 10 }, level: 4, icon: '⛏️' },
  { id: 's4', name: 'Кожаные Штаны', slot: 'legs', type: 'armor', rarity: 'common', stats: { constitution: 8 }, level: 1, icon: '👖' },
  { id: 's5', name: 'Перстень Удачи', slot: 'ring', type: 'ring', rarity: 'rare', stats: { luck: 15, agility: 5 }, level: 3, icon: '💍' },
];

export const DEFAULT_QUESTS: Quest[] = [
  { id: 'qd1', title: 'Первая добыча', desc: 'Собери 5 единиц железной руды', reward: '200💰, 100 XP', progress: 0, total: 5, done: false },
  { id: 'qd2', title: 'Победитель Арены', desc: 'Одержи победу в PvP', reward: '300💰, 150 XP', progress: 0, total: 1, done: false },
  { id: 'qd3', title: 'Крафтер', desc: 'Создай предмет в Кузнице', reward: '250💰, 100 XP', progress: 0, total: 1, done: false },
  { id: 'qw1', title: 'Захватчик Земель', desc: 'Захвати территорию на карте', reward: '1000💰, 500 XP', progress: 0, total: 1, done: false, type: 'weekly' as const },
  { id: 'qw2', title: 'Охотник за головами', desc: 'Победи 5 врагов в данжах', reward: '1500💰, 750 XP', progress: 0, total: 5, done: false, type: 'weekly' as const },
];

DEFAULT_QUESTS.forEach((q: any) => { if (!q.type) q.type = 'daily'; });

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', icon: '⚔️', title: 'Первый бой', desc: 'Проведи бой на Арене', progress: 0, total: 1, done: false, rewardGold: 100, rewardDiamond: 1 },
  { id: 'a2', icon: '🏆', title: 'Ветеран Арены', desc: 'Одержи 10 побед', progress: 0, total: 10, done: false, rewardGold: 500, rewardDiamond: 3 },
  { id: 'a3', icon: '⛏️', title: 'Шахтёр', desc: 'Добудь 50 руды', progress: 0, total: 50, done: false, rewardGold: 300, rewardDiamond: 2 },
  { id: 'a4', icon: '🏰', title: 'Завоеватель', desc: 'Захвати 3 территории', progress: 0, total: 3, done: false, rewardGold: 1000, rewardDiamond: 5 },
  { id: 'a5', icon: '⭐', title: 'Легенда', desc: 'Достигни 20 уровня', progress: 1, total: 20, done: false, rewardGold: 5000, rewardDiamond: 10 },
  { id: 'a6', icon: '🔨', title: 'Кузнец', desc: 'Создай 5 предметов', progress: 0, total: 5, done: false, rewardGold: 400, rewardDiamond: 2 },
];

export const DEFAULT_DAILY_REWARDS: DailyReward[] = [
  { day: 1, icon: '💰', reward: '100 золота', claimed: false },
  { day: 2, icon: '⚡', reward: 'Энергия +1', claimed: false },
  { day: 3, icon: '💰', reward: '200 золота', claimed: false },
  { day: 4, icon: '🎁', reward: 'Случайный предмет', claimed: false },
  { day: 5, icon: '💎', reward: '1 Кристалл', claimed: false },
  { day: 6, icon: '💰', reward: '500 золота', claimed: false },
  { day: 7, icon: '👑', reward: 'Легендарный Сундук', claimed: false },
];

// ============ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ============

export function calcMaxHp(stats: Stats, level: number) { return stats.constitution * 5 + 50 + level * 10; }
export function calcPower(stats: Stats, level: number) { return (stats.strength + stats.agility + stats.fury + stats.luck + stats.revenge + stats.constitution) * 2 + level * 10; }

const DB_KEY = 'rageline_final_v2';

function generateEnemy(level: number): Fighter {
  const races: Race[] = ['human', 'elf', 'orc', 'dwarf', 'undead'];
  const race = races[Math.floor(Math.random() * races.length)];
  const luciferNames = ['Тёмный Страж', 'Гоблин-Воин', 'Скелет-Лучник', 'Дикий Зверь', 'Проклятый Рыцарь'];
  const stats: Stats = { strength: 6 + Math.floor(Math.random() * 5) + level, agility: 4 + Math.floor(Math.random() * 5) + level, fury: 3 + Math.floor(Math.random() * 5) + level, luck: 2 + Math.floor(Math.random() * 5), revenge: 2 + Math.floor(Math.random() * 5), constitution: 4 + Math.floor(Math.random() * 4) + level };
  const hp = calcMaxHp(stats, level);
  return { id: 'e1', name: luciferNames[Math.floor(Math.random() * luciferNames.length)], race, level, stats, hp, maxHp: hp, cp: 0, maxCp: 0, avatar: RACE_INFO[race].img };
}

function calcDamage(attacker: Stats, defender: Stats) {
  let dmg = Math.max(1, attacker.strength + Math.floor(Math.random() * 5));
  let crit = false, dodge = false, counter = false;
  const dodgeChance = Math.min(40, defender.agility * 1.2);
  if (Math.random() * 100 < dodgeChance) { dodge = true; dmg = 0; }
  const critChance = Math.min(40, attacker.fury * 1.2);
  if (!dodge && Math.random() * 100 < critChance) { crit = true; dmg = Math.floor(dmg * 2); }
  const counterChance = Math.min(35, defender.revenge * 1.5);
  if (Math.random() * 100 < counterChance) counter = true;
  return { dmg: dodge ? 0 : Math.max(1, dmg), crit, dodge, counter };
}

// ============ STORE ============

interface GameStateActions {
  setScreen: (s: Screen) => void;
  createCharacter: (name: string, race: Race, stats: Stats) => void;
  findOpponent: () => void;
  executeCombatRound: (action: CombatAction) => void;
  finishCombat: () => void;
  enterDungeon: () => void;
  exploreRoom: () => void;
  executeDungeonCombatRound: (action: CombatAction) => void;
  finishDungeonRoom: () => void;
  abandonDungeon: () => void;
  equipItem: (id: string, hand?: EquipSlot) => void;
  unequipItem: (slot: EquipSlot) => void;
  sellItem: (id: string) => void;
  buyItem: (item: Item, costGold: number) => void;
  craftItem: (recipe: CraftRecipe) => void;
  captureTile: (id: number) => void;
  claimQuest: (id: string) => void;
  claimAchievement: (id: string) => void;
  claimDaily: (day: number) => void;
  regen: () => void;
  showNotif: (text: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

type Combined = GameState & GameStateActions;

export const useGameStore = create<Combined>((set, get) => {
  const saved = localStorage.getItem(DB_KEY);
  const initial = saved ? JSON.parse(saved) : null;

  return {
    screen: initial?.screen || 'splash', playerName: initial?.playerName || '', playerRace: initial?.playerRace || null,
    level: initial?.level || 1, xp: initial?.xp || 0, xpToNext: initial?.xpToNext || 100, gold: initial?.gold || 300, diamonds: initial?.diamonds || 5,
    baseStats: initial?.baseStats || { strength: 5, agility: 5, fury: 5, luck: 5, revenge: 5, constitution: 5 }, freePoints: 0,
    hp: initial?.hp || 100, maxHp: initial?.maxHp || 100, energy: initial?.energy || 10, maxEnergy: 10,
    wins: initial?.wins || 0, losses: initial?.losses || 0,
    inventory: initial?.inventory || [], materials: initial?.materials || { iron: 0, wood: 0, leather: 0, magic: 0 },
    equipped: initial?.equipped || {},
    currentEnemy: null, combatRounds: [], combatPhase: 'select', playerHpCombat: 100, enemyHpCombat: 100, combatResult: null, combatRewards: null,
    dungeon: { tierId: '', phase: 'map', currentRoomIndex: 0, rooms: [], dungeonGold: 0, dungeonXp: 0, playerDungeonHp: 100, playerDungeonMaxHp: 100, eventLog: [] },
    mapTiles: initial?.mapTiles || MAP_TILES.map(t => ({ ...t })),
    playerGuild: initial?.playerGuild || null,
    guildNotifications: [],
    quests: initial?.quests || DEFAULT_QUESTS.map(q => ({ ...q })),
    achievements: initial?.achievements || DEFAULT_ACHIEVEMENTS.map(a => ({ ...a })),
    dailyRewards: initial?.dailyRewards || DEFAULT_DAILY_REWARDS.map(d => ({ ...d })),
    currentDay: initial?.currentDay || 1,
    notification: null,

    setScreen: (s) => set({ screen: s }),

    showNotif: (text, type) => { set({ notification: { text, type } }); setTimeout(() => set({ notification: null }), 3000); },

    createCharacter: (name, race, stats) => {
      const mhp = calcMaxHp(stats, 1);
      const state = { playerName: name, playerRace: race, baseStats: stats, hp: mhp, maxHp: mhp, screen: 'hub' as Screen, gold: 300, materials: { iron: 3, wood: 3, leather: 0, magic: 0 } };
      set(state);
      localStorage.setItem(DB_KEY, JSON.stringify({ ...get(), ...state }));
    },

    findOpponent: () => {
      const s = get();
      if (s.energy < 1) { get().showNotif('Нет энергии!', 'warning'); return; }
      const enemy = generateEnemy(s.level);
      set({ currentEnemy: enemy, combatRounds: [], combatPhase: 'select', playerHpCombat: s.maxHp, enemyHpCombat: enemy.maxHp, combatResult: null, combatRewards: null, energy: s.energy - 1, screen: 'arena-fight' });
    },

    executeCombatRound: (action) => {
      const s = get();
      if (!s.currentEnemy) return;
      const enemy = s.currentEnemy;
      const eAction: CombatAction = { attackTarget: BODY_PARTS[Math.floor(Math.random() * 4)], blockTarget: BODY_PARTS[Math.floor(Math.random() * 4)] };
  let pDMG = calcDamage(s.baseStats, enemy.stats).dmg;
      const eDmgR = calcDamage(enemy.stats, s.baseStats);
      
      let pDmg = pDMG;
      if (action.attackTarget === eAction.blockTarget) pDmg = Math.max(1, Math.floor(pDmg * 0.25));
      let eDmg = eDmgR.dmg;
      if (eAction.attackTarget === action.blockTarget) eDmg = Math.max(1, Math.floor(eDmg * 0.25));
      
      const newEHp = Math.max(0, s.enemyHpCombat - pDmg);
      const newPHp = Math.max(0, s.playerHpCombat - eDmg);
      const done = newPHp <= 0 || newEHp <= 0;
      const won = newEHp <= 0 && newPHp > 0;

      set({
        combatRounds: [...s.combatRounds, { round: s.combatRounds.length + 1, playerAction: action, enemyAction: eAction, playerDmg: pDmg, enemyDmg: eDmg, playerDmgTaken: eDmg, enemyDmgTaken: pDmg, playerBlocked: eAction.attackTarget === action.blockTarget, enemyBlocked: action.attackTarget === eAction.blockTarget, playerDodge: false, enemyDodge: false, playerCrit: false, enemyCrit: false, playerCounter: false, enemyCounter: false, playerLuckBreak: false, enemyLuckBreak: false, narrative: [`Ты нанёс ${pDmg} урона ${BODY_LABELS[action.attackTarget]}`, `Враг нанёс ${eDmg} урона ${BODY_LABELS[eAction.attackTarget]}`] as string[] }],
        playerHpCombat: newPHp, enemyHpCombat: newEHp, combatPhase: done ? 'done' : 'select', combatResult: done ? (won ? 'win' : 'lose') : null, combatRewards: done && won ? { xp: 30 + enemy.level * 10, gold: 40 + enemy.level * 15 } : null
      });
    },

    finishCombat: () => {
      const s = get(); const r = s.combatResult;
      let { xp, gold, level, wins, losses, xpToNext, freePoints } = s;
      if (r === 'win' && s.combatRewards) {
        xp += s.combatRewards.xp; gold += s.combatRewards.gold; wins++;
        while (xp >= xpToNext) { xp -= xpToNext; level++; xpToNext = Math.floor(xpToNext * 1.4); freePoints += 3; }
      } else losses++;
      set({ screen: 'hub', xp, gold, level, wins, losses, xpToNext, freePoints, currentEnemy: null, combatRounds: [] });
      localStorage.setItem(DB_KEY, JSON.stringify({ ...get(), xp, gold, level, wins, losses, xpToNext }));
    },

    enterDungeon: () => {
      const s = get(); if (s.energy < 1) return;
      set({ screen: 'dungeon', energy: s.energy - 1, dungeon: { tierId: 'dt1', phase: 'map', currentRoomIndex: 0, rooms: [{ type: 'combat' }, { type: 'treasure' }, { type: 'combat' }, { type: 'rest' }, { type: 'combat' }], dungeonGold: 0, dungeonXp: 0, playerDungeonHp: s.maxHp, playerDungeonMaxHp: s.maxHp, eventLog: ['Подземелье начато!'] } });
    },

    exploreRoom: () => {
      const d = get().dungeon; const room = d.rooms[d.currentRoomIndex];
      if (room.type === 'rest') {
        const ni = d.currentRoomIndex + 1;
        set({ dungeon: { ...d, playerDungeonHp: d.playerDungeonMaxHp, currentRoomIndex: ni >= d.rooms.length ? d.currentRoomIndex : ni, phase: ni >= d.rooms.length ? 'result' : 'map' } });
      } else if (room.type === 'treasure') {
        const newMats = { ...get().materials, iron: get().materials.iron + 2, wood: get().materials.wood + 2 };
        const ni = d.currentRoomIndex + 1; set({ materials: newMats, dungeon: { ...d, currentRoomIndex: ni >= d.rooms.length ? d.currentRoomIndex : ni, phase: ni >= d.rooms.length ? 'result' : 'map' } });
      } else { set({ screen: 'dungeon-fight', currentEnemy: generateEnemy(get().level), combatPhase: 'select', playerHpCombat: d.playerDungeonHp, enemyHpCombat: 80 }); }
    },

    executeDungeonCombatRound: (a) => get().executeCombatRound(a),

    finishDungeonRoom: () => {
      const s = get(); const d = s.dungeon; const ni = d.currentRoomIndex + 1; const done = ni >= d.rooms.length;
      const mats = { ...s.materials, iron: s.materials.iron + 1, wood: s.materials.wood + 1 };
      set({ screen: 'dungeon', materials: mats, dungeon: { ...d, currentRoomIndex: done ? d.currentRoomIndex : ni, phase: done ? 'result' : 'map', dungeonGold: d.dungeonGold + 30, dungeonXp: d.dungeonXp + 20 }, currentEnemy: null, combatRounds: [] });
      localStorage.setItem(DB_KEY, JSON.stringify({ ...get(), materials: mats }));
    },

    abandonDungeon: () => { const s = get(); const d = s.dungeon; set({ gold: s.gold + d.dungeonGold, xp: s.xp + d.dungeonXp, screen: 'hub' }); localStorage.setItem(DB_KEY, JSON.stringify({ ...get(), gold: s.gold + d.dungeonGold, xp: s.xp + d.dungeonXp })); },

    equipItem: (id, hand) => {
      const s = get(); const item = s.inventory.find(i => i.id === id); if (!item || item.type === 'material') return;
      const eq = { ...s.equipped }; let inv = [...s.inventory];
      if (item.handedness === '2h') {
        if (eq.leftHand) inv.push({ ...eq.leftHand, equipped: false }); if (eq.rightHand) inv.push({ ...eq.rightHand, equipped: false });
        eq.leftHand = { ...item, equipped: true, equippedSlot: 'leftHand' }; delete eq.rightHand;
      } else if (item.type === 'weapon' || item.type === 'shield') {
        const target: EquipSlot = hand || 'leftHand';
        if (eq[target]) inv.push({ ...eq[target]!, equipped: false });
        if (eq.leftHand?.handedness === '2h') { inv.push({ ...eq.leftHand, equipped: false }); delete eq.leftHand; delete eq.rightHand; }
        eq[target] = { ...item, equipped: true, equippedSlot: target };
      } else {
        if (eq[item.slot]) inv.push({ ...eq[item.slot]!, equipped: false });
        eq[item.slot] = { ...item, equipped: true, equippedSlot: item.slot };
      }
      set({ equipped: eq, inventory: inv.filter(i => i.id !== id) });
      localStorage.setItem(DB_KEY, JSON.stringify({ ...get(), equipped: eq, inventory: inv.filter(i => i.id !== id) }));
    },

    unequipItem: (slot) => {
      const s = get(); const item = s.equipped[slot]; if (!item) return;
      const eq = { ...s.equipped }; delete eq[slot];
      if (item.handedness === '2h') { delete eq.rightHand; delete eq.leftHand; }
      set({ equipped: eq, inventory: [...s.inventory, { ...item, equipped: false }] });
      localStorage.setItem(DB_KEY, JSON.stringify({ ...get(), equipped: eq, inventory: [...s.inventory, { ...item, equipped: false }] }));
    },

    sellItem: (id) => {
      const s = get(); const item = s.inventory.find(i => i.id === id); if (!item) return;
      const u = { inventory: s.inventory.filter(i => i.id !== id), gold: s.gold + (item.level * 25) };
      set(u); localStorage.setItem(DB_KEY, JSON.stringify({ ...get(), ...u }));
    },

    buyItem: (item, cost) => {
      const s = get(); if (s.gold < cost) { get().showNotif('Недостаточно золота!', 'error'); return; }
      const u = { gold: s.gold - cost, inventory: [...s.inventory, { ...item, id: Math.random().toString(36).substring(2, 9) }] };
      set(u); localStorage.setItem(DB_KEY, JSON.stringify({ ...get(), ...u }));
    },

    craftItem: (recipe) => {
      const s = get(); const m = s.materials; const c = recipe.materialCosts;
      if (m.iron < c.iron || m.wood < c.wood || m.leather < c.leather || m.magic < c.magic || s.gold < recipe.goldCost) { get().showNotif('Не хватает ресурсов!', 'error'); return; }
      const newMats = { iron: m.iron - c.iron, wood: m.wood - c.wood, leather: m.leather - c.leather, magic: m.magic - c.magic };
      const newItem: Item = { id: Math.random().toString(36).substring(2, 9), name: recipe.name, slot: recipe.slot, handedness: recipe.handedness, type: recipe.type, rarity: recipe.rarity, level: recipe.level, icon: recipe.icon, stats: recipe.stats };
      const u = { gold: s.gold - recipe.goldCost, materials: newMats, inventory: [...s.inventory, newItem] };
      set(u); localStorage.setItem(DB_KEY, JSON.stringify({ ...get(), ...u }));
      get().showNotif(`Выковано: ${recipe.name}!`, 'success');
    },

    captureTile: (id) => {
      const s = get();
      const newTiles = s.mapTiles.map(t => t.id === id ? { ...t, status: 'claimed' as const, ownerTag: s.playerGuild?.tag || 'Твой Союз' } : t);
      set({ mapTiles: newTiles });
      localStorage.setItem(DB_KEY, JSON.stringify({ ...get(), mapTiles: newTiles }));
      get().showNotif('Территория захвачена!', 'success');
    },

    claimQuest: (id) => {
      const s = get(); const q = s.quests.find(q => q.id === id); if (!q || q.done || q.progress < q.total) return;
      const u = { quests: s.quests.map(qq => qq.id === id ? { ...qq, done: true } : qq), gold: s.gold + 200, xp: s.xp + 100 };
      set(u); localStorage.setItem(DB_KEY, JSON.stringify({ ...get(), ...u }));
      get().showNotif(`Задание выполнено: ${q.title}!`, 'success');
    },

    claimAchievement: (id) => {
      const s = get(); const a = s.achievements.find(a => a.id === id); if (!a || a.done || a.progress < a.total) return;
      const u = { achievements: s.achievements.map(aa => aa.id === id ? { ...aa, done: true } : aa), gold: s.gold + a.rewardGold, diamonds: s.diamonds + a.rewardDiamond };
      set(u); localStorage.setItem(DB_KEY, JSON.stringify({ ...get(), ...u }));
      get().showNotif(`Достижение получено: ${a.title}!`, 'success');
    },

    claimDaily: (day) => {
      const s = get(); const dr = s.dailyRewards.find(d => d.day === day); if (!dr || dr.claimed || day > s.currentDay) return;
      let u: any = { dailyRewards: s.dailyRewards.map(dd => dd.day === day ? { ...dd, claimed: true } : dd), currentDay: Math.max(s.currentDay, day + 1) };
      switch (day) { case 3: case 6: u.gold = s.gold + parseInt(dr.reward); break; case 2: u.energy = s.energy + 1; break; case 5: u.diamonds = s.diamonds + 1; break; default: u.gold = s.gold + 100; break; }
      set(u); localStorage.setItem(DB_KEY, JSON.stringify({ ...get(), ...u }));
      get().showNotif(`Награда дня ${day} получена!`, 'success');
    },

    regen: () => set(s => ({ energy: Math.min(10, s.energy + 1) })),
  };
});
