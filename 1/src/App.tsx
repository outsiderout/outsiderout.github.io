import { useEffect, useState } from 'react';
import { useGameStore, RACE_INFO, STAT_LABELS, BODY_PARTS, BODY_LABELS, calcPower, DUNGEON_TIERS, CRAFT_RECIPES, SHOP_ITEMS, type Race, type Screen, type BodyPart, type Stats, type EquipSlot } from './store/gameStore';

/* ─── NOTIFICATION ─── */
function Notification() {
  const n = useGameStore(s => s.notification);
  if (!n) return null;
  const bg: Record<string, string> = { success: 'border-green/40 bg-green/10', error: 'border-red/40 bg-red/10', info: 'border-blue/40 bg-blue/10', warning: 'border-orange/40 bg-orange/10' };
  const icon: Record<string, string> = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  return <div className={`fixed top-2 left-2 right-2 z-[200] anim-slide-down border rounded-xl px-4 py-3 flex items-center gap-2 backdrop-blur-md ${bg[n.type] || ''}`}>
    <span>{icon[n.type] || ''}</span><span className="text-sm flex-1">{n.text}</span>
  </div>;
}

/* ─── BOTTOM NAV ─── */
function BottomNav() {
  const { screen, setScreen, playerGuild } = useGameStore();
  const tabs: { s: Screen; icon: string; label: string }[] = [
    { s: 'hub', icon: '🏠', label: 'Город' },
    { s: 'explore', icon: '🗺️', label: 'Данжи' },
    { s: 'arena', icon: '⚔️', label: 'Арена' },
    { s: 'inventory', icon: '🎒', label: 'Лут' },
    { s: 'guild', icon: '🏰', label: 'Гильдия' },
  ];
  return <div className="fixed bottom-0 left-0 right-0 bg-bg2/95 backdrop-blur-sm border-t border-accent/15 z-50">
    <div className="flex justify-around max-w-lg mx-auto">
      {tabs.map(t => {
        const active = screen === t.s || (t.s === 'explore' && ['explore', 'dungeon', 'dungeon-fight'].includes(screen)) || (t.s === 'guild' && ['guild','guild-war','guild-create','guild-diplomacy','guild-raids','guild-map'].includes(screen));
        return <button key={t.s} onClick={() => { if (t.s === 'guild' && !playerGuild) setScreen('guild-create'); else setScreen(t.s); }} className={`flex flex-col items-center py-2 px-3 transition-all ${active ? 'text-accent font-bold' : 'text-gray-500 hover:text-gray-400'}`}>
          <span className="text-lg">{t.icon}</span>
          <span className="text-[10px] mt-0.5">{t.label}</span>
        </button>;
      })}
    </div>
  </div>;
}

/* ─── HUD ─── */
function HUD() {
  const { playerName, level, xp, xpToNext, hp, maxHp, gold, diamonds, energy, maxEnergy, playerRace, baseStats, materials } = useGameStore();
  const power = calcPower(baseStats, level);
  return <div className="bg-bg/95 backdrop-blur-sm border-b border-accent/10 px-3 py-2 sticky top-0 z-50">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2">
        <img src={playerRace ? RACE_INFO[playerRace].img : ''} className="w-8 h-8 rounded-full object-cover border border-accent/40" alt="" />
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold truncate max-w-[100px]">{playerName}</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-accent/20 text-accent rounded font-mono font-bold">LV.{level}</span>
          </div>
          <p className="text-[9px] text-gray-500 font-mono">Мощь: {power}</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 text-xs">
        <span className="text-accent font-mono font-bold">💰 {gold}</span>
        <span className="text-cyan font-mono font-bold">💎 {diamonds}</span>
        <span className="text-green font-mono font-bold">⚡ {energy}/{maxEnergy}</span>
      </div>
    </div>
    {/* Ресурсы */}
    <div className="flex items-center justify-center gap-4 bg-bg3/50 rounded-lg py-1 px-2 text-[10px] text-gray-400 border border-bg4/30 mb-1.5">
      <span title="Железо">🪵 Дерево: {materials.wood}</span>
      <span title="Дерево">⛏️ Руда: {materials.iron}</span>
      <span title="Кожа">👞 Кожа: {materials.leather}</span>
      <span title="Магия">🔮 Магия: {materials.magic}</span>
    </div>
    <div className="flex gap-2">
      <div className="flex-1">
        <div className="flex justify-between text-[9px] mb-0.5"><span className="text-red2 font-bold">Здоровье</span><span className="text-gray-400 font-mono">{hp}/{maxHp}</span></div>
        <div className="h-1.5 bg-bg4 rounded-full overflow-hidden"><div className="h-full hp-bar rounded-full transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, (hp / maxHp) * 100))}%` }} /></div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-[9px] mb-0.5"><span className="text-blue2 font-bold">Опыт</span><span className="text-gray-400 font-mono">{xp}/{xpToNext}</span></div>
        <div className="h-1.5 bg-bg4 rounded-full overflow-hidden"><div className="h-full xp-bar rounded-full transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, (xp / xpToNext) * 100))}%` }} /></div>
      </div>
    </div>
  </div>;
}

