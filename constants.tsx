import React from 'react';
import { Item, ItemType, Recipe } from './types';

const CDN_BASE = "https://rerollcdn.com/items/";

// Basic Components
export const COMPONENTS: Item[] = [
  { id: 'sword', name: '暴风大剑', type: ItemType.COMPONENT, color: 'bg-red-500', description: '+10% 攻击力', image: `${CDN_BASE}BFSword.png` },
  { id: 'bow', name: '反曲之弓', type: ItemType.COMPONENT, color: 'bg-yellow-400', description: '+10% 攻速', image: `${CDN_BASE}RecurveBow.png` },
  { id: 'rod', name: '无用大棒', type: ItemType.COMPONENT, color: 'bg-purple-500', description: '+10 法术强度', image: `${CDN_BASE}NeedlesslyLargeRod.png` },
  { id: 'tear', name: '女神之泪', type: ItemType.COMPONENT, color: 'bg-blue-400', description: '+15 法力值', image: `${CDN_BASE}TearoftheGoddess.png` },
  { id: 'vest', name: '锁子甲', type: ItemType.COMPONENT, color: 'bg-orange-700', description: '+20 护甲', image: `${CDN_BASE}ChainVest.png` },
  { id: 'cloak', name: '负极斗篷', type: ItemType.COMPONENT, color: 'bg-amber-100', description: '+20 魔抗', image: `${CDN_BASE}NegatronCloak.png` },
  { id: 'belt', name: '巨人腰带', type: ItemType.COMPONENT, color: 'bg-green-600', description: '+150 生命值', image: `${CDN_BASE}GiantsBelt.png` },
  { id: 'glove', name: '拳套', type: ItemType.COMPONENT, color: 'bg-red-800', description: '+20% 暴击', image: `${CDN_BASE}SparringGloves.png` },
  { id: 'spatula', name: '金铲铲', type: ItemType.COMPONENT, color: 'bg-yellow-200', description: '它一定有什么用...', image: `${CDN_BASE}Spatula.png` },
];

// Partial list of recipes for the game (Standard Recipes)
export const RECIPES: Recipe[] = [
  { components: ['sword', 'sword'], result: 'deathblade' },
  { components: ['sword', 'bow'], result: 'giant_slayer' },
  { components: ['sword', 'rod'], result: 'gunblade' },
  { components: ['sword', 'tear'], result: 'shojin' },
  { components: ['sword', 'vest'], result: 'edge_of_night' },
  { components: ['sword', 'cloak'], result: 'bloodthirster' },
  { components: ['sword', 'belt'], result: 'steraks' },
  { components: ['sword', 'glove'], result: 'infinity_edge' },
  
  { components: ['bow', 'bow'], result: 'red_buff' },
  { components: ['bow', 'rod'], result: 'guinsoo' },
  { components: ['bow', 'tear'], result: 'shiv' },
  { components: ['bow', 'vest'], result: 'titans' },
  { components: ['bow', 'cloak'], result: 'runaans' },
  { components: ['bow', 'belt'], result: 'nashors' }, 
  { components: ['bow', 'glove'], result: 'last_whisper' },

  { components: ['rod', 'rod'], result: 'rabadon' },
  { components: ['rod', 'tear'], result: 'archangel' },
  { components: ['rod', 'vest'], result: 'crownguard' },
  { components: ['rod', 'cloak'], result: 'spark' },
  { components: ['rod', 'belt'], result: 'morello' },
  { components: ['rod', 'glove'], result: 'jeweled_gauntlet' },

  { components: ['tear', 'tear'], result: 'blue_buff' },
  { components: ['tear', 'vest'], result: 'protectors' },
  { components: ['tear', 'cloak'], result: 'adaptive' },
  { components: ['tear', 'belt'], result: 'redemption' },
  { components: ['tear', 'glove'], result: 'hand_of_justice' },

  { components: ['vest', 'vest'], result: 'bramble' },
  { components: ['vest', 'cloak'], result: 'gargoyle' },
  { components: ['vest', 'belt'], result: 'sunfire' },
  { components: ['vest', 'glove'], result: 'steadfast' },

  { components: ['cloak', 'cloak'], result: 'dragon_claw' },
  { components: ['cloak', 'belt'], result: 'evenshroud' },
  { components: ['cloak', 'glove'], result: 'quicksilver' },

  { components: ['belt', 'belt'], result: 'warmog' },
  { components: ['belt', 'glove'], result: 'guardbreaker' },

  { components: ['glove', 'glove'], result: 'thiefs_gloves' },
];

