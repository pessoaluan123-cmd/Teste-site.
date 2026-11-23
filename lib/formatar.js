import { FUSO } from './horarios.js';

export function formatarData(instante) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO,
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(instante));
}

export function formatarHora(instante) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(instante));
}

export function formatarDataHora(instante) {
  return `${formatarData(instante)} às ${formatarHora(instante)}`;
}

export function formatarDinheiro(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

// "2026-11-24" -> { semana: "ter", dia: "24/11" }
export function rotuloDia(dataStr) {
  const d = new Date(`${dataStr}T12:00:00Z`);
  const semana = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'UTC' })
    .format(d)
    .replace('.', '');
  const dia = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(d);
  return { semana, dia };
}

export function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Aceita "(11) 98765-4321", "11987654321", "+55 11 98765-4321"...
// Devolve "5511987654321" ou null se não parecer um celular brasileiro.
export function normalizarTelefone(entrada) {
  let digitos = String(entrada || '').replace(/\D/g, '');
  if (digitos.length === 10 || digitos.length === 11) digitos = `55${digitos}`;
  if (!digitos.startsWith('55') || (digitos.length !== 12 && digitos.length !== 13)) return null;
  return digitos;
}

export function emailValido(email) {
  return typeof email === 'string' && email.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// "terça-feira, 24/11 às 09:00" -> "Terça-feira, 24/11 às 09:00"
export function primeiraMaiuscula(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