/* ─── SPLASH SCREEN ─── */
function SplashScreen() {
  const setScreen = useGameStore(s => s.setScreen);
  return <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-bg to-bg2" />
    <div className="relative z-10 text-center max-w-sm">
      <h1 className="text-4xl font-black gold-text mb-1 tracking-tight">RAGELINE</h1>
      <p className="text-xl font-bold text-red2 tracking-widest">В БОЙ!</p>
      <p className="text-xs text-gray-400 mt-3 leading-relaxed">Двуручное оружие, щиты, рейды, расширение земель гильдии.</p>
      <button onClick={() => setScreen('create-char')} className="btn-primary text-lg px-10 py-3 mt-8 w-full anim-glow">⚔ СОЗДАТЬ ПЕРСОНАЖА</button>
    </div>
  </div>;
}

/* ─── CHARACTER CREATION ─── */
function CreateCharScreen() {
  const { createCharacter } = useGameStore();
  const [name, setName] = useState('');
  const [race, setRace] = useState<Race | null>(null);
  const [stats, setStats] = useState<Stats>({ strength: 5, agility: 5, fury: 5, luck: 5, revenge: 5, constitution: 5 });
  const [points, setPoints] = useState(12);
  const [step, setStep] = useState<'race' | 'stats'>('race');

  useEffect(() => {
    if (race) {
      setStats({ ...RACE_INFO[race].startStats });
      setPoints(12);
    }
  }, [race]);

  const raceOrder: Race[] = ['human', 'elf', 'orc', 'dwarf', 'undead'];
  const statHelp: Record<keyof Stats, string> = {
    strength: 'Урон каждым попаданием',
    agility: 'Шанс уклониться или задеть скользящим ударом',
    fury: 'Шанс критического удара',
    luck: 'Пробитие блока и удачные попадания',
    revenge: 'Шанс контратаки после удара врага',
    constitution: 'Запас здоровья и выживаемость',
  };
  const maxPreviewStat = 28;

  const inc = (k: keyof Stats) => {
    if (points <= 0) return;
    setStats({ ...stats, [k]: stats[k] + 1 });
    setPoints(points - 1);
  };
  const dec = (k: keyof Stats) => {
    if (!race) return;
    const base = RACE_INFO[race].startStats[k];
    if (stats[k] <= base) return;
    setStats({ ...stats, [k]: stats[k] - 1 });
    setPoints(points + 1);
  };

  if (step === 'stats' && race) {
    const info = RACE_INFO[race];
    return <div className="min-h-screen p-4 flex flex-col bg-gradient-to-b from-bg via-bg2 to-bg">
      <div className="relative z-10 max-w-md mx-auto w-full flex-1 flex flex-col pt-3">
        <button onClick={() => setStep('race')} className="text-gray-500 text-sm mb-3 self-start">Назад к выбору расы</button>

        <div className="relative overflow-hidden rounded-2xl border border-accent/20 mb-4 bg-bg2 shadow-lg">
          <img src={info.img} className="w-full h-44 object-cover object-top" alt={info.nameRu} />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
          <div className="absolute left-4 right-4 bottom-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-accent/80 font-bold">Выбранная раса</p>
            <h2 className="text-2xl font-black text-gray-100 leading-tight">{info.nameRu}</h2>
            <p className="text-xs text-gray-300 mt-1 leading-snug max-w-xs">{info.lore}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-wider">Имя персонажа</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Например: Северный Ворон" maxLength={16} className="w-full px-4 py-3 bg-bg3 border border-accent/15 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:border-accent/50" />
        </div>

        <div className="card p-4 flex-1 border-accent/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-black text-gray-200">Настройка характеристик</h3>
              <p className="text-[10px] text-gray-500">Расовая основа уже учтена</p>
            </div>
            <span className="text-xs font-mono font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-1 rounded-lg">Очки: {points}</span>
          </div>

          <div className="space-y-2">
            {(Object.keys(STAT_LABELS) as (keyof Stats)[]).map(k => {
              const base = info.startStats[k];
              const added = stats[k] - base;
              const width = Math.min(100, (stats[k] / maxPreviewStat) * 100);
              return <div key={k} className="py-2 border-b border-bg4/40 last:border-0">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-200">{STAT_LABELS[k]}</p>
                    <p className="text-[10px] text-gray-500 leading-tight">{statHelp[k]}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => dec(k)} disabled={stats[k] <= base} className="w-8 h-8 rounded-lg bg-bg4 border border-bg4 text-gray-300 font-bold disabled:opacity-25">−</button>
                    <span className="w-11 text-center font-mono text-sm font-black text-gray-100">{stats[k]}{added > 0 && <span className="text-green2 text-[10px]">+{added}</span>}</span>
                    <button onClick={() => inc(k)} disabled={points <= 0} className="w-8 h-8 rounded-lg bg-bg4 border border-bg4 text-accent font-bold disabled:opacity-25">+</button>
                  </div>
                </div>
                <div className="h-1.5 bg-bg4 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent-dim to-accent2 rounded-full" style={{ width: `${width}%` }} />
                </div>
              </div>;
            })}
          </div>
        </div>

        <button onClick={() => createCharacter(name, race, stats)} disabled={!name.trim() || points > 0} className={`w-full btn-primary text-base py-3.5 mt-4 ${!name.trim() || points > 0 ? 'opacity-40' : 'anim-glow'}`}>
          {!name.trim() ? 'Введите имя' : points > 0 ? `Распределите ещё ${points} очков` : 'Начать путь'}
        </button>
      </div>
    </div>;
  }

  const selected = race ? RACE_INFO[race] : RACE_INFO.human;

  return <div className="min-h-screen p-4 flex flex-col bg-gradient-to-b from-bg via-bg2 to-bg">
    <div className="max-w-md mx-auto w-full flex-1 flex flex-col pt-5">
      <div className="text-center mb-5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent/70 font-bold">Создание героя</p>
        <h2 className="text-2xl font-black gold-text mt-1">Выберите расу</h2>
        <p className="text-xs text-gray-500 mt-1">Портрет, расовые параметры и боевой стиль</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-bg2 mb-4 shadow-lg min-h-[230px]">
        <img src={selected.img} className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-300" alt={selected.nameRu} />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/5" />
        <div className="absolute left-4 right-4 bottom-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-accent/80 font-bold">{race ? 'Выбранная раса' : 'Предпросмотр'}</p>
          <h3 className="text-2xl font-black text-gray-100 leading-tight">{selected.nameRu}</h3>
          <p className="text-xs text-gray-300 mt-1 leading-snug max-w-xs">{selected.lore}</p>
          <p className="text-[10px] text-green2 font-bold mt-2">{selected.bonus}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {raceOrder.map(r => {
          const info = RACE_INFO[r];
          const active = race === r;
          return <button key={r} onClick={() => setRace(r)} className={`text-left overflow-hidden rounded-xl border transition-all bg-bg2/80 ${active ? 'border-accent bg-accent/10 shadow-lg' : 'border-bg4 hover:border-accent/30'}`}>
            <div className="flex gap-3 p-2.5">
              <img src={info.img} className="w-16 h-20 rounded-lg object-cover object-top border border-bg4 shrink-0" alt={info.nameRu} />
              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-black text-sm text-gray-100">{info.nameRu}</h3>
                  {active && <span className="text-[10px] text-accent font-bold border border-accent/30 bg-accent/10 px-2 py-0.5 rounded-full">Выбрано</span>}
                </div>
                <p className="text-[10px] text-green2 font-bold mt-0.5">{info.bonus}</p>
                <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 mt-2">
                  {(Object.keys(STAT_LABELS) as (keyof Stats)[]).map(k => (
                    <div key={k} className="flex items-center justify-between text-[9px] text-gray-500 border-b border-bg4/40">
                      <span>{STAT_LABELS[k].replace(/^..\s/, '')}</span>
                      <span className="text-gray-300 font-mono font-bold">{info.startStats[k]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </button>;
        })}
      </div>

      <button onClick={() => setStep('stats')} disabled={!race} className={`w-full btn-primary mt-5 py-3.5 ${race ? 'anim-glow' : 'opacity-40'}`}>Продолжить</button>
    </div>
  </div>;
}

/* ─── HUB ─── */
function HubScreen() {
  const { setScreen, energy, level, wins, losses } = useGameStore();
  const actions = [
    { icon: '⚔️', title: 'Арена PvP', desc: 'Сражения за ЦП и рейтинг', color: 'border-red/30 bg-red/5', action: () => setScreen('arena'), badge: `⚡${energy}` },
    { icon: '🗺️', title: 'Подземелья', desc: 'Добыча ресурсов и кач', color: 'border-purple/30 bg-purple/5', action: () => setScreen('explore') },
    { icon: '🎒', title: 'Инвентарь', desc: 'Механика двух рук', color: 'border-blue/30 bg-blue/5', action: () => setScreen('inventory') },
    { icon: '🔨', title: 'Крафт', desc: 'Создание 2H/1H оружия', color: 'border-accent/30 bg-accent/5', action: () => setScreen('craft') },
    { icon: '🏰', title: 'Гильдия', desc: 'Захват деревень и земель', color: 'border-accent/30 bg-accent/5', action: () => setScreen('guild') },
    { icon: '🏪', title: 'Магазин', desc: 'Продажа базового лута', color: 'border-purple/30 bg-purple/5', action: () => setScreen('shop') },
  ];
  return <div className="p-4 pb-24 relative flex-1">
    <div className="absolute inset-0 bg-gradient-to-b from-bg to-bg2 pointer-events-none" />
    <div className="relative z-10 max-w-md mx-auto">
      <div className="text-center mb-4"><h2 className="text-xl font-black gold-text">ПРИЮТ ХРАБРЫХ</h2><p className="text-xs text-gray-500">Уровень {level} • Побед: {wins} / Поражений: {losses}</p></div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a, i) => (
          <button key={i} onClick={a.action} className={`card p-4 text-left transition-all border ${a.color} hover:scale-[1.01]`}>
            <div className="flex items-center justify-between mb-1"><span className="text-2xl">{a.icon}</span>{a.badge && <span className="text-[10px] bg-bg2 border border-accent/20 px-1 rounded text-accent font-bold font-mono">{a.badge}</span>}</div>
            <h3 className="text-sm font-bold">{a.title}</h3>
            <p className="text-[10px] text-gray-400 mt-1">{a.desc}</p>
          </button>
        ))}
      </div>
    </div>
  </div>;
}