// Map IDs to Names for display
export const COMPLETED_ITEMS: Record<string, Item> = {
  deathblade: { id: 'deathblade', name: '锐利之刃', type: ItemType.COMPLETED, color: 'bg-red-600', description: '额外攻击力', image: `${CDN_BASE}Deathblade.png` },
  giant_slayer: { id: 'giant_slayer', name: '巨人捕手', type: ItemType.COMPLETED, color: 'bg-orange-500', description: '克制高血量', image: `${CDN_BASE}GiantSlayer.png` },
  gunblade: { id: 'gunblade', name: '海克斯科技枪刃', type: ItemType.COMPLETED, color: 'bg-teal-500', description: '全能吸血', image: `${CDN_BASE}HextechGunblade.png` },
  shojin: { id: 'shojin', name: '朔极之矛', type: ItemType.COMPLETED, color: 'bg-blue-600', description: '攻击回蓝', image: `${CDN_BASE}SpearofShojin.png` },
  edge_of_night: { id: 'edge_of_night', name: '夜之锋刃', type: ItemType.COMPLETED, color: 'bg-gray-700', description: '消除仇恨', image: `${CDN_BASE}EdgeofNight.png` },
  bloodthirster: { id: 'bloodthirster', name: '汲取剑', type: ItemType.COMPLETED, color: 'bg-red-700', description: '吸血 & 护盾', image: `${CDN_BASE}Bloodthirster.png` },
  steraks: { id: 'steraks', name: '斯特拉克的挑战护手', type: ItemType.COMPLETED, color: 'bg-red-500', description: '生命值 & 攻击力', image: `${CDN_BASE}SteraksGage.png` },
  infinity_edge: { id: 'infinity_edge', name: '无尽之刃', type: ItemType.COMPLETED, color: 'bg-yellow-600', description: '技能可暴击', image: `${CDN_BASE}InfinityEdge.png` },

  red_buff: { id: 'red_buff', name: '红霸符', type: ItemType.COMPLETED, color: 'bg-red-500', description: '灼烧 & 重伤', image: `${CDN_BASE}RedBuff.png` },
  guinsoo: { id: 'guinsoo', name: '鬼索的狂暴之刃', type: ItemType.COMPLETED, color: 'bg-purple-600', description: '叠加攻速', image: `${CDN_BASE}GuinsoosRageblade.png` },
  shiv: { id: 'shiv', name: '斯塔缇克电刃', type: ItemType.COMPLETED, color: 'bg-yellow-300', description: '魔法电击', image: `${CDN_BASE}StatikkShiv.png` },
  titans: { id: 'titans', name: '泰坦的坚决', type: ItemType.COMPLETED, color: 'bg-yellow-700', description: '叠加双抗/攻击', image: `${CDN_BASE}TitansResolve.png` },
  runaans: { id: 'runaans', name: '卢安娜的飓风', type: ItemType.COMPLETED, color: 'bg-yellow-200', description: '分裂箭', image: `${CDN_BASE}RunaansHurricane.png` },
  nashors: { id: 'nashors', name: '纳什之牙', type: ItemType.COMPLETED, color: 'bg-purple-800', description: '施法加攻速', image: `${CDN_BASE}NashorsTooth.png` },
  last_whisper: { id: 'last_whisper', name: '最后的轻语', type: ItemType.COMPLETED, color: 'bg-blue-300', description: '护甲穿透', image: `${CDN_BASE}LastWhisper.png` },

  rabadon: { id: 'rabadon', name: '拉巴顿的死亡之帽', type: ItemType.COMPLETED, color: 'bg-pink-600', description: '大量法强', image: `${CDN_BASE}RabadonsDeathcap.png` },
  archangel: { id: 'archangel', name: '大天使之杖', type: ItemType.COMPLETED, color: 'bg-blue-500', description: '法强随时间增加', image: `${CDN_BASE}ArchangelsStaff.png` },
  crownguard: { id: 'crownguard', name: '冕卫', type: ItemType.COMPLETED, color: 'bg-green-800', description: '护盾 & 法强', image: `${CDN_BASE}Crownguard.png` },
  spark: { id: 'spark', name: '离子火花', type: ItemType.COMPLETED, color: 'bg-indigo-500', description: '魔抗削减', image: `${CDN_BASE}IonicSpark.png` },
  morello: { id: 'morello', name: '莫雷洛秘典', type: ItemType.COMPLETED, color: 'bg-purple-900', description: '灼烧 & 重伤', image: `${CDN_BASE}Morellonomicon.png` },
  jeweled_gauntlet: { id: 'jeweled_gauntlet', name: '珠光护手', type: ItemType.COMPLETED, color: 'bg-pink-500', description: '技能暴击', image: `${CDN_BASE}JeweledGauntlet.png` },

  blue_buff: { id: 'blue_buff', name: '蓝霸符', type: ItemType.COMPLETED, color: 'bg-blue-700', description: '减少蓝耗', image: `${CDN_BASE}BlueBuff.png` },
  protectors: { id: 'protectors', name: '圣盾使的誓约', type: ItemType.COMPLETED, color: 'bg-cyan-700', description: '护盾 & 初始蓝量', image: `${CDN_BASE}ProtectorsVow.png` },
  adaptive: { id: 'adaptive', name: '适应性头盔', type: ItemType.COMPLETED, color: 'bg-purple-400', description: '双抗 & 法力/法强', image: `${CDN_BASE}AdaptiveHelm.png` },
  redemption: { id: 'redemption', name: '救赎', type: ItemType.COMPLETED, color: 'bg-green-300', description: '群体治疗', image: `${CDN_BASE}Redemption.png` },
  hand_of_justice: { id: 'hand_of_justice', name: '正义之手', type: ItemType.COMPLETED, color: 'bg-yellow-500', description: '增伤或治疗', image: `${CDN_BASE}HandofJustice.png` },

  bramble: { id: 'bramble', name: '棘刺背心', type: ItemType.COMPLETED, color: 'bg-gray-600', description: '反伤', image: `${CDN_BASE}BrambleVest.png` },
  gargoyle: { id: 'gargoyle', name: '石像鬼石板甲', type: ItemType.COMPLETED, color: 'bg-gray-400', description: '以一敌多', image: `${CDN_BASE}GargoyleStoneplate.png` },
  sunfire: { id: 'sunfire', name: '日炎斗篷', type: ItemType.COMPLETED, color: 'bg-orange-600', description: '燃烧敌人', image: `${CDN_BASE}SunfireCape.png` },
  steadfast: { id: 'steadfast', name: '坚定之心', type: ItemType.COMPLETED, color: 'bg-red-900', description: '减伤', image: `${CDN_BASE}SteadfastHeart.png` },

  dragon_claw: { id: 'dragon_claw', name: '巨龙之爪', type: ItemType.COMPLETED, color: 'bg-red-400', description: '高额魔抗 & 回血', image: `${CDN_BASE}DragonsClaw.png` },
  evenshroud: { id: 'evenshroud', name: '薄暮法袍', type: ItemType.COMPLETED, color: 'bg-indigo-800', description: '护甲削减', image: `${CDN_BASE}Evenshroud.png` },
  quicksilver: { id: 'quicksilver', name: '水银', type: ItemType.COMPLETED, color: 'bg-gray-200', description: '免控', image: `${CDN_BASE}Quicksilver.png` },

  warmog: { id: 'warmog', name: '狂徒铠甲', type: ItemType.COMPLETED, color: 'bg-green-500', description: '海量生命值', image: `${CDN_BASE}WarmogsArmor.png` },
  guardbreaker: { id: 'guardbreaker', name: '破防者', type: ItemType.COMPLETED, color: 'bg-purple-300', description: '击破护盾', image: `${CDN_BASE}Guardbreaker.png` },

  thiefs_gloves: { id: 'thiefs_gloves', name: '窃贼手套', type: ItemType.COMPLETED, color: 'bg-purple-700', description: '偷取两个装备', image: `${CDN_BASE}ThiefsGloves.png` },
};

export const ALL_ITEMS_MAP = {
  ...COMPLETED_ITEMS,
  ...COMPONENTS.reduce((acc, item) => ({ ...acc, [item.id]: item }), {} as Record<string, Item>)
};