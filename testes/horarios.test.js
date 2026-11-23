import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  diasDisponiveis,
  horariosDoDia,
  horarioPermitido,
  hojeLocal,
  paraInstante,
  partesLocais,
  somarDias,
} from '../lib/horarios.js';
import { normalizarTelefone, emailValido, formatarDataHora, rotuloDia } from '../lib/formatar.js';

const config = {
  diasAFrente: 14,
  antecedenciaMinimaHoras: 12,
  horariosPorDiaDaSemana: { 0: [], 1: ['09:00', '15:00'], 2: ['09:00'], 3: [], 4: [], 5: [], 6: [] },
  datasBloqueadas: ['2026-11-30'],
};

// Segunda, 23/11/2026, 20:00 em Brasília (23:00 UTC)
const agora = new Date('2026-11-23T23:00:00Z');

test('data de hoje considera o fuso de Brasília', () => {
  assert.equal(hojeLocal(agora), '2026-11-23');
  assert.equal(hojeLocal(new Date('2026-11-24T02:30:00Z')), '2026-11-23'); // 23:30 em Brasília
});

test('converte horário local em instante UTC', () => {
  assert.equal(paraInstante('2026-11-24', '09:00').toISOString(), '2026-11-24T12:00:00.000Z');
  assert.deepEqual(partesLocais('2026-11-24T12:00:00.000Z'), { data: '2026-11-24', hora: '09:00' });
});

test('virada de mês e ano', () => {
  assert.equal(somarDias('2026-12-31', 1), '2027-01-01');
  assert.equal(somarDias('2026-11-30', 1), '2026-12-01');
});

test('respeita antecedência mínima de 12h', () => {
  // terça 24/11 09:00 é 13h depois de agora: permitido
  assert.deepEqual(horariosDoDia(config, '2026-11-24', agora).map((h) => h.hora), ['09:00']);
  // hoje (segunda) já passou
  assert.deepEqual(horariosDoDia(config, '2026-11-23', agora), []);
});

test('pula dias sem atendimento e datas bloqueadas', () => {
  const dias = diasDisponiveis(config, agora);
  assert.deepEqual(dias, ['2026-11-24', '2026-12-01', '2026-12-07']);
  assert.ok(!dias.includes('2026-11-30')); // segunda bloqueada
});

test('não deixa agendar além do limite de dias', () => {
  assert.deepEqual(horariosDoDia(config, '2026-12-08', agora), []);
});

test('valida horário vindo do navegador', () => {
  assert.ok(horarioPermitido(config, '2026-11-24T12:00:00.000Z', agora));
  assert.equal(horarioPermitido(config, '2026-11-24T12:30:00.000Z', agora), null); // 09:30 não existe
  assert.equal(horarioPermitido(config, '2026-11-25T12:00:00.000Z', agora), null); // quarta sem atendimento
  assert.equal(horarioPermitido(config, 'lixo', agora), null);
  assert.equal(horariosDoDia(config, '2026-13-45', agora).length, 0);
});

test('telefone e e-mail', () => {
  assert.equal(normalizarTelefone('(11) 98765-4321'), '5511987654321');
  assert.equal(normalizarTelefone('+55 11 98765-4321'), '5511987654321');
  assert.equal(normalizarTelefone('1132654321'), '551132654321');
  assert.equal(normalizarTelefone('123'), null);
  assert.ok(emailValido('ana@gmail.com'));
  assert.ok(!emailValido('ana@gmail'));
});

test('formatação em português', () => {
  assert.equal(formatarDataHora('2026-11-24T12:00:00.000Z'), 'terça-feira, 24/11 às 09:00');
  assert.deepEqual(rotuloDia('2026-11-24'), { semana: 'ter', dia: '24/11' });
});