/* ─── INVENTORY & DUAL WIELD ─── */
function InventoryScreen() {
  const { inventory, equipped, equipItem, unequipItem, sellItem, setScreen } = useGameStore();
  const [activeSlot, setActiveSlot] = useState<'leftHand' | 'rightHand' | null>(null);

  const slots: EquipSlot[] = ['leftHand', 'rightHand', 'head', 'body', 'legs', 'ring'];
  const slotNames: Record<EquipSlot, string> = { leftHand: 'Лев. Рука', rightHand: 'Прав. Рука', head: 'Голова', body: 'Броня', legs: 'Обувь', ring: 'Кольцо' };

  return <div className="p-4 pb-24 relative">
    <div className="relative z-10 max-w-md mx-auto">
      <h2 className="text-lg font-black gold-text mb-4">🪖 СНАРЯЖЕНИЕ</h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {slots.map(s => {
          const item = equipped[s];
          return <div key={s} onClick={() => { if (item) unequipItem(s); else if (s==='leftHand'||s==='rightHand') setActiveSlot(s); }} className={`card p-3 text-center cursor-pointer min-h-[85px] flex flex-col items-center justify-center border border-dashed border-bg4 ${item ? 'border-solid border-accent bg-accent/5' : 'hover:border-accent/30'}`}>
            {item ? <>
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] font-bold truncate w-full mt-1">{item.name}</span>
              <span className="text-[8px] text-accent uppercase font-bold">{item.handedness || 'Броня'}</span>
            </> : <>
              <span className="text-lg text-gray-600">＋</span>
              <span className="text-[9px] text-gray-500">{slotNames[s]}</span>
            </>}
          </div>;
        })}
      </div>

      {activeSlot && <div className="card p-3 border-accent/30 mb-4 anim-fade">
        <div className="flex items-center justify-between border-b border-bg4/30 pb-2 mb-2">
          <p className="text-xs font-bold text-accent">Выбери оружие для: {slotNames[activeSlot]}</p>
          <button onClick={() => setActiveSlot(null)} className="text-xs text-red2 font-bold">Закрыть ✖</button>
        </div>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {inventory.filter(i => i.slot === activeSlot || i.type === 'weapon' || i.type === 'shield').map(i => (
            <div key={i.id} onClick={() => { equipItem(i.id, activeSlot); setActiveSlot(null); }} className="p-2 border border-bg4 bg-bg2 hover:border-accent flex justify-between items-center rounded-lg cursor-pointer">
              <span className="text-sm">{i.icon} {i.name}</span>
              <span className="text-[9px] text-accent font-bold">Выбрать</span>
            </div>
          ))}
          {inventory.filter(i => i.slot === activeSlot || i.type === 'weapon' || i.type === 'shield').length === 0 && <p className="text-xs text-gray-500 text-center py-2">Нет подходящих предметов.</p>}
        </div>
      </div>}

      <h3 className="text-xs font-black text-gray-400 uppercase mb-3">Рюкзак ({inventory.length})</h3>
      <div className="space-y-2">
        {inventory.map(i => (
          <div key={i.id} className="card p-3 flex justify-between items-center border border-bg4">
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-bg4/50 p-2 rounded-xl">{i.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-200">{i.name}</p>
                <p className="text-[10px] text-gray-500 uppercase">{i.rarity} • {i.handedness || 'Броня'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {i.slot !== 'leftHand' && i.slot !== 'rightHand' && <button onClick={() => equipItem(i.id)} className="btn-primary text-xs px-2.5 py-1">Надеть</button>}
              <button onClick={() => sellItem(i.id)} className="btn-dark text-xs px-2.5 py-1 text-red2 border-red/20">Продать</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setScreen('hub')} className="w-full btn-dark mt-6">← Вернуться</button>
    </div>
  </div>;
}

/* ─── SHOP ─── */
function ShopScreen() {
  const { setScreen, gold, buyItem } = useGameStore();
  return <div className="p-4 pb-24 relative">
    <div className="relative z-10 max-w-md mx-auto">
      <h2 className="text-lg font-black gold-text mb-4">🏪 ОРУЖЕЙНАЯ ЛАВКА</h2>
      <div className="space-y-2.5">
        {SHOP_ITEMS.map(item => (
          <div key={item.id} className="card p-4 flex justify-between items-center border-bg4 bg-bg2/40">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-200">{item.name}</p>
                <p className="text-[10px] text-accent uppercase font-bold">{item.handedness || '1h'}</p>
              </div>
            </div>
            <button onClick={() => buyItem(item, item.level * 50)} disabled={gold < (item.level * 50)} className="btn-primary text-xs font-mono font-bold">
              {item.level * 50} 💰
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => setScreen('hub')} className="w-full btn-dark mt-6">← Назад</button>
    </div>
  </div>;
}

/* ─── CRAFT ─── */
function CraftScreen() {
  const { setScreen, materials, craftItem, gold } = useGameStore();
  return <div className="p-4 pb-24 relative">
    <div className="relative z-10 max-w-md mx-auto">
      <h2 className="text-lg font-black gold-text mb-4">🔨 КУЗНИЦА</h2>
      <div className="space-y-3">
        {CRAFT_RECIPES.map(recipe => {
          const m = materials;
          const c = recipe.materialCosts;
          const hasMats = m.iron >= c.iron && m.wood >= c.wood && m.leather >= c.leather && m.magic >= c.magic && gold >= recipe.goldCost;
          return <div key={recipe.id} className="card p-4 border border-bg4 bg-bg2/30">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{recipe.icon}</span>
              <div>
                <h3 className="font-bold text-sm text-gray-200">{recipe.name}</h3>
                <p className="text-[10px] text-accent uppercase font-bold">{recipe.handedness || '1h'}</p>
              </div>
            </div>
            <div className="bg-bg3/50 p-2.5 rounded-xl text-[10px] text-gray-400 grid grid-cols-2 gap-1 mb-3">
              <span>🪵 Дерево: {c.wood}/{m.wood}</span>
              <span>⛏️ Руда: {c.iron}/{m.iron}</span>
              <span>👞 Кожа: {c.leather}/{m.leather}</span>
              <span>🔮 Магия: {c.magic}/{m.magic}</span>
              <span className="col-span-2 font-bold text-accent">💰 Золото: {recipe.goldCost}/{gold}</span>
            </div>
            <button onClick={() => craftItem(recipe)} disabled={!hasMats} className={`w-full btn-primary text-xs font-bold py-2 ${hasMats ? 'anim-glow' : 'opacity-30 cursor-not-allowed'}`}>
              СКРАФТИТЬ
            </button>
          </div>;
        })}
      </div>
      <button onClick={() => setScreen('hub')} className="w-full btn-dark mt-4">← Назад</button>
    </div>
  </div>;
}

/* ─── GUILD TERRITORIES & MAP ─── */
function GuildMapScreen() {
  const { mapTiles, setScreen, captureTile, playerGuild } = useGameStore();
  const tiles = mapTiles;

  return <div className="p-4 pb-24 relative">
    <div className="relative z-10 max-w-md mx-auto">
      <button onClick={() => setScreen('guild')} className="text-gray-500 text-sm mb-3">← Гильдия</button>
      <h2 className="text-lg font-black gold-text mb-4">🗺️ КАРТА МИРА</h2>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {tiles.map(t => (
          <div key={t.id} className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center min-h-[100px] backdrop-blur-sm transition-all 
            ${t.status === 'claimed' ? 'border-green/50 bg-green/10' : t.status === 'monster' ? 'border-red/40 bg-red/10' : 'border-bg4/80 bg-bg3/30'}`}>
            <span className="text-2xl">{t.icon}</span>
            <span className="text-[9px] font-bold text-gray-200 truncate w-full mt-1 text-center">{t.name}</span>
            <span className={`text-[8px] font-bold mt-0.5 ${t.status === 'claimed' ? 'text-green2' : t.status === 'monster' ? 'text-red2' : 'text-gray-500'}`}>
              {t.status === 'claimed' ? `${t.ownerTag}` : t.status === 'monster' ? '👹 Полчища' : 'Пусто'}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {tiles.filter(t => t.status !== 'claimed').map(t => (
          <div key={t.id} className="card p-3 border border-bg4 bg-bg2/40 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-200 truncate">{t.icon} {t.name}</p>
              <p className="text-[10px] text-gray-400">{t.bonus}</p>
              <p className="text-[9px] text-gray-500">Требуется мощь: {t.powerNeeded}</p>
            </div>
            <button onClick={() => captureTile(t.id)} disabled={!playerGuild} className={`btn-primary text-[10px] px-3 py-1.5 font-bold ${!playerGuild ? 'opacity-40' : ''}`}>
              ⚔ Захватить
            </button>
          </div>
        ))}
      </div>
      {!playerGuild && <p className="text-[10px] text-red2 text-center mt-2">Для захвата земель нужно создать гильдию!</p>}
    </div>
  </div>;
}

/* ─── EXPLORE ─── */
function ExploreScreen() {
  const { setScreen, enterDungeon } = useGameStore();
  return <div className="p-4 pb-24 relative">
    <div className="relative z-10 max-w-md mx-auto">
      <h2 className="text-lg font-black gold-text mb-4">🗺️ ПОДЗЕМЕЛЬЯ</h2>
      <div className="space-y-3">
        {DUNGEON_TIERS.map(d => (
          <div key={d.id} onClick={() => enterDungeon()} className="card p-4 border border-bg4 bg-bg2/40 cursor-pointer hover:border-accent">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{d.emoji}</span>
              <div>
                <h3 className="font-bold text-sm text-gray-200">{d.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{d.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setScreen('hub')} className="w-full btn-dark mt-4">← В город</button>
    </div>
  </div>;
}

/* ─── DUNGEON MAP ─── */
function DungeonScreen() {
  const { dungeon, exploreRoom, abandonDungeon } = useGameStore();
  const d = dungeon;
  const room = d.rooms[d.currentRoomIndex];

  if (d.phase === 'result') {
    return <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card p-6 border border-accent text-center w-full max-w-xs">
        <h2 className="text-2xl font-black text-green2">ПОХОД ОКОНЧЕН</h2>
        <p className="text-xs text-gray-400 mt-2">Золото: +{d.dungeonGold} 💰</p>
        <p className="text-xs text-gray-400">Опыт: +{d.dungeonXp} ⭐</p>
        <button onClick={abandonDungeon} className="btn-primary mt-4 w-full">ВЕРНУТЬСЯ НА ХАБ</button>
      </div>
    </div>;
  }

  return <div className="p-4 relative">
    <div className="relative z-10 max-w-md mx-auto text-center">
      <h2 className="text-lg font-bold gold-text mb-4">КОМНАТА {d.currentRoomIndex + 1} / {d.rooms.length}</h2>
      {room && <div className="card p-6 border-bg4 mb-4">
        <span className="text-4xl">{room.type === 'combat' ? '⚔️' : room.type === 'treasure' ? '🎁' : room.type === 'trap' ? '⚠️' : '👑'}</span>
        <h3 className="text-base font-bold mt-2">{room.name}</h3>
        <p className="text-xs text-gray-400 mt-1">{room.description}</p>
        <button onClick={exploreRoom} className="w-full btn-primary mt-6">ИССЛЕДОВАТЬ</button>
      </div>}
    </div>
  </div>;
}

/* ─── DUNGEON FIGHT ─── */
function DungeonFightScreen() {
  const { currentEnemy, playerHpCombat, enemyHpCombat, combatPhase, executeDungeonCombatRound, finishDungeonRoom, combatResult } = useGameStore();
  const [attackTarget, setAttackTarget] = useState<BodyPart | null>(null);
  const [blockTarget, setBlockTarget] = useState<BodyPart | null>(null);

  if (!currentEnemy) return null;

  return <div className="min-h-screen p-4 flex flex-col justify-center">
    <div className="max-w-md mx-auto w-full text-center">
      <div className="flex justify-between items-center mb-6">
        <div className="text-left"><p className="text-sm font-bold text-accent">ТЫ</p><p className="text-xs font-mono">{playerHpCombat} HP</p></div>
        <span className="text-lg font-bold text-red2">ПРОТИВ</span>
        <div className="text-right"><p className="text-sm font-bold text-red2">{currentEnemy.name}</p><p className="text-xs font-mono">{enemyHpCombat} HP</p></div>
      </div>

      {combatPhase === 'done' ? (
        <div className="card p-4 border-accent">
          <p className="text-xl font-bold mb-4">{combatResult === 'win' ? 'Победа!' : 'Поражение'}</p>
          <button onClick={finishDungeonRoom} className="w-full btn-primary py-2">ПРОДОЛЖИТЬ</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-3">
              <p className="text-xs font-bold text-red2 mb-2">АТАКА</p>
              {BODY_PARTS.map(bp => <button key={bp} onClick={() => setAttackTarget(bp)} className={`w-full py-1 text-xs rounded border mt-1 ${attackTarget === bp ? 'border-red2 bg-red/10 text-red2' : 'border-bg4 text-gray-400'}`}>{BODY_LABELS[bp]}</button>)}
            </div>
            <div className="card p-3">
              <p className="text-xs font-bold text-blue2 mb-2">БЛОК</p>
              {BODY_PARTS.map(bp => <button key={bp} onClick={() => setBlockTarget(bp)} className={`w-full py-1 text-xs rounded border mt-1 ${blockTarget === bp ? 'border-blue2 bg-blue/10 text-blue2' : 'border-bg4 text-gray-400'}`}>{BODY_LABELS[bp]}</button>)}
            </div>
          </div>
          <button onClick={() => { executeDungeonCombatRound({ attackTarget: attackTarget!, blockTarget: blockTarget! }); setAttackTarget(null); setBlockTarget(null); }} disabled={!attackTarget || !blockTarget} className="w-full btn-primary text-base py-3">СДЕЛАТЬ ХОД</button>
        </div>
      )}
    </div>
  </div>;
}

/* ─── GUILD SCREEN ─── */
function GuildScreen() {
  const { playerGuild, setScreen, mapTiles } = useGameStore();
  if (!playerGuild) return null;
  const controlled = mapTiles.filter(t => t.status === 'claimed').length;

  return <div className="p-4 pb-24 relative">
    <div className="relative z-10 max-w-md mx-auto">
      <div className="card p-4 text-center border border-accent bg-accent/5 mb-4">
        <h2 className="text-lg font-black gold-text">🏰 {playerGuild.name} [{playerGuild.tag}]</h2>
        <p className="text-xs text-gray-400 mt-1">Владения гильдии: {controlled} / {mapTiles.length}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setScreen('guild-map')} className="card p-4 text-center border-accent hover:bg-accent/10">
          <span className="text-3xl block mb-1">🗺️</span>
          <span className="text-xs font-bold">Освоение Земель</span>
        </button>
        <button onClick={() => setScreen('hub')} className="card p-4 text-center border-bg4 hover:bg-bg2/40">
          <span className="text-3xl block mb-1">🏘️</span>
          <span className="text-xs font-bold">Вернуться в город</span>
        </button>
      </div>
    </div>
  </div>;
}

/* ─── MAIN APP ─── */
function App() {
  const screen = useGameStore(s => s.screen);
  const showNav = !['splash', 'create-char', 'arena-fight', 'dungeon', 'dungeon-fight'].includes(screen);
  const showHUD = !['splash', 'create-char'].includes(screen);

  return (
    <div className="min-h-screen bg-bg text-gray-200 max-w-lg mx-auto relative">
      <Notification />
      {showHUD && <HUD />}
      <main className={showNav ? 'pb-16' : ''}>
        {screen === 'splash' && <SplashScreen />}
        {screen === 'create-char' && <CreateCharScreen />}
        {screen === 'hub' && <HubScreen />}
        {screen === 'inventory' && <InventoryScreen />}
        {screen === 'shop' && <ShopScreen />}
        {screen === 'craft' && <CraftScreen />}
        {screen === 'explore' && <ExploreScreen />}
        {screen === 'dungeon' && <DungeonScreen />}
        {screen === 'dungeon-fight' && <DungeonFightScreen />}
        {screen === 'guild' && <GuildScreen />}
        {screen === 'guild-map' && <GuildMapScreen />}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}

export default App;
