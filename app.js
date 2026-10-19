(() => {
  'use strict';

  const STORAGE_KEY = 'shiguang-meal-journal-v1';
  const DEFAULT_GOAL = Object.freeze({ calories: 1800, protein: 100, carbs: 220, fat: 55, water: 8 });
  const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const WEEKDAYS_SHORT = ['日', '一', '二', '三', '四', '五', '六'];
  const MEALS = [
    { id: 'breakfast', label: '早餐', icon: 'sun', color: '#d89032', bg: '#fbf0cf', time: '07:00' },
    { id: 'lunch', label: '午餐', icon: 'bowl', color: '#4e8b68', bg: '#e5f3e8', time: '12:30' },
    { id: 'dinner', label: '晚餐', icon: 'leaf', color: '#547a78', bg: '#e7f1ef', time: '19:00' },
    { id: 'snack', label: '加餐', icon: 'sparkles', color: '#bd6a55', bg: '#fce7dc', time: '15:30' }
  ];
  const QUICK_PICKS = [
    { id: 'oats', label: '燕麦酸奶碗', emoji: '🥣', amount: '1 碗', calories: 360, protein: 20, carbs: 45, fat: 11 },
    { id: 'salad', label: '鸡胸肉沙拉', emoji: '🥗', amount: '1 份', calories: 420, protein: 38, carbs: 24, fat: 18 },
    { id: 'noodles', label: '番茄鸡蛋面', emoji: '🍜', amount: '1 碗', calories: 520, protein: 22, carbs: 72, fat: 16 },
    { id: 'banana', label: '香蕉', emoji: '🍌', amount: '1 根', calories: 95, protein: 1.2, carbs: 24, fat: 0.3 },
    { id: 'coffee', label: '美式咖啡', emoji: '☕', amount: '1 杯', calories: 8, protein: 0.4, carbs: 1, fat: 0 }
  ];

  const DEFAULT_PORTION_GRAMS = Object.freeze({
    '碗': 250, '份': 200, '个': 100, '片': 30, '杯': 240, '根': 100, '勺': 15, '块': 100, '盒': 250
  });

  const foodData = (name, aliases, calories, protein, carbs, fat, portions = {}) => ({
    name,
    aliases: [name, ...aliases],
    per100g: { calories, protein, carbs, fat },
    portions
  });

  const FOOD_DATABASE = [
    foodData('米饭', ['白米饭', '熟米饭', '大米饭'], 116, 2.6, 25.9, 0.3, { '碗': 200, '份': 200 }),
    foodData('糙米饭', ['糙米', '糙米饭'], 111, 2.6, 23, 0.9, { '碗': 200, '份': 200 }),
    foodData('藜麦饭', ['藜麦', '藜麦碗'], 120, 4.4, 21.3, 1.9, { '碗': 180, '份': 180 }),
    foodData('鸡胸肉', ['熟鸡胸肉', '鸡胸', '煎鸡胸'], 165, 31, 0, 3.6, { '份': 120, '块': 120 }),
    foodData('鸡腿肉', ['鸡腿', '熟鸡腿肉'], 209, 26, 0, 10.9, { '个': 150, '份': 150 }),
    foodData('牛肉', ['熟牛肉', '瘦牛肉'], 250, 26, 0, 15, { '份': 100 }),
    foodData('猪里脊', ['猪肉', '里脊肉'], 187, 27, 0, 7.9, { '份': 100 }),
    foodData('三文鱼', ['鲑鱼', '熟三文鱼'], 208, 20, 0, 13, { '份': 120 }),
    foodData('虾仁', ['虾', '熟虾仁'], 99, 24, 0.2, 0.3, { '份': 100 }),
    foodData('鸡蛋', ['水煮蛋', '煎蛋', '荷包蛋'], 143, 12.6, 0.7, 9.5, { '个': 50 }),
    foodData('豆腐', ['嫩豆腐', '北豆腐', '南豆腐'], 76, 8, 1.9, 4.8, { '块': 100, '份': 100 }),
    foodData('牛奶', ['纯牛奶', '全脂牛奶', '脱脂牛奶'], 54, 3, 5, 3, { '杯': 240, '盒': 250 }),
    foodData('原味酸奶', ['酸奶', '无糖酸奶'], 61, 3.5, 4.7, 3.3, { '杯': 150, '盒': 150 }),
    foodData('希腊酸奶', ['希腊式酸奶', '浓稠酸奶'], 97, 9, 3.6, 5, { '杯': 150, '盒': 150 }),
    foodData('燕麦片', ['燕麦', '即食燕麦'], 389, 16.9, 66.3, 6.9, { '份': 40, '碗': 40, '杯': 80 }),
    foodData('全麦吐司', ['全麦面包', '全麦土司'], 247, 13, 41, 3.4, { '片': 35 }),
    foodData('白吐司', ['吐司', '白面包'], 266, 8.9, 49, 3.3, { '片': 30 }),
    foodData('贝果', ['全麦贝果'], 257, 10, 50, 1.6, { '个': 100 }),
    foodData('番茄鸡蛋面', ['西红柿鸡蛋面', '番茄蛋面'], 112, 6, 15, 3, { '碗': 350 }),
    foodData('牛肉面', ['红烧牛肉面'], 135, 7, 18, 4, { '碗': 400 }),
    foodData('意大利面', ['意面', '番茄意面'], 158, 5.8, 30.9, 0.9, { '份': 200, '碗': 200 }),
    foodData('荞麦面', ['荞麦面条'], 99, 5.1, 21.4, 0.1, { '碗': 250 }),
    foodData('小米粥', ['小米稀饭'], 46, 1.4, 8.4, 0.7, { '碗': 250 }),
    foodData('香蕉', ['芭蕉'], 89, 1.1, 22.8, 0.3, { '根': 120 }),
    foodData('苹果', ['红苹果', '青苹果'], 52, 0.3, 13.8, 0.2, { '个': 180 }),
    foodData('蓝莓', ['蓝莓果'], 57, 0.7, 14.5, 0.3, { '杯': 140, '份': 100 }),
    foodData('牛油果', ['鳄梨'], 160, 2, 8.5, 14.7, { '个': 150, '份': 75 }),
    foodData('西兰花', ['绿花椰菜'], 34, 2.8, 6.6, 0.4, { '份': 150 }),
    foodData('番茄', ['西红柿'], 18, 0.9, 3.9, 0.2, { '个': 150 }),
    foodData('生菜', ['球生菜', '叶用莴苣'], 15, 1.4, 2.9, 0.2, { '份': 80 }),
    foodData('黄瓜', ['青瓜'], 15, 0.7, 3.6, 0.1, { '根': 200, '份': 150 }),
    foodData('土豆', ['马铃薯', '洋芋'], 77, 2, 17.5, 0.1, { '个': 150, '份': 150 }),
    foodData('红薯', ['地瓜', '番薯'], 86, 1.6, 20.1, 0.1, { '个': 150, '份': 150 }),
    foodData('玉米', ['甜玉米', '玉米棒'], 96, 3.4, 21, 1.5, { '根': 200 }),
    foodData('花生酱', ['花生抹酱'], 588, 25, 20, 50, { '勺': 15 }),
    foodData('混合坚果', ['坚果', '每日坚果'], 607, 20, 21, 54, { '份': 25, '把': 30 }),
    foodData('橄榄油', ['食用油'], 884, 0, 0, 100, { '勺': 10 }),
    foodData('美式咖啡', ['黑咖啡', '咖啡'], 2, 0.1, 0, 0, { '杯': 240 }),
    foodData('拿铁', ['咖啡拿铁', '拿铁咖啡'], 55, 2.8, 4.4, 3, { '杯': 300 }),
    foodData('奶茶', ['珍珠奶茶'], 70, 1, 12, 2, { '杯': 500 }),
    foodData('可乐', ['碳酸饮料'], 42, 0, 10.6, 0, { '杯': 330, '罐': 330 }),
    foodData('豆浆', ['无糖豆浆'], 31, 3, 1.2, 1.6, { '杯': 250 }),
    foodData('鸡胸肉沙拉', ['鸡肉沙拉'], 120, 12, 5, 6, { '份': 300, '碗': 300 }),
    foodData('燕麦酸奶碗', ['酸奶燕麦碗'], 120, 5, 17, 4, { '碗': 300 }),
    foodData('番茄炒蛋', ['西红柿炒鸡蛋'], 91, 5, 4, 6, { '份': 200 }),
    foodData('清蒸鲈鱼', ['鲈鱼', '蒸鱼'], 113, 19, 0, 4, { '份': 150 }),
    foodData('照烧鸡腿饭', ['鸡腿饭'], 150, 7, 19, 5, { '份': 350, '碗': 350 }),
    foodData('牛肉藜麦能量碗', ['牛肉藜麦碗'], 140, 8, 16, 5, { '份': 350, '碗': 350 }),
    foodData('虾仁西兰花炒饭', ['虾仁炒饭'], 130, 7, 18, 4, { '份': 300, '碗': 300 }),
    foodData('菌菇鸡肉意面', ['蘑菇鸡肉意面'], 125, 7, 16, 4, { '份': 300 }),
    foodData('南瓜小米粥', ['南瓜粥'], 45, 1.2, 8.8, 0.5, { '碗': 300 }),
    foodData('三文鱼糙米饭', ['三文鱼饭'], 145, 8, 17, 5, { '份': 350, '碗': 350 }),
    foodData('冬瓜丸子汤', ['冬瓜汤'], 42, 3, 4, 1.5, { '碗': 350 }),
    foodData('蓝莓燕麦杯', ['蓝莓燕麦碗'], 130, 5, 19, 4, { '碗': 300 }),
    foodData('鸡胸肉牛油果卷', ['鸡肉牛油果卷'], 160, 10, 14, 8, { '份': 220 }),
    foodData('番茄虾仁荞麦面', ['虾仁荞麦面'], 105, 6, 15, 2, { '碗': 350 }),
    foodData('饺子', ['水饺', '蒸饺'], 198, 8, 27, 7, { '个': 20, '份': 250 }),
    foodData('包子', ['肉包', '菜包'], 227, 7, 37, 6, { '个': 100 }),
    foodData('蛋炒饭', ['鸡蛋炒饭'], 168, 5, 25, 5, { '份': 300, '碗': 300 }),
    foodData('汉堡', ['牛肉汉堡'], 250, 12, 29, 10, { '个': 150 }),
    foodData('薯条', ['炸薯条'], 312, 3.4, 41, 15, { '份': 100 }),
    foodData('橙子', ['橙'], 47, 0.9, 11.8, 0.1, { '个': 180 }),
    foodData('猕猴桃', ['奇异果'], 61, 1.1, 14.7, 0.5, { '个': 100 }),
    foodData('菠菜', ['菠菜叶'], 23, 2.9, 3.6, 0.4, { '份': 100 }),
    foodData('蘑菇', ['香菇', '口蘑'], 22, 3.1, 3.3, 0.3, { '份': 100 }),
    foodData('冬瓜', ['白瓜'], 13, 0.4, 3, 0.2, { '份': 150 })
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const pad = (value) => String(value).padStart(2, '0');
  const fmt = new Intl.NumberFormat('zh-CN');
  const round1 = (value) => Math.round((Number(value) + Number.EPSILON) * 10) / 10;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  let state = loadState();
  let selectedDate = dateKey(new Date());
  let calendarCursor = startOfMonth(parseDateKey(selectedDate));
  let activeView = 'today';
  let currentMeal = 'breakfast';
  let pendingConfirm = null;
  let toastTimer = null;
  let toastCallback = null;

  function dateKey(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function parseDateKey(key) {
    const [year, month, day] = String(key).split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }

  function addDays(date, amount) {
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
    next.setDate(next.getDate() + amount);
    return next;
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
  }

  function todayKey() {
    return dateKey(new Date());
  }

  function yesterdayKey() {
    return dateKey(addDays(new Date(), -1));
  }

  function uid() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[character]));
  }

  function icon(name, className = '') {
    return `<svg class="icon ${className}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  }

  function sampleEntry(meal, tuple, date, suffix) {
    const [name, amount, calories, protein, carbs, fat, time] = tuple;
    return {
      id: `seed-${dateKey(date)}-${meal}-${suffix}`,
      meal,
      name,
      amount,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      time,
      createdAt: `${dateKey(date)}T${time}:00`
    };
  }

  function createInitialState() {
    const today = new Date();
    const entries = {};
    const water = {};
    const habits = {};
    const weights = {};
    const samplePlan = [
      { offset: -6, breakfast: ['菠菜蘑菇蛋卷', '1 份', 390, 24, 18, 25, '08:15'], lunch: ['照烧鸡腿饭', '1 份', 620, 35, 76, 19, '12:40'], dinner: ['番茄豆腐蔬菜汤', '1 碗', 560, 28, 66, 18, '19:10'] },
      { offset: -5, breakfast: ['香蕉花生酱吐司', '2 片', 410, 14, 52, 17, '07:55'], lunch: ['牛肉藜麦能量碗', '1 碗', 720, 46, 78, 23, '12:25'], dinner: ['虾仁西兰花炒饭', '1 份', 590, 35, 72, 18, '19:00'] },
      { offset: -4, breakfast: ['希腊酸奶与莓果', '1 碗', 390, 24, 42, 14, '08:20'], lunch: ['菌菇鸡肉意面', '1 份', 580, 36, 69, 20, '12:50'], dinner: ['南瓜小米粥配时蔬', '1 份', 520, 19, 78, 14, '18:45'] },
      { offset: -3, breakfast: ['牛油果鸡蛋贝果', '1 份', 520, 25, 55, 23, '08:05'], lunch: ['三文鱼糙米饭', '1 份', 690, 43, 72, 25, '12:30'], dinner: ['冬瓜丸子汤与青菜', '1 份', 610, 37, 47, 28, '19:15'] },
      { offset: -2, breakfast: ['蓝莓燕麦杯', '1 碗', 450, 22, 58, 14, '08:10'], lunch: ['鸡胸肉牛油果卷', '1 份', 610, 42, 49, 26, '12:45'], dinner: ['番茄虾仁荞麦面', '1 碗', 520, 31, 67, 14, '19:05'] },
      { offset: -1, breakfast: ['燕麦酸奶杯', '1 碗', 360, 20, 45, 11, '08:00'], lunch: ['番茄牛腩面', '1 碗', 620, 32, 79, 17, '12:35'], dinner: ['清蒸鲈鱼配时蔬', '1 份', 480, 39, 35, 18, '19:00'] },
      { offset: 0, breakfast: ['牛油果全麦吐司', '1 份', 380, 14, 42, 18, '08:10'], lunch: ['香煎鸡胸肉藜麦碗', '1 份', 560, 46, 56, 16, '12:35'], snack: ['希腊酸奶配蓝莓', '1 杯', 220, 18, 21, 7, '15:40'] }
    ];

    for (const plan of samplePlan) {
      const date = addDays(today, plan.offset);
      const key = dateKey(date);
      entries[key] = [];
      let index = 0;
      for (const meal of MEALS) {
        if (plan[meal.id]) {
          entries[key].push(sampleEntry(meal.id, plan[meal.id], date, index));
          index += 1;
        }
      }
    }

    const todayValue = dateKey(today);
    water[todayValue] = 4;
    water[dateKey(addDays(today, -1))] = 7;
    water[dateKey(addDays(today, -2))] = 6;
    water[dateKey(addDays(today, -3))] = 8;
    water[dateKey(addDays(today, -4))] = 5;
    habits[todayValue] = { veggies: true, mindful: true, noLate: false };

    return {
      version: 1,
      goal: { ...DEFAULT_GOAL },
      entries,
      water,
      habits,
      weights,
      meta: { demo: true, createdAt: new Date().toISOString() }
    };
  }

  function normalizeState(input) {
    const raw = input && input.state ? input.state : input;
    if (!raw || typeof raw !== 'object') throw new Error('数据格式不正确');
    const goalSource = raw.goal && typeof raw.goal === 'object' ? raw.goal : {};
    const goal = {
      calories: clamp(Number(goalSource.calories) || DEFAULT_GOAL.calories, 800, 5000),
      protein: clamp(Number(goalSource.protein) || DEFAULT_GOAL.protein, 20, 400),
      carbs: clamp(Number(goalSource.carbs) || DEFAULT_GOAL.carbs, 30, 700),
      fat: clamp(Number(goalSource.fat) || DEFAULT_GOAL.fat, 10, 250),
      water: clamp(Number(goalSource.water) || DEFAULT_GOAL.water, 1, 20)
    };
    const entries = {};
    if (raw.entries && typeof raw.entries === 'object') {
      for (const [key, list] of Object.entries(raw.entries)) {
        if (!Array.isArray(list)) continue;
        entries[key] = list.filter((entry) => entry && entry.name).map((entry) => ({
          id: String(entry.id || uid()),
          meal: MEALS.some((meal) => meal.id === entry.meal) ? entry.meal : 'snack',
          name: String(entry.name).slice(0, 80),
          amount: String(entry.amount || '').slice(0, 40),
          calories: Math.max(0, Number(entry.calories) || 0),
          protein: Math.max(0, Number(entry.protein) || 0),
          carbs: Math.max(0, Number(entry.carbs) || 0),
          fat: Math.max(0, Number(entry.fat) || 0),
          time: String(entry.time || '12:00').slice(0, 5),
          createdAt: String(entry.createdAt || new Date().toISOString())
        }));
      }
    }
    const water = {};
    if (raw.water && typeof raw.water === 'object') {
      for (const [key, value] of Object.entries(raw.water)) {
        water[key] = clamp(Number(value) || 0, 0, 20);
      }
    }
    const habits = raw.habits && typeof raw.habits === 'object' ? raw.habits : {};
    const weights = {};
    if (raw.weights && typeof raw.weights === 'object') {
      for (const [key, item] of Object.entries(raw.weights)) {
        const value = item && typeof item === 'object' ? item.weight : item;
        const weight = Number(value);
        if (!Number.isFinite(weight) || weight < 20 || weight > 300) continue;
        weights[key] = {
          weight: round1(weight),
          createdAt: String(item?.createdAt || new Date().toISOString())
        };
      }
    }
    return {
      version: 1,
      goal,
      entries,
      water,
      habits,
      weights,
      meta: { demo: Boolean(raw.meta && raw.meta.demo), createdAt: raw.meta?.createdAt || new Date().toISOString() }
    };
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return createInitialState();
      return normalizeState(JSON.parse(stored));
    } catch (error) {
      console.warn('读取本地记录失败，已使用初始数据。', error);
      return createInitialState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.warn('保存本地记录失败。', error);
      showToast('浏览器未能保存数据，请检查存储权限。');
      return false;
    }
  }

  function getEntries(key = selectedDate) {
    return Array.isArray(state.entries[key]) ? state.entries[key] : [];
  }

  function getWater(key = selectedDate) {
    return Number(state.water[key]) || 0;
  }

  function sumEntries(entries) {
    return entries.reduce((totals, entry) => ({
      calories: totals.calories + Number(entry.calories || 0),
      protein: totals.protein + Number(entry.protein || 0),
      carbs: totals.carbs + Number(entry.carbs || 0),
      fat: totals.fat + Number(entry.fat || 0),
      count: totals.count + 1
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 });
  }

  function totalsFor(key) {
    return sumEntries(getEntries(key));
  }

  function getWeightRecords() {
    if (!state.weights || typeof state.weights !== 'object') return [];
    return Object.entries(state.weights)
      .map(([date, item]) => {
        const value = item && typeof item === 'object' ? item.weight : item;
        const weight = Number(value);
        if (!Number.isFinite(weight) || weight < 20 || weight > 300) return null;
        return { date, weight, createdAt: item?.createdAt || '' };
      })
      .filter(Boolean)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  function weightOnOrBefore(key) {
    return getWeightRecords().filter((record) => record.date <= key).at(-1) || null;
  }

  function buildWeightSparkline(records, endDate, days = 14) {
    const startDate = addDays(endDate, -(days - 1));
    const startKey = dateKey(startDate);
    const endKey = dateKey(endDate);
    const points = records.filter((record) => record.date >= startKey && record.date <= endKey);
    if (!points.length) return '<div class="weight-sparkline-empty">还没有体重数据</div>';
    const width = 280;
    const height = 68;
    const padX = 7;
    const padTop = 9;
    const padBottom = 7;
    const values = points.map((record) => record.weight);
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (max - min < 0.6) {
      min -= 0.4;
      max += 0.4;
    } else {
      min -= 0.3;
      max += 0.3;
    }
    const coords = points.map((record) => {
      const offset = Math.round((parseDateKey(record.date) - startDate) / 86400000);
      const x = padX + (offset / Math.max(1, days - 1)) * (width - padX * 2);
      const y = padTop + ((max - record.weight) / (max - min)) * (height - padTop - padBottom);
      return { x, y, weight: record.weight, date: record.date };
    });
    const line = coords.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');
    const area = coords.length > 1
      ? `M ${coords[0].x.toFixed(1)} ${height - padBottom} L ${line.replaceAll(' ', ' L ')} L ${coords.at(-1).x.toFixed(1)} ${height - padBottom} Z`
      : '';
    const last = coords.at(-1);
    return `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="最近 14 天体重趋势">
        <defs>
          <linearGradient id="weightSparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#78cdb1" stop-opacity=".28"></stop>
            <stop offset="100%" stop-color="#78cdb1" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        ${area ? `<path d="${area}" fill="url(#weightSparkGradient)"></path>` : ''}
        ${coords.length > 1 ? `<polyline points="${line}" fill="none" stroke="#55b195" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polyline>` : ''}
        <circle cx="${last.x.toFixed(1)}" cy="${last.y.toFixed(1)}" r="3.5" fill="#55b195" stroke="#fff" stroke-width="2" vector-effect="non-scaling-stroke"></circle>
      </svg>`;
  }

  function renderWeightCard() {
    const records = getWeightRecords().filter((record) => record.date <= selectedDate);
    const latest = records.at(-1) || null;
    const previous = records.length > 1 ? records.at(-2) : null;
    const value = $('#currentWeightValue');
    const change = $('#weightChange');
    const lastDate = $('#weightLastDate');
    const sparkline = $('#weightSparkline');
    if (!latest) {
      if (value) value.textContent = '—';
      if (change) {
        change.textContent = '记录一次体重，开始趋势';
        change.className = 'weight-change';
      }
      if (lastDate) lastDate.textContent = '还没有体重记录';
      if (sparkline) sparkline.innerHTML = '<div class="weight-sparkline-empty">还没有体重数据</div>';
      return;
    }
    if (value) value.textContent = latest.weight.toFixed(1);
    if (change) {
      if (previous) {
        const diff = round1(latest.weight - previous.weight);
        change.textContent = `较上次 ${diff > 0 ? '+' : ''}${diff.toFixed(1)} kg`;
        change.className = `weight-change ${diff < 0 ? 'is-down' : diff > 0 ? 'is-up' : ''}`;
      } else {
        change.textContent = '首次记录 · 继续坚持';
        change.className = 'weight-change';
      }
    }
    if (lastDate) lastDate.textContent = `最近记录 · ${formatShortDate(parseDateKey(latest.date))}`;
    if (sparkline) sparkline.innerHTML = buildWeightSparkline(records, parseDateKey(selectedDate), 14);
  }

  function buildWeightLineChart(records, startDate, endDate) {
    if (!records.length) {
      return `<div class="weight-chart-empty"><strong>还没有体重趋势</strong><span>记录体重后，这里会显示最近 30 天的变化。</span></div>`;
    }
    const width = 1000;
    const height = 225;
    const left = 48;
    const right = 22;
    const top = 18;
    const bottom = 31;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const totalDays = Math.max(1, Math.round((endDate - startDate) / 86400000));
    const values = records.map((record) => record.weight);
    let min = Math.min(...values);
    let max = Math.max(...values);
    const spread = Math.max(0.8, max - min);
    min -= spread * 0.16;
    max += spread * 0.16;
    const coords = records.map((record) => {
      const offset = Math.round((parseDateKey(record.date) - startDate) / 86400000);
      const x = left + (offset / totalDays) * plotWidth;
      const y = top + ((max - record.weight) / (max - min)) * plotHeight;
      return { x, y, weight: record.weight, date: record.date };
    });
    const points = coords.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');
    const area = coords.length > 1
      ? `M ${coords[0].x.toFixed(1)} ${top + plotHeight} L ${points.replaceAll(' ', ' L ')} L ${coords.at(-1).x.toFixed(1)} ${top + plotHeight} Z`
      : '';
    const grid = Array.from({ length: 4 }, (_, index) => {
      const ratio = index / 3;
      const y = top + ratio * plotHeight;
      const label = max - ratio * (max - min);
      return `<line class="weight-chart-grid" x1="${left}" y1="${y.toFixed(1)}" x2="${width - right}" y2="${y.toFixed(1)}"></line><text class="weight-chart-label" x="${left - 9}" y="${(y + 3).toFixed(1)}" text-anchor="end">${label.toFixed(1)}</text>`;
    }).join('');
    const midDate = addDays(startDate, Math.round(totalDays / 2));
    const xLabels = [startDate, midDate, endDate].map((date) => {
      const offset = Math.round((date - startDate) / 86400000);
      const x = left + (offset / totalDays) * plotWidth;
      return `<text class="weight-chart-label" x="${x.toFixed(1)}" y="${height - 7}" text-anchor="middle">${formatShortDate(date)}</text>`;
    }).join('');
    return `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="最近 30 天体重变化">
        <defs>
          <linearGradient id="weightTrendAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#84d5ba" stop-opacity=".3"></stop>
            <stop offset="100%" stop-color="#84d5ba" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        ${grid}
        ${xLabels}
        ${area ? `<path d="${area}" fill="url(#weightTrendAreaGradient)"></path>` : ''}
        ${coords.length > 1 ? `<polyline points="${points}" fill="none" stroke="#55b195" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polyline>` : ''}
        ${coords.map((point, index) => `<circle class="weight-chart-point ${index === coords.length - 1 ? 'latest' : ''}" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${index === coords.length - 1 ? 4.4 : 3.1}" vector-effect="non-scaling-stroke"><title>${formatDateLabel(point.date)} · ${point.weight.toFixed(1)} kg</title></circle>`).join('')}
      </svg>`;
  }

  function renderWeightTrend() {
    const endDate = new Date();
    const startDate = addDays(endDate, -29);
    const startKey = dateKey(startDate);
    const endKey = dateKey(endDate);
    const records = getWeightRecords().filter((record) => record.date >= startKey && record.date <= endKey);
    const latest = records.at(-1) || null;
    const first = records[0] || null;
    const current = $('#weightTrendCurrent');
    const change = $('#weightTrendChange');
    const count = $('#weightTrendCount');
    const chart = $('#weightLineChart');
    if (current) current.innerHTML = latest ? `${latest.weight.toFixed(1)}<small> kg</small>` : '—<small> kg</small>';
    if (count) count.innerHTML = `${records.length}<small> 次</small>`;
    if (change) {
      if (latest && first && records.length > 1) {
        const diff = round1(latest.weight - first.weight);
        change.textContent = `${diff > 0 ? '+' : ''}${diff.toFixed(1)} kg`;
        change.style.color = diff < 0 ? '#378b73' : diff > 0 ? '#b47a51' : '#54736a';
      } else {
        change.textContent = '—';
        change.style.color = '#54736a';
      }
    }
    if (chart) chart.innerHTML = buildWeightLineChart(records, startDate, endDate);
  }

  function openWeightDialog(anchorKey = selectedDate) {
    const dialog = $('#weightDialog');
    const form = $('#weightForm');
    if (!dialog || !form) return;
    form.reset();
    const date = anchorKey && anchorKey <= todayKey() ? anchorKey : todayKey();
    const existing = state.weights?.[date];
    const latest = weightOnOrBefore(date);
    $('#weightDateInput').value = date;
    $('#weightDateInput').max = todayKey();
    $('#weightInput').max = '300';
    $('#weightInput').value = existing ? Number(existing.weight).toFixed(1) : latest ? latest.weight.toFixed(1) : '';
    dialog.showModal();
    setTimeout(() => {
      const input = $('#weightInput');
      input?.focus();
      input?.select();
    }, 80);
  }

  function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value;
  }

  function formatDateLabel(key) {
    const date = parseDateKey(key);
    return `${date.getMonth() + 1}月${date.getDate()}日 · ${WEEKDAYS[date.getDay()]}`;
  }

  function formatShortDate(date) {
    return `${date.getMonth() + 1}.${pad(date.getDate())}`;
  }

  function foodEmoji(name) {
    const rules = [
      [/咖啡|拿铁|美式/, '☕'], [/酸奶|牛奶/, '🥛'], [/沙拉|蔬菜|西兰花|青菜/, '🥗'],
      [/鸡|鸭|肉丸/, '🍗'], [/鱼|鲈鱼|三文鱼|虾仁|虾/, '🐟'], [/蛋|鸡蛋/, '🥚'],
      [/面|意面|荞麦/, '🍜'], [/米饭|藜麦|糙米|炒饭/, '🍚'], [/吐司|贝果|面包/, '🍞'],
      [/香蕉/, '🍌'], [/苹果/, '🍎'], [/蓝莓|莓果/, '🫐'], [/牛油果/, '🥑'],
      [/燕麦|小米|粥/, '🥣'], [/坚果|花生/, '🥜'], [/豆腐/, '🍲'], [/南瓜|冬瓜|番茄/, '🥘']
    ];
    for (const [pattern, emoji] of rules) {
      if (pattern.test(name)) return emoji;
    }
    return '🍽️';
  }

  function mealById(id) {
    return MEALS.find((meal) => meal.id === id) || MEALS[0];
  }

  function renderAll() {
    renderToday();
    renderCalendar();
    renderTrends();
    renderGoals();
    renderSidebar();
    updateChrome();
  }

  function renderToday() {
    const entries = getEntries();
    const totals = sumEntries(entries);
    const goal = state.goal;
    const calories = Math.round(totals.calories);
    const loggedMeals = new Set(entries.map((entry) => entry.meal)).size;
    const water = getWater();
    const percent = goal.calories > 0 ? calories / goal.calories : 0;

    setText('#selectedDateLabel', formatDateLabel(selectedDate));
    setText('#selectedDateTag', selectedDate === todayKey() ? '今天' : selectedDate === yesterdayKey() ? '昨天' : selectedDate > todayKey() ? '未来' : '历史');
    const nextButton = $('#nextDateButton');
    if (nextButton) nextButton.disabled = selectedDate >= todayKey();
    const todayButton = $('#todayButton');
    if (todayButton) todayButton.hidden = selectedDate === todayKey();

    const demoBanner = $('#demoBanner');
    if (demoBanner) demoBanner.classList.toggle('hidden', !state.meta.demo);

    setText('#ringCalories', fmt.format(calories));
    setText('#ringGoal', fmt.format(goal.calories));
    setText('#ringRemaining', calories > goal.calories ? `已超出 ${fmt.format(calories - goal.calories)} kcal` : `还可摄入 ${fmt.format(goal.calories - calories)}`);
    const ring = $('#calorieRing');
    if (ring) {
      const circumference = 477.52;
      ring.style.strokeDashoffset = String(circumference * (1 - Math.min(percent, 1)));
      ring.style.stroke = percent > 1.08 ? '#f4aa88' : '#d8f59c';
    }

    let headline = '今天的第一餐，<br>从温柔开始。';
    if (percent > 0 && percent < 0.42) headline = '好好吃饭，<br>是一天的底气。';
    else if (percent >= 0.42 && percent < 0.82) headline = '吃得刚刚好，<br>身体自有答案。';
    else if (percent >= 0.82 && percent <= 1.08) headline = '今日能量，<br>刚刚好。';
    else if (percent > 1.08) headline = '偶尔多一点，<br>也没关系。';
    const headlineElement = $('#heroHeadline');
    if (headlineElement) headlineElement.innerHTML = headline;

    let message = '还没有记录，来添加今天的第一份食物吧。';
    if (entries.length) {
      if (totals.protein < goal.protein * 0.68) message = '蛋白质还有提升空间，下一餐可以加一点鸡蛋或豆制品。';
      else if (totals.fat > goal.fat * 1.1) message = '今天的脂肪稍高，下一餐可以选清淡些的蔬菜和汤。';
      else if (water < goal.water) message = '饮食节奏不错，记得再补充一点水分。';
      else message = '今天的饮食与饮水都很稳定，继续保持这份节奏。';
    }
    setText('#heroMessage', message);
    setText('#heroMealCount', String(loggedMeals));
    $('#heroProtein').innerHTML = `${Math.round(totals.protein)}<small>g</small>`;
    $('#heroWater').innerHTML = `${water}<small>/${goal.water}</small>`;

    renderMeals(entries);
    renderMacros(totals);
    renderWater(water);
    renderWeightCard();
    renderWeekly();
    renderHabits();
  }

  function renderMeals(entries) {
    const container = $('#mealGroups');
    if (!container) return;
    container.innerHTML = MEALS.map((meal) => {
      const items = entries.filter((entry) => entry.meal === meal.id).sort((a, b) => String(a.time).localeCompare(String(b.time)));
      const mealCalories = Math.round(items.reduce((sum, entry) => sum + Number(entry.calories || 0), 0));
      const rows = items.length ? items.map((entry) => `
        <div class="food-entry" data-entry-id="${escapeHTML(entry.id)}">
          <span class="food-emoji">${foodEmoji(entry.name)}</span>
          <span class="food-info"><strong>${escapeHTML(entry.name)}</strong><span>${escapeHTML(entry.amount || '1 份')} · ${escapeHTML(entry.time || '')}</span></span>
          <span class="food-macros"><span>蛋 <b>${round1(entry.protein)}g</b></span><span>碳 <b>${round1(entry.carbs)}g</b></span><span>脂 <b>${round1(entry.fat)}g</b></span></span>
          <span class="food-calories">${fmt.format(Math.round(entry.calories))} kcal</span>
          <span class="food-actions">
            <button class="food-action" type="button" data-food-action="edit" aria-label="编辑 ${escapeHTML(entry.name)}">${icon('edit')}</button>
            <button class="food-action danger" type="button" data-food-action="delete" aria-label="删除 ${escapeHTML(entry.name)}">${icon('trash')}</button>
          </span>
        </div>`).join('') : `<div class="empty-meal">还没有记录${meal.label}</div>`;
      return `
        <section class="meal-group" style="--meal-color:${meal.color};--meal-bg:${meal.bg}">
          <div class="meal-group-header">
            <span class="meal-group-icon">${icon(meal.icon)}</span>
            <span class="meal-group-title"><strong>${meal.label}</strong><span>建议 ${meal.time} 左右</span></span>
            <span class="meal-group-total">${mealCalories ? `${fmt.format(mealCalories)} kcal` : '—'}</span>
            <button class="meal-add-mini" type="button" data-add-meal="${meal.id}" aria-label="添加${meal.label}">${icon('plus')}</button>
          </div>
          <div class="food-list">${rows}</div>
        </section>`;
    }).join('');
  }

  function renderMacros(totals) {
    const container = $('#macroList');
    if (!container) return;
    const macros = [
      { key: 'protein', label: '蛋白质', unit: 'g', color: '#5b9875', goal: state.goal.protein },
      { key: 'carbs', label: '碳水', unit: 'g', color: '#e6b94f', goal: state.goal.carbs },
      { key: 'fat', label: '脂肪', unit: 'g', color: '#e88d6b', goal: state.goal.fat }
    ];
    container.innerHTML = macros.map((macro) => {
      const value = totals[macro.key];
      const percent = macro.goal > 0 ? (value / macro.goal) * 100 : 0;
      return `
        <div class="macro-row" style="--macro-color:${macro.color}">
          <div class="macro-row-header"><span class="macro-name"><i class="macro-dot"></i>${macro.label}</span><span class="macro-value"><b>${Math.round(value)}</b> / ${macro.goal} ${macro.unit}</span></div>
          <div class="macro-bar"><span style="width:${clamp(percent, 0, 100)}%"></span></div>
        </div>`;
    }).join('');

    let title = '营养搭配均衡';
    let text = '继续保持蔬菜、蛋白质和主食的组合。';
    if (!totals.count) {
      title = '还没有营养数据';
      text = '记录一餐后，这里会自动分析。';
    } else if (totals.protein < state.goal.protein * 0.7) {
      title = '蛋白质还可以补充一点';
      text = '下一餐加些鸡蛋、鱼虾或豆制品吧。';
    } else if (totals.fat > state.goal.fat * 1.1) {
      title = '脂肪摄入稍高';
      text = '下一餐试试清蒸或少油的烹饪方式。';
    } else if (totals.carbs < state.goal.carbs * 0.55) {
      title = '主食稍少一些';
      text = '适量主食能让能量更稳定。';
    }
    setText('#macroBalanceTitle', title);
    setText('#macroBalanceText', text);
  }

  function renderWater(count) {
    const goal = Math.max(1, Number(state.goal.water) || 8);
    setText('#waterBigNumber', String(count));
    setText('#waterGoalLabel', `目标 ${goal} 杯`);
    setText('#waterHint', count >= goal ? '今日饮水目标已完成' : `再喝 ${goal - count} 杯就达成目标`);
    const container = $('#waterCups');
    if (!container) return;
    container.style.gridTemplateColumns = `repeat(${Math.min(goal, 20)}, minmax(0, 1fr))`;
    container.innerHTML = Array.from({ length: goal }, (_, index) => `
      <button class="cup ${index < count ? 'filled' : ''}" type="button" data-cup="${index + 1}" aria-label="设置为 ${index + 1} 杯水" title="第 ${index + 1} 杯">
        ${icon('droplet')}
      </button>`).join('');
  }

  function buildWeekChart(dates, large = false, highlightKey = selectedDate) {
    const values = dates.map((date) => Math.round(totalsFor(dateKey(date)).calories));
    const area = large ? 220 : 125;
    const max = Math.max(state.goal.calories * 1.22, ...values, 1000);
    const goalBottom = 29 + (state.goal.calories / max) * area;
    const columns = dates.map((date, index) => {
      const key = dateKey(date);
      const calories = values[index];
      const height = calories > 0 ? Math.max(5, (calories / max) * area) : 4;
      const highlighted = key === highlightKey;
      return `
        <div class="week-col ${highlighted ? 'is-today' : ''}">
          <div class="week-bar-area">
            <div class="week-bar ${calories === 0 ? 'is-empty' : ''} ${highlighted ? 'is-today' : ''}" style="height:${height.toFixed(1)}px" title="${formatDateLabel(key)} · ${fmt.format(calories)} kcal">
              <span class="week-bar-value">${calories ? fmt.format(calories) : '未记录'}</span>
            </div>
          </div>
          <div class="week-day"><strong>${date.getDate()}</strong><span>${WEEKDAYS_SHORT[date.getDay()]}</span></div>
        </div>`;
    }).join('');
    return `<div class="goal-line" style="--goal-bottom:${goalBottom.toFixed(1)}px"></div>${columns}`;
  }

  function renderWeekly() {
    const anchor = parseDateKey(selectedDate);
    const dates = Array.from({ length: 7 }, (_, index) => addDays(anchor, index - 6));
    const totals = dates.map((date) => totalsFor(dateKey(date)));
    const logged = totals.filter((item) => item.calories > 0);
    const average = logged.length ? Math.round(logged.reduce((sum, item) => sum + item.calories, 0) / logged.length) : 0;
    const goalDays = totals.filter((item) => item.calories >= state.goal.calories * 0.9 && item.calories <= state.goal.calories * 1.1).length;
    const previousDates = Array.from({ length: 7 }, (_, index) => addDays(anchor, index - 13));
    const previousLogged = previousDates.map((date) => totalsFor(dateKey(date))).filter((item) => item.calories > 0);
    const previousAverage = previousLogged.length ? previousLogged.reduce((sum, item) => sum + item.calories, 0) / previousLogged.length : 0;
    setText('#weeklyAverage', '');
    const averageElement = $('#weeklyAverage');
    if (averageElement) averageElement.innerHTML = `${fmt.format(average)}<small> kcal</small>`;
    const goalDaysElement = $('#weeklyGoalDays');
    if (goalDaysElement) goalDaysElement.innerHTML = `${goalDays}<small> / 7 天</small>`;
    const changeElement = $('#weeklyChange');
    if (changeElement) {
      if (!previousAverage) {
        changeElement.textContent = '首周';
        changeElement.className = 'trend-positive';
      } else {
        const change = ((average - previousAverage) / previousAverage) * 100;
        changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
        changeElement.className = change <= 5 ? 'trend-positive' : 'trend-negative';
      }
    }
    const chart = $('#weekChart');
    if (chart) chart.innerHTML = buildWeekChart(dates, false, selectedDate);
  }

  function renderHabits() {
    const habits = state.habits[selectedDate] || {};
    $$('.habit-item').forEach((item) => {
      item.classList.toggle('done', Boolean(habits[item.dataset.habit]));
    });
  }

  function renderSidebar() {
    let cursor = new Date();
    let count = 0;
    if (!getEntries(dateKey(cursor)).length) cursor = addDays(cursor, -1);
    while (getEntries(dateKey(cursor)).length && count < 365) {
      count += 1;
      cursor = addDays(cursor, -1);
    }
    setText('#streakDays', String(count));
  }
  function renderCalendar() {
    const label = $('#calendarMonthLabel');
    if (label) label.textContent = `${calendarCursor.getFullYear()} 年 ${calendarCursor.getMonth() + 1} 月`;
    const grid = $('#calendarGrid');
    if (!grid) return;
    const first = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth(), 1, 12, 0, 0, 0);
    const offset = (first.getDay() + 6) % 7;
    const gridStart = addDays(first, -offset);
    const today = todayKey();
    const cells = [];
    for (let index = 0; index < 42; index += 1) {
      const date = addDays(gridStart, index);
      const key = dateKey(date);
      const totals = totalsFor(key);
      const calories = Math.round(totals.calories);
      const ratio = state.goal.calories > 0 ? calories / state.goal.calories : 0;
      let status = 'status-empty';
      if (calories > 0) status = ratio > 1.1 ? 'status-high' : ratio >= 0.82 ? 'status-on' : 'status-low';
      const classes = [
        'calendar-day',
        date.getMonth() !== calendarCursor.getMonth() ? 'other-month' : '',
        key === selectedDate ? 'selected' : '',
        key === today ? 'today' : '',
        status
      ].filter(Boolean).join(' ');
      cells.push(`
        <button class="${classes}" type="button" data-date="${key}" aria-label="${formatDateLabel(key)}${calories ? `，摄入 ${fmt.format(calories)} 千卡` : '，未记录'}">
          <span class="day-number">${date.getDate()}</span>
          <span class="day-calories">${calories ? `${fmt.format(calories)}<span> kcal</span>` : '—'}</span>
          <span class="day-progress" aria-hidden="true"><span style="width:${clamp(ratio * 100, calories ? 5 : 0, 100)}%"></span></span>
        </button>`);
    }
    grid.innerHTML = cells.join('');
    renderDayDetail();
  }

  function renderDayDetail() {
    const totals = totalsFor(selectedDate);
    const calories = Math.round(totals.calories);
    const ratio = state.goal.calories > 0 ? calories / state.goal.calories : 0;
    const entries = getEntries();
    setText('#dayDetailDate', `${parseDateKey(selectedDate).getMonth() + 1}月${parseDateKey(selectedDate).getDate()}日`);
    setText('#dayDetailWeekday', WEEKDAYS[parseDateKey(selectedDate).getDay()]);
    setText('#dayDetailCalories', fmt.format(calories));
    setText('#dayDetailProgress', `${Math.round(ratio * 100)}%`);
    setText('#dayDetailGoal', `目标 ${fmt.format(state.goal.calories)} kcal`);
    const badge = $('#dayDetailBadge');
    if (badge) {
      badge.textContent = selectedDate === todayKey() ? '今天' : entries.length ? '已记录' : '未记录';
      badge.classList.toggle('muted', !entries.length && selectedDate !== todayKey());
    }
    const ring = $('#dayDetailRing');
    if (ring) ring.style.strokeDashoffset = String(301.59 * (1 - Math.min(ratio, 1)));
    const stats = $('#dayDetailStats');
    if (stats) {
      stats.innerHTML = `
        <div class="day-stat"><strong>${Math.round(totals.protein)}g</strong><span>蛋白质</span></div>
        <div class="day-stat"><strong>${Math.round(totals.carbs)}g</strong><span>碳水</span></div>
        <div class="day-stat"><strong>${getWater()}</strong><span>杯水</span></div>`;
    }
    const preview = $('#dayMealPreview');
    if (preview) {
      preview.innerHTML = entries.length ? entries.slice(0, 4).map((entry) => `
        <div class="preview-meal"><span>${foodEmoji(entry.name)}</span><strong>${escapeHTML(entry.name)}</strong><small>${fmt.format(Math.round(entry.calories))} kcal</small></div>
      `).join('') : '<div class="preview-empty">这一天还没有饮食记录</div>';
    }
  }

  function renderTrends() {
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, index) => addDays(today, index - 6));
    const totals = dates.map((date) => totalsFor(dateKey(date)));
    const logged = totals.filter((item) => item.calories > 0);
    const totalMeals = totals.reduce((sum, item) => sum + item.count, 0);
    const averageCalories = logged.length ? Math.round(logged.reduce((sum, item) => sum + item.calories, 0) / logged.length) : 0;
    const averageProtein = logged.length ? Math.round(logged.reduce((sum, item) => sum + item.protein, 0) / logged.length) : 0;
    const goalDays = totals.filter((item) => item.calories >= state.goal.calories * 0.9 && item.calories <= state.goal.calories * 1.1).length;
    const previousDates = Array.from({ length: 7 }, (_, index) => addDays(today, index - 13));
    const previousLogged = previousDates.map((date) => totalsFor(dateKey(date))).filter((item) => item.calories > 0);
    const previousAverage = previousLogged.length ? previousLogged.reduce((sum, item) => sum + item.calories, 0) / previousLogged.length : 0;
    const calorieChange = previousAverage ? ((averageCalories - previousAverage) / previousAverage) * 100 : 0;

    const statCards = [
      { label: '近 7 天日均热量', value: fmt.format(averageCalories), unit: ' kcal', note: previousAverage ? `${calorieChange >= 0 ? '较上周期 +' : '较上周期 '}${calorieChange.toFixed(1)}%` : '开始记录新的周期', icon: 'flame', color: '#d36f50', bg: '#fce7dc' },
      { label: '日均蛋白质', value: Math.round(averageProtein), unit: ' g', note: `每日目标 ${state.goal.protein} g`, icon: 'dumbbell', color: '#4e8b68', bg: '#e5f3e8' },
      { label: '已记录天数', value: logged.length, unit: ' / 7 天', note: `共记录 ${totalMeals} 餐`, icon: 'calendar', color: '#39848e', bg: '#e0f2f2' },
      { label: '热量目标达成', value: goalDays, unit: ' / 7 天', note: '目标上下浮动 10%', icon: 'target', color: '#a07836', bg: '#fbf0cf' }
    ];
    const statsContainer = $('#trendStats');
    if (statsContainer) {
      statsContainer.innerHTML = statCards.map((card) => `
        <article class="trend-stat-card" style="--stat-color:${card.color};--stat-bg:${card.bg}">
          <span class="trend-stat-icon">${icon(card.icon)}</span>
          <span>${card.label}</span>
          <strong>${card.value}<small>${card.unit}</small></strong>
          <small>${card.note}</small>
        </article>`).join('');
    }
    const chart = $('#trendChart');
    if (chart) chart.innerHTML = buildWeekChart(dates, true, todayKey());
    setText('#trendRangeLabel', `${formatShortDate(dates[0])} — ${formatShortDate(dates[6])}`);

    const proteinCalories = totals.reduce((sum, item) => sum + item.protein * 4, 0);
    const carbCalories = totals.reduce((sum, item) => sum + item.carbs * 4, 0);
    const fatCalories = totals.reduce((sum, item) => sum + item.fat * 9, 0);
    const macroCalories = proteinCalories + carbCalories + fatCalories;
    const proteinPercent = macroCalories ? Math.round((proteinCalories / macroCalories) * 100) : 0;
    const carbPercent = macroCalories ? Math.round((carbCalories / macroCalories) * 100) : 0;
    const fatPercent = macroCalories ? Math.max(0, 100 - proteinPercent - carbPercent) : 0;
    const donut = $('#macroDonut');
    if (donut) {
      const p1 = proteinPercent;
      const p2 = p1 + carbPercent;
      donut.style.background = macroCalories
        ? `conic-gradient(#5e9679 0 ${p1}%, #efc568 ${p1}% ${p2}%, #ea8e6b ${p2}% 100%)`
        : 'conic-gradient(#e9e4da 0 100%)';
    }
    setText('#donutCalories', fmt.format(averageCalories));
    const legend = $('#donutLegend');
    if (legend) {
      legend.innerHTML = [
        { label: '蛋白质', value: proteinPercent, color: '#5e9679' },
        { label: '碳水', value: carbPercent, color: '#efc568' },
        { label: '脂肪', value: fatPercent, color: '#ea8e6b' }
      ].map((item) => `<div class="donut-legend-row"><i style="background:${item.color}"></i><span>${item.label}</span><strong>${item.value}%</strong></div>`).join('');
    }

    let insightTitle = '你的饮食节奏很稳定';
    let insightText = '最近 7 天的热量摄入波动不大，继续保持规律的三餐节奏。';
    if (logged.length < 3) {
      insightTitle = '再多记录几天吧';
      insightText = '完整记录几天后，才能更准确地看到你的饮食节奏。';
    } else if (goalDays >= 5) {
      insightTitle = '这周的目标完成得很好';
      insightText = '大多数日子的热量都落在目标范围内，规律比完美更重要。';
    } else if (averageProtein < state.goal.protein * 0.75) {
      insightTitle = '可以多留意蛋白质';
      insightText = '在早餐或加餐中加入鸡蛋、酸奶或豆制品，会让营养更均衡。';
    } else if (Math.abs(calorieChange) > 15) {
      insightTitle = '本周的摄入变化比较明显';
      insightText = '不需要刻意补偿，恢复到规律的三餐节奏就好。';
    }
    setText('#insightTitle', insightTitle);
    setText('#insightText', insightText);
    renderWeightTrend();
  }

  function renderGoals() {
    const form = $('#goalForm');
    if (!form) return;
    if (form.contains(document.activeElement)) return;
    for (const key of Object.keys(DEFAULT_GOAL)) {
      if (form.elements[key]) form.elements[key].value = state.goal[key];
    }
  }

  function updateChrome() {
    const config = {
      today: { eyebrow: `DAILY NOTES · ${new Date().getFullYear()}`, title: selectedDate === todayKey() ? '今天，也好好吃饭' : '这一天，吃了什么', doc: '今日记录' },
      calendar: { eyebrow: 'MEAL CALENDAR · OVERVIEW', title: '每一餐，都有迹可循', doc: '饮食日历' },
      trends: { eyebrow: 'NUTRITION · LAST 7 DAYS', title: '从趋势里，读懂身体', doc: '营养趋势' },
      goals: { eyebrow: 'YOUR TARGETS · SETTINGS', title: '给身体一个温柔目标', doc: '我的目标' }
    }[activeView];
    setText('#pageEyebrow', config.eyebrow);
    setText('#pageTitle', config.title);
    document.title = `${config.doc} · 食光`;
    $$('.nav-item, .mobile-nav [data-view-target]').forEach((button) => {
      button.classList.toggle('active', button.dataset.viewTarget === activeView);
    });
    $$('.view').forEach((view) => view.classList.toggle('active', view.id === `view-${activeView}`));
  }

  function syncViewUrl(view) {
    try {
      const url = new URL(window.location.href);
      if (view === 'today') url.searchParams.delete('view');
      else url.searchParams.set('view', view);
      history.replaceState(null, '', url.href);
    } catch (error) {
      console.warn('无法更新页面地址', error);
    }
  }

  function setView(view, options = {}) {
    if (!['today', 'calendar', 'trends', 'goals'].includes(view)) return;
    activeView = view;
    syncViewUrl(view);
    if (view === 'today' && !options.keepDate) selectedDate = todayKey();
    if (view === 'calendar') calendarCursor = startOfMonth(parseDateKey(selectedDate));
    if (view === 'today') {
      const nextButton = $('#nextDateButton');
      if (nextButton) nextButton.disabled = selectedDate >= todayKey();
    }
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderMealPicker() {
    const container = $('#mealPicker');
    if (!container) return;
    container.innerHTML = MEALS.map((meal) => `
      <button class="meal-option ${meal.id === currentMeal ? 'active' : ''}" type="button" data-meal-option="${meal.id}">
        ${icon(meal.icon)}<span>${meal.label}</span>
      </button>`).join('');
  }

  function renderQuickPicks() {
    const container = $('#quickPicks');
    if (!container) return;
    container.innerHTML = QUICK_PICKS.map((food) => `<button class="quick-pick" type="button" data-quick-pick="${food.id}">${food.emoji} ${food.label}</button>`).join('');
  }

  const FOOD_LOOKUP = FOOD_DATABASE
    .flatMap((food) => food.aliases.map((alias) => ({ food, alias: normalizeFoodText(alias) })))
    .sort((a, b) => b.alias.length - a.alias.length);

  function normalizeFoodText(value) {
    return String(value || '').toLowerCase().replace(/[\s（）()\[\]【】,，。·:：、\-_/]/g, '');
  }

  function matchFood(name) {
    const normalized = normalizeFoodText(name);
    if (!normalized) return null;
    const exact = FOOD_LOOKUP.find((item) => item.alias === normalized);
    if (exact) return exact.food;
    const contained = FOOD_LOOKUP.find((item) => normalized.includes(item.alias));
    if (contained) return contained.food;
    if (normalized.length >= 2) {
      const partial = FOOD_LOOKUP.find((item) => item.alias.includes(normalized));
      if (partial) return partial.food;
    }
    return null;
  }

  function parsePortionAmount(text, food) {
    const cleaned = String(text || '').trim().toLowerCase().replace(/\s+/g, '').replace(/约|大约|左右/g, '');
    if (!cleaned) return null;
    const unitPattern = '(千克|公斤|kg|克|g|毫升|ml|升|l|小碗|大碗|碗|份|个|片|杯|根|勺|块|盒|把|罐)';
    let quantity = null;
    let rawUnit = 'g';
    const numeric = cleaned.match(new RegExp(`(\\d+(?:\\.\\d+)?)${unitPattern}?`));
    if (numeric) {
      quantity = Number(numeric[1]);
      rawUnit = numeric[2] || 'g';
    } else {
      const cnNumbers = { '一': 1, '二': 2, '两': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 };
      const chinese = cleaned.match(new RegExp(`([一二两三四五六七八九十])${unitPattern}`));
      if (chinese) {
        quantity = cnNumbers[chinese[1]];
        rawUnit = chinese[2];
      } else if (/半/.test(cleaned)) {
        const half = cleaned.match(new RegExp(`半${unitPattern}`));
        quantity = 0.5;
        rawUnit = half ? half[1] : 'g';
      }
    }
    if (!Number.isFinite(quantity) || quantity <= 0) return null;

    let unit = rawUnit;
    let factor = 1;
    if (unit === '小碗') { unit = '碗'; factor = 0.8; }
    else if (unit === '大碗') { unit = '碗'; factor = 1.3; }

    const metricUnits = { g: 1, '克': 1, kg: 1000, '千克': 1000, '公斤': 1000, ml: 1, '毫升': 1, l: 1000, '升': 1000 };
    let grams;
    if (metricUnits[unit]) {
      grams = quantity * metricUnits[unit];
    } else {
      const perUnit = food?.portions?.[unit] || DEFAULT_PORTION_GRAMS[unit] || DEFAULT_PORTION_GRAMS['份'];
      grams = quantity * perUnit * factor;
    }
    if (!Number.isFinite(grams) || grams <= 0) return null;
    return {
      grams: round1(clamp(grams, 1, 5000)),
      quantity,
      unit,
      rawUnit,
      measured: Boolean(metricUnits[rawUnit])
    };
  }

  function fallbackNutritionProfile(name) {
    const text = normalizeFoodText(name);
    if (/沙拉|蔬菜|西兰花|生菜|菠菜|青菜|黄瓜|冬瓜|蘑菇/.test(text)) {
      return { label: '蔬菜类均值', per100g: { calories: 55, protein: 2.5, carbs: 7, fat: 1.8 } };
    }
    if (/饭|面|粥|粉|饺|包|米线|意面/.test(text)) {
      return { label: '主食类均值', per100g: { calories: 135, protein: 5, carbs: 22, fat: 3 } };
    }
    if (/鸡|鸭|牛|猪|羊|鱼|虾|蛋|豆腐|肉/.test(text)) {
      return { label: '蛋白质类均值', per100g: { calories: 180, protein: 18, carbs: 3, fat: 10 } };
    }
    if (/苹果|香蕉|橙|莓|猕猴桃|水果|梨|桃/.test(text)) {
      return { label: '水果类均值', per100g: { calories: 60, protein: 0.8, carbs: 14, fat: 0.3 } };
    }
    if (/奶|酸奶|咖啡|豆浆|饮料|茶/.test(text)) {
      return { label: '饮品类均值', per100g: { calories: 60, protein: 3, carbs: 6, fat: 2.5 } };
    }
    if (/吐司|面包|贝果|燕麦|饼干/.test(text)) {
      return { label: '烘焙类均值', per100g: { calories: 260, protein: 9, carbs: 44, fat: 5 } };
    }
    return { label: '常见食物均值', per100g: { calories: 150, protein: 7, carbs: 18, fat: 5 } };
  }

  function estimateNutrition(name, amount) {
    if (!String(name || '').trim() || !String(amount || '').trim()) return null;
    const food = matchFood(name);
    const profile = food || fallbackNutritionProfile(name);
    const portion = parsePortionAmount(amount, food);
    if (!portion) return null;
    const scale = portion.grams / 100;
    return {
      matched: Boolean(food),
      foodName: food?.name || profile.label,
      profileName: profile.label,
      per100g: profile.per100g,
      portion,
      values: {
        calories: Math.round(profile.per100g.calories * scale),
        protein: round1(profile.per100g.protein * scale),
        carbs: round1(profile.per100g.carbs * scale),
        fat: round1(profile.per100g.fat * scale)
      }
    };
  }

  function estimatorPlaceholder() {
    return '<span><b>—</b><small>kcal</small></span><span><b>—</b><small>蛋白质</small></span><span><b>—</b><small>碳水</small></span><span><b>—</b><small>脂肪</small></span>';
  }

  function fillNutritionInputs(values) {
    const pairs = [
      ['#foodCalories', Math.round(values.calories)],
      ['#foodProtein', round1(values.protein)],
      ['#foodCarbs', round1(values.carbs)],
      ['#foodFat', round1(values.fat)]
    ];
    for (const [selector, value] of pairs) {
      const input = $(selector);
      if (!input) continue;
      input.value = String(value);
      input.classList.remove('auto-filled');
      void input.offsetWidth;
      input.classList.add('auto-filled');
    }
  }

  function updateNutritionEstimator(options = {}) {
    const fill = options.fill !== false;
    const estimator = $('#nutritionEstimator');
    if (!estimator) return;
    const name = $('#foodName')?.value.trim() || '';
    const amount = $('#foodAmount')?.value.trim() || '';
    const status = $('#nutritionStatus');
    const preview = $('#nutritionPreview');
    const note = $('#nutritionNote');
    estimator.classList.remove('is-ready', 'is-approximate');
    if (!name) {
      if (status) status.textContent = '等待输入';
      if (preview) preview.innerHTML = estimatorPlaceholder();
      if (note) note.textContent = '输入食物名称和分量，热量与营养会自动填入下方。';
      return;
    }
    if (!amount) {
      const matched = matchFood(name);
      if (status) status.textContent = '等待分量';
      if (preview) preview.innerHTML = estimatorPlaceholder();
      if (note) note.textContent = matched ? `已找到「${matched.name}」，再输入 150g、1 碗或 2 片即可估算。` : '请输入分量，例如 150g、1 碗或 2 片。';
      return;
    }
    const estimate = estimateNutrition(name, amount);
    if (!estimate) {
      if (status) status.textContent = '无法识别分量';
      if (preview) preview.innerHTML = estimatorPlaceholder();
      if (note) note.textContent = '请使用克、毫升、碗、份、个、片、杯等分量单位。';
      return;
    }
    estimator.classList.add(estimate.matched ? 'is-ready' : 'is-approximate');
    if (status) status.textContent = estimate.matched ? `已匹配 · ${estimate.foodName}` : `同类估算 · ${estimate.profileName}`;
    if (preview) {
      preview.innerHTML = `
        <span><b>${fmt.format(estimate.values.calories)}</b><small>kcal</small></span>
        <span><b>${round1(estimate.values.protein)}</b><small>蛋白质</small></span>
        <span><b>${round1(estimate.values.carbs)}</b><small>碳水</small></span>
        <span><b>${round1(estimate.values.fat)}</b><small>脂肪</small></span>`;
    }
    if (note) {
      const source = estimate.matched
        ? `${estimate.foodName} · 每 100g ${estimate.per100g.calories} kcal`
        : `未精确匹配，按${estimate.profileName}估算`;
      const measure = estimate.portion.measured
        ? `${estimate.portion.quantity}${estimate.portion.unit}`
        : `${estimate.portion.quantity}${estimate.portion.unit} ≈ ${estimate.portion.grams}g`;
      note.textContent = `${measure} · ${source} · 仅供参考`;
    }
    if (fill) fillNutritionInputs(estimate.values);
  }

  function renderFoodSuggestions() {
    const datalist = $('#foodSuggestions');
    if (!datalist) return;
    datalist.innerHTML = FOOD_DATABASE.map((food) => `<option value="${escapeHTML(food.name)}"></option>`).join('');
  }

  function openFoodDialog(meal = 'breakfast', entryId = null) {
    const dialog = $('#foodDialog');
    const form = $('#foodForm');
    if (!dialog || !form) return;
    const entries = getEntries();
    const entry = entryId ? entries.find((item) => item.id === entryId) : null;
    form.reset();
    currentMeal = entry?.meal || meal;
    renderMealPicker();
    $('#entryId').value = entry?.id || '';
    $('#entryDate').value = selectedDate;
    setText('#foodDialogTitle', entry ? '编辑这份食物' : '记录一份食物');
    setText('#foodSubmitLabel', entry ? '保存修改' : '添加记录');
    $('#foodName').value = entry?.name || '';
    $('#foodAmount').value = entry?.amount || '';
    $('#foodCalories').value = entry ? entry.calories : '';
    $('#foodProtein').value = entry ? entry.protein : '';
    $('#foodCarbs').value = entry ? entry.carbs : '';
    $('#foodFat').value = entry ? entry.fat : '';
    $('#foodTime').value = entry?.time || mealById(currentMeal).time;
    updateNutritionEstimator({ fill: false });
    dialog.showModal();
    setTimeout(() => $('#foodName')?.focus(), 80);
  }

  function closeDialog(id) {
    const dialog = document.getElementById(id);
    if (dialog?.open) dialog.close();
  }

  function showToast(message, actionLabel = '', action = null) {
    const toast = $('#toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toastCallback = action;
    setText('#toastMessage', message);
    const actionButton = $('#toastAction');
    if (actionButton) {
      actionButton.textContent = actionLabel || '撤销';
      actionButton.style.display = action ? 'block' : 'none';
    }
    toast.classList.toggle('has-action', Boolean(action));
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toastCallback = null;
    }, 4200);
  }

  function askConfirm(options) {
    const dialog = $('#confirmDialog');
    if (!dialog) return;
    setText('#confirmTitle', options.title || '确定继续吗？');
    setText('#confirmText', options.text || '');
    setText('#confirmActionButton', options.label || '确认');
    pendingConfirm = options.onConfirm || null;
    dialog.showModal();
  }
  function setWater(count) {
    const goal = Math.max(1, Number(state.goal.water) || 8);
    state.water[selectedDate] = clamp(Math.round(count), 0, goal);
    saveState();
    renderToday();
    renderDayDetail();
    renderSidebar();
  }

  function deleteEntry(entryId) {
    const entries = getEntries();
    const index = entries.findIndex((entry) => entry.id === entryId);
    if (index < 0) return;
    const removed = entries[index];
    const date = selectedDate;
    entries.splice(index, 1);
    if (!entries.length) delete state.entries[date];
    saveState();
    renderAll();
    showToast(`已删除「${removed.name}」`, '撤销', () => {
      if (!state.entries[date]) state.entries[date] = [];
      state.entries[date].splice(index, 0, removed);
      saveState();
      renderAll();
      showToast('已恢复这条记录');
    });
  }

  function exportData() {
    const payload = {
      app: '食光 MEAL JOURNAL',
      version: 1,
      exportedAt: new Date().toISOString(),
      goal: state.goal,
      entries: state.entries,
      water: state.water,
      habits: state.habits,
      weights: state.weights,
      meta: { ...state.meta, demo: false }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `食光-饮食记录-${todayKey()}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('备份文件已导出');
  }

  async function importData(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const nextState = normalizeState(parsed);
      nextState.meta.demo = false;
      state = nextState;
      selectedDate = todayKey();
      calendarCursor = startOfMonth(new Date());
      saveState();
      renderAll();
      showToast('数据已成功导入');
    } catch (error) {
      console.error(error);
      showToast('导入失败，请确认文件格式正确');
    }
  }

  function bindEvents() {
    document.addEventListener('click', (event) => {
      const viewTarget = event.target.closest('[data-view-target]');
      if (viewTarget) {
        event.preventDefault();
        setView(viewTarget.dataset.viewTarget);
        return;
      }
      const closeTarget = event.target.closest('[data-close-dialog]');
      if (closeTarget) {
        closeDialog(closeTarget.dataset.closeDialog);
      }
    });

    $('#topCalendarButton')?.addEventListener('click', () => setView('calendar'));
    $('#quickAddButton')?.addEventListener('click', () => openFoodDialog('breakfast'));
    $('#mobileAddButton')?.addEventListener('click', () => openFoodDialog('breakfast'));
    $('#addMealButton')?.addEventListener('click', () => openFoodDialog('breakfast'));
    $('#addWeightButton')?.addEventListener('click', () => openWeightDialog(selectedDate));
    $('#addWeightFromTrends')?.addEventListener('click', () => openWeightDialog(todayKey()));
    $('#viewWeightTrend')?.addEventListener('click', () => {
      setView('trends');
      setTimeout(() => $('#weightTrendCard')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
    });

    $('#prevDateButton')?.addEventListener('click', () => {
      selectedDate = dateKey(addDays(parseDateKey(selectedDate), -1));
      renderAll();
    });
    $('#nextDateButton')?.addEventListener('click', () => {
      const next = dateKey(addDays(parseDateKey(selectedDate), 1));
      if (next <= todayKey()) {
        selectedDate = next;
        renderAll();
      }
    });
    $('#todayButton')?.addEventListener('click', () => {
      selectedDate = todayKey();
      renderAll();
    });

    $('#addWaterButton')?.addEventListener('click', () => {
      const goal = Math.max(1, Number(state.goal.water) || 8);
      const current = getWater();
      if (current >= goal) {
        showToast('今天的水已经喝够啦');
        return;
      }
      setWater(current + 1);
    });
    $('#waterCups')?.addEventListener('click', (event) => {
      const cup = event.target.closest('[data-cup]');
      if (!cup) return;
      const value = Number(cup.dataset.cup);
      setWater(getWater() === value ? value - 1 : value);
    });

    $('#mealGroups')?.addEventListener('click', (event) => {
      const addButton = event.target.closest('[data-add-meal]');
      if (addButton) {
        openFoodDialog(addButton.dataset.addMeal);
        return;
      }
      const row = event.target.closest('[data-entry-id]');
      const action = event.target.closest('[data-food-action]');
      if (!row || !action) return;
      if (action.dataset.foodAction === 'edit') openFoodDialog('breakfast', row.dataset.entryId);
      if (action.dataset.foodAction === 'delete') deleteEntry(row.dataset.entryId);
    });

    $('.habit-list')?.addEventListener('click', (event) => {
      const item = event.target.closest('[data-habit]');
      if (!item) return;
      if (!state.habits[selectedDate]) state.habits[selectedDate] = {};
      const key = item.dataset.habit;
      state.habits[selectedDate][key] = !state.habits[selectedDate][key];
      saveState();
      renderHabits();
      showToast(state.habits[selectedDate][key] ? '习惯已打卡' : '已取消打卡');
    });

    $('#prevMonthButton')?.addEventListener('click', () => {
      calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1, 12, 0, 0, 0);
      renderCalendar();
    });
    $('#nextMonthButton')?.addEventListener('click', () => {
      calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1, 12, 0, 0, 0);
      renderCalendar();
    });
    $('#monthTodayButton')?.addEventListener('click', () => {
      selectedDate = todayKey();
      calendarCursor = startOfMonth(new Date());
      renderAll();
    });
    $('#calendarGrid')?.addEventListener('click', (event) => {
      const day = event.target.closest('[data-date]');
      if (!day) return;
      selectedDate = day.dataset.date;
      calendarCursor = startOfMonth(parseDateKey(selectedDate));
      renderAll();
    });
    $('#viewSelectedDayButton')?.addEventListener('click', () => setView('today', { keepDate: true }));

    $('#mealPicker')?.addEventListener('click', (event) => {
      const option = event.target.closest('[data-meal-option]');
      if (!option) return;
      currentMeal = option.dataset.mealOption;
      renderMealPicker();
      const timeInput = $('#foodTime');
      if (timeInput) timeInput.value = mealById(currentMeal).time;
    });

    $('#quickPicks')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-quick-pick]');
      if (!button) return;
      const food = QUICK_PICKS.find((item) => item.id === button.dataset.quickPick);
      if (!food) return;
      $('#foodName').value = food.label;
      $('#foodAmount').value = food.amount;
      $('#foodCalories').value = food.calories;
      $('#foodProtein').value = food.protein;
      $('#foodCarbs').value = food.carbs;
      $('#foodFat').value = food.fat;
      updateNutritionEstimator({ fill: true });
      $('#foodAmount').focus();
      $('#foodAmount').select();
    });

    $('#foodName')?.addEventListener('input', () => updateNutritionEstimator({ fill: true }));
    $('#foodAmount')?.addEventListener('input', () => updateNutritionEstimator({ fill: true }));

    $('#foodForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if ($('#foodName').value.trim() && $('#foodAmount').value.trim() && !$('#foodCalories').value) {
        updateNutritionEstimator({ fill: true });
      }
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const calories = Number(data.get('calories'));
      const date = String(data.get('entryDate') || selectedDate);
      const entryId = String(data.get('entryId') || '');
      if (!name || !Number.isFinite(calories) || calories < 0) {
        showToast('请填写食物名称和有效的热量');
        return;
      }
      if (state.meta.demo && !entryId) {
        state.entries = {};
        state.water = {};
        state.habits = {};
        state.meta.demo = false;
      }
      if (!Array.isArray(state.entries[date])) state.entries[date] = [];
      const entry = {
        id: entryId || uid(),
        meal: currentMeal,
        name: name.slice(0, 80),
        amount: String(data.get('amount') || '').trim().slice(0, 40),
        calories: Math.max(0, Number(data.get('calories')) || 0),
        protein: Math.max(0, Number(data.get('protein')) || 0),
        carbs: Math.max(0, Number(data.get('carbs')) || 0),
        fat: Math.max(0, Number(data.get('fat')) || 0),
        time: String(data.get('time') || mealById(currentMeal).time).slice(0, 5),
        createdAt: new Date().toISOString()
      };
      const existingIndex = state.entries[date].findIndex((item) => item.id === entryId);
      if (existingIndex >= 0) state.entries[date][existingIndex] = { ...state.entries[date][existingIndex], ...entry };
      else state.entries[date].push(entry);
      state.entries[date].sort((a, b) => String(a.time).localeCompare(String(b.time)));
      selectedDate = date;
      calendarCursor = startOfMonth(parseDateKey(date));
      saveState();
      closeDialog('foodDialog');
      renderAll();
      showToast(entryId ? '记录已更新' : `已添加「${entry.name}」`);
    });

    $('#weightForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const date = String(data.get('weightDate') || todayKey());
      const weight = Number(data.get('weight'));
      if (!Number.isFinite(weight) || weight < 20 || weight > 300) {
        showToast('请输入 20–300 kg 之间的体重');
        return;
      }
      if (date > todayKey()) {
        showToast('不能记录未来日期的体重');
        return;
      }
      const updating = Boolean(state.weights?.[date]);
      if (!state.weights) state.weights = {};
      state.weights[date] = { weight: round1(weight), createdAt: new Date().toISOString() };
      selectedDate = date;
      saveState();
      closeDialog('weightDialog');
      renderAll();
      showToast(updating ? '当天体重已更新' : '体重记录已保存');
    });

    $('#goalForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      state.goal = {
        calories: clamp(Number(data.get('calories')) || DEFAULT_GOAL.calories, 800, 5000),
        protein: clamp(Number(data.get('protein')) || DEFAULT_GOAL.protein, 20, 400),
        carbs: clamp(Number(data.get('carbs')) || DEFAULT_GOAL.carbs, 30, 700),
        fat: clamp(Number(data.get('fat')) || DEFAULT_GOAL.fat, 10, 250),
        water: clamp(Number(data.get('water')) || DEFAULT_GOAL.water, 1, 20)
      };
      saveState();
      renderAll();
      showToast('每日目标已保存');
    });

    $('#exportButton')?.addEventListener('click', exportData);
    $('#importButton')?.addEventListener('click', () => $('#importFile')?.click());
    $('#importFile')?.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      await importData(file);
      event.target.value = '';
    });
    $('#resetButton')?.addEventListener('click', () => {
      askConfirm({
        title: '确定清空全部记录吗？',
        text: '所有饮食记录、饮水记录、习惯打卡和目标设置都将被删除，且无法恢复。建议先导出备份。',
        label: '确认清空',
        onConfirm: () => {
          state = {
            version: 1,
            goal: { ...DEFAULT_GOAL },
            entries: {},
            water: {},
            habits: {},
            weights: {},
            meta: { demo: false, createdAt: new Date().toISOString() }
          };
          selectedDate = todayKey();
          calendarCursor = startOfMonth(new Date());
          saveState();
          renderAll();
          showToast('全部记录已清空');
        }
      });
    });
    $('#clearDemoButton')?.addEventListener('click', () => {
      state.entries = {};
      state.water = {};
      state.habits = {};
      state.meta.demo = false;
      saveState();
      renderAll();
      showToast('示例数据已清空，可以开始记录了');
    });

    $('#confirmForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      closeDialog('confirmDialog');
      const callback = pendingConfirm;
      pendingConfirm = null;
      if (typeof callback === 'function') callback();
    });

    $('#toastAction')?.addEventListener('click', () => {
      const callback = toastCallback;
      toastCallback = null;
      $('#toast')?.classList.remove('show');
      clearTimeout(toastTimer);
      if (typeof callback === 'function') callback();
    });

    $('.food-dialog, .weight-dialog, .confirm-dialog').forEach((dialog) => {
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
      });
    });

    window.addEventListener('storage', (event) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        state = normalizeState(JSON.parse(event.newValue));
        renderAll();
        showToast('已同步其他标签页的更新');
      } catch (error) {
        console.warn('同步数据失败', error);
      }
    });
  }

  function init() {
    renderMealPicker();
    renderQuickPicks();
    renderFoodSuggestions();
    const requestedView = new URLSearchParams(window.location.search).get('view');
    if (['calendar', 'trends', 'goals'].includes(requestedView)) activeView = requestedView;
    bindEvents();
    renderAll();
    const nextButton = $('#nextDateButton');
    if (nextButton) nextButton.disabled = true;
  }

  init();
})();
