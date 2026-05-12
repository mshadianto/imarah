// ═════════════════════════════════════════════════════════════════════
// useAkuntansiStore — localStorage-backed reducer hook
// Single source of truth for the Akuntansi module.
// Storage key: imarah_akuntansi_v1
// ═════════════════════════════════════════════════════════════════════

import { useReducer, useEffect, useCallback, useRef } from "react";
import { STORAGE_KEY, DEFAULT_STATE } from "./constants.js";
import { uid, getKategori } from "./helpers.js";

function hydrate() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    // Shallow-merge so newly added defaults (e.g. new kategori columns) still apply
    // when the user's stored blob predates them, but stored arrays take precedence.
    return {
      ...DEFAULT_STATE,
      ...parsed,
      profil: { ...DEFAULT_STATE.profil, ...(parsed.profil || {}) },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "REPLACE":
      return action.state;

    case "SET_PERIODE":
      return { ...state, selectedPeriode: action.periode };

    case "SET_PROFIL":
      return { ...state, profil: { ...state.profil, ...action.profil } };

    case "ADD_TRX": {
      const kat = getKategori(state, action.trx.kategoriId);
      const klasifikasi =
        action.trx.klasifikasi ||
        (kat && kat.klasifikasi ? kat.klasifikasi : "UNRESTRICTED");
      const trx = {
        id: uid(),
        createdAt: new Date().toISOString(),
        ...action.trx,
        klasifikasi,
      };
      return { ...state, transaksi: [...state.transaksi, trx] };
    }

    case "UPDATE_TRX": {
      const idx = state.transaksi.findIndex((t) => t.id === action.id);
      if (idx < 0) return state;
      const kat = getKategori(state, action.patch.kategoriId);
      const klasifikasi =
        action.patch.klasifikasi ||
        (kat && kat.klasifikasi ? kat.klasifikasi : "UNRESTRICTED");
      const updated = [...state.transaksi];
      updated[idx] = { ...updated[idx], ...action.patch, klasifikasi };
      return { ...state, transaksi: updated };
    }

    case "DELETE_TRX":
      return { ...state, transaksi: state.transaksi.filter((t) => t.id !== action.id) };

    case "ADD_KATEGORI": {
      if (action.tipe === "IN") {
        const next = {
          id: "k-i-" + Date.now(),
          nama: action.nama,
          klasifikasi: action.klasifikasi || "UNRESTRICTED",
        };
        return { ...state, kategoriIn: [...state.kategoriIn, next] };
      }
      const next = { id: "k-o-" + Date.now(), nama: action.nama };
      return { ...state, kategoriOut: [...state.kategoriOut, next] };
    }

    case "DELETE_KATEGORI":
      if (action.tipe === "IN") {
        return { ...state, kategoriIn: state.kategoriIn.filter((k) => k.id !== action.id) };
      }
      return { ...state, kategoriOut: state.kategoriOut.filter((k) => k.id !== action.id) };

    case "RESET_TRX":
      return { ...state, transaksi: [] };

    case "APPEND_TRX":
      return { ...state, transaksi: [...state.transaksi, ...action.list] };

    default:
      return state;
  }
}

export function useAkuntansiStore() {
  const [state, dispatch] = useReducer(reducer, undefined, hydrate);
  const isFirstRun = useRef(true);

  // Persist on every state change (skip the first synchronous run; hydrate already
  // loaded from storage so the initial write would just rewrite the same blob).
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Akuntansi: gagal menyimpan ke localStorage", e);
    }
  }, [state]);

  // ── Action creators (stable references) ─────────────────────────────
  const addTrx = useCallback((trx) => dispatch({ type: "ADD_TRX", trx }), []);
  const updateTrx = useCallback((id, patch) => dispatch({ type: "UPDATE_TRX", id, patch }), []);
  const deleteTrx = useCallback((id) => dispatch({ type: "DELETE_TRX", id }), []);
  const setPeriode = useCallback((periode) => dispatch({ type: "SET_PERIODE", periode }), []);
  const setProfil = useCallback((profil) => dispatch({ type: "SET_PROFIL", profil }), []);
  const addKategori = useCallback(
    (tipe, nama, klasifikasi) =>
      dispatch({ type: "ADD_KATEGORI", tipe, nama, klasifikasi }),
    []
  );
  const deleteKategori = useCallback(
    (tipe, id) => dispatch({ type: "DELETE_KATEGORI", tipe, id }),
    []
  );
  const replace = useCallback((nextState) => dispatch({ type: "REPLACE", state: nextState }), []);
  const resetTrx = useCallback(() => dispatch({ type: "RESET_TRX" }), []);
  const appendTrx = useCallback((list) => dispatch({ type: "APPEND_TRX", list }), []);

  return {
    state,
    addTrx,
    updateTrx,
    deleteTrx,
    setPeriode,
    setProfil,
    addKategori,
    deleteKategori,
    replace,
    resetTrx,
    appendTrx,
  };
}
