/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');

process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ module: 'CommonJS', moduleResolution: 'Node' });
require('ts-node/register/transpile-only');

const state = {
  checkins: [],
  progress: {
    id: 'struggle-1',
    userId: 'user-1',
    status: 'ACTIVE',
    currentDay: 1,
    completedDays: '',
  },
  streak: null,
  receipts: new Map(),
};

function resetState() {
  state.checkins = [];
  state.progress = {
    id: 'struggle-1',
    userId: 'user-1',
    status: 'ACTIVE',
    currentDay: 1,
    completedDays: '',
  };
  state.streak = null;
  state.receipts.clear();
}

function receiptKey(input) {
  return `${input.userId}:${input.idempotencyKey}`;
}

const idempotency = {
  async beginIdempotentOperation(input) {
    const key = receiptKey(input);
    const existing = state.receipts.get(key);
    if (!existing) {
      const receipt = { ...input, status: 'PROCESSING' };
      state.receipts.set(key, receipt);
      return { kind: 'started', receipt };
    }
    if (existing.operation !== input.operation) throw new Error('operation mismatch');
    if (existing.status === 'PROCESSING') return { kind: 'in_progress', receipt: existing };
    return {
      kind: 'replay',
      receipt: existing,
      response: existing.response,
      statusCode: existing.statusCode,
    };
  },
  async finalizeIdempotentOperation(input) {
    const receipt = state.receipts.get(receiptKey(input));
    if (!receipt) throw new Error('missing receipt');
    receipt.status = input.status || 'COMPLETED';
    receipt.response = input.response;
    receipt.statusCode = input.statusCode;
    return receipt;
  },
};

const fakePrisma = {
  dailyCheckin: {
    async findMany({ where }) {
      return state.checkins.filter((checkin) => checkin.userId === where.userId);
    },
    async findFirst({ where }) {
      return state.checkins.find((checkin) => {
        const createdAt = new Date(checkin.createdAt).getTime();
        return checkin.userId === where.userId &&
          createdAt >= where.createdAt.gte.getTime() &&
          createdAt < where.createdAt.lt.getTime();
      }) || null;
    },
    async create({ data }) {
      const checkin = { id: `checkin-${state.checkins.length + 1}`, createdAt: new Date(), ...data };
      state.checkins.push(checkin);
      return checkin;
    },
  },
  streak: {
    async findUnique() {
      return state.streak;
    },
    async create({ data }) {
      state.streak = { id: 'streak-1', ...data };
      return state.streak;
    },
    async update({ data }) {
      if (data.currentStreak?.increment) state.streak.currentStreak += data.currentStreak.increment;
      if (data.currentStreak !== undefined && typeof data.currentStreak === 'number') state.streak.currentStreak = data.currentStreak;
      if (data.longestStreak?.set !== undefined) state.streak.longestStreak = data.longestStreak.set;
      if (data.lastActivity) state.streak.lastActivity = data.lastActivity;
      return state.streak;
    },
  },
  mascot: {
    async update() {
      return null;
    },
  },
  userStruggle: {
    async findFirst({ where }) {
      return state.progress.id === where.id && state.progress.userId === where.userId
        ? { ...state.progress }
        : null;
    },
    async update({ data }) {
      Object.assign(state.progress, data);
      return { ...state.progress };
    },
  },
};

const nextResponse = {
  json(body, init = {}) {
    return { body, status: init.status || 200 };
  },
};

const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'next/server') return { NextResponse: nextResponse };
  if (request === '@/app/lib/prisma') return { prisma: fakePrisma };
  if (request === '@/app/lib/api-auth') return {
    getApiUser: async () => ({ id: 'user-1' }),
    getApiUserId: async () => 'user-1',
  };
  if (request === '@/app/lib/idempotency') return idempotency;
  if (request === '@/app/lib/conflicts/checkin') {
    return originalLoad(path.join(process.cwd(), 'app/lib/conflicts/checkin.ts'), parent, isMain);
  }
  if (request === '@/app/lib/conflicts/progress') {
    return originalLoad(path.join(process.cwd(), 'app/lib/conflicts/progress.ts'), parent, isMain);
  }
  return originalLoad(request, parent, isMain);
};

const checkinRoute = require('../app/api/checkin/route');
const progressRoute = require('../app/api/struggles/progress/route');

function request(body, headers = {}) {
  return new Request('http://localhost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

function todayKey() {
  const today = new Date();
  return [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
}

async function main() {
  resetState();
  const dayKey = todayKey();
  const first = await checkinRoute.POST(request({ mood: '😄', dayKey }, { 'Idempotency-Key': 'checkin-1' }));
  assert.equal(first.status, 201);
  assert.equal(state.checkins.length, 1);
  assert.equal(state.checkins[0].dayKey, dayKey);

  const replay = await checkinRoute.POST(request({ mood: '😄', dayKey }, { 'Idempotency-Key': 'checkin-1' }));
  assert.equal(replay.status, first.status);
  assert.deepEqual(replay.body, first.body);
  assert.equal(state.checkins.length, 1, 'replay must not create another check-in');

  const duplicate = await checkinRoute.POST(request({ mood: '😐', dayKey }, { 'Idempotency-Key': 'checkin-2' }));
  assert.equal(duplicate.status, 429);
  assert.equal(state.checkins.length, 1, 'same logical day must be rejected');

  resetState();
  const legacyClient = await checkinRoute.POST(request({ mood: '🙂' }, { 'Idempotency-Key': 'legacy-client' }));
  assert.equal(legacyClient.status, 201);
  assert.equal(state.checkins[0].dayKey, dayKey, 'missing dayKey must use the current logical day');

  state.receipts.set('user-1:checkin-busy', { operation: 'CHECK_IN', status: 'PROCESSING' });
  const concurrent = await checkinRoute.POST(request({ mood: '🙂', dayKey }, { 'Idempotency-Key': 'checkin-busy' }));
  assert.equal(concurrent.status, 409);
  assert.equal(concurrent.body.retryable, true);
  assert.equal(state.checkins.length, 1, 'concurrent operation must not duplicate effects');

  resetState();
  const dayTwo = await progressRoute.PATCH(request({ id: 'struggle-1', action: 'ADVANCE', dayNumber: 2, idempotencyKey: 'progress-2' }));
  assert.equal(dayTwo.status, 200);
  const dayOne = await progressRoute.PATCH(request({ id: 'struggle-1', action: 'ADVANCE', dayNumber: 1, idempotencyKey: 'progress-1' }));
  assert.equal(dayOne.status, 200);
  assert.deepEqual(
    { currentDay: state.progress.currentDay, completedDays: state.progress.completedDays },
    { currentDay: 3, completedDays: '1,2' },
    'progress merge must be independent of arrival order',
  );

  const offlineStart = await progressRoute.PATCH(request({
    id: 'struggle-1',
    action: 'START',
    offline: true,
    idempotencyKey: 'offline-start',
  }));
  assert.equal(offlineStart.status, 409);
  assert.equal(offlineStart.body.conflict, 'online-only');

  console.log('sync integration: replay, duplicate check-in, concurrent retry, and progress order: ok');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
