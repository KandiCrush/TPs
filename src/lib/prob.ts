// lib/prob.ts

const LOG_TWO_PI = Math.log(2 * Math.PI);

// Formule de Stirling [log(n!) — précision]
function logFactorial(n: number): number {
    if (n < 0 || !Number.isFinite(n)) throw new Error("n invalide");
    if (n === 0 || n === 1) return 0;

    const x = n;
    return (
        (x + 0.5) * Math.log(x) -
        x +
        0.5 * LOG_TWO_PI +
        1 / (12 * x) -
        1 / (360 * x ** 3)
    );
}

// Fonction pour calculer les combinaisons
function logChoose(n: number, k: number): number {
    if (k < 0 || k > n) return -Infinity;
    return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
}

function clamp01(x: number) {
    if (x < 0) return 0;
    if (x > 1) return 1;

    return x;
}

// --- BINOMIALE ---
export function binomialPMF(n: number, p: number, k: number): number {
    if (!Number.isInteger(n) || n < 0)
        throw new Error("n doit être un entier ≥ 0");
    if (!Number.isInteger(k) || k < 0 || k > n) return 0;
    if (!(p >= 0 && p <= 1)) throw new Error("p doit être dans [0,1]");
    if (p === 0) return k === 0 ? 1 : 0;
    if (p === 1) return k === n ? 1 : 0;

    const logVal =
        logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p);
    return clamp01(Math.exp(logVal));
}

export function binomialCDF(n: number, p: number, k: number): number {
    if (k < 0) return 0;
    if (k >= n) return 1;
    let sum = 0;
    for (let i = 0; i <= k; i++) sum += binomialPMF(n, p, i);
    return clamp01(sum);
}

// --- POISSON ---
export function poissonPMF(lambda: number, k: number): number {
    if (!(lambda >= 0)) throw new Error("λ doit être ≥ 0");
    if (!Number.isInteger(k) || k < 0) return 0;
    if (lambda === 0) return k === 0 ? 1 : 0;

    const logVal = -lambda + k * Math.log(lambda) - logFactorial(k);
    return clamp01(Math.exp(logVal));
}

export function poissonCDF(lambda: number, k: number): number {
    if (k < 0) return 0;
    let sum = 0;
    for (let i = 0; i <= k; i++) sum += poissonPMF(lambda, i);
    return clamp01(sum);
}

// --- HYPERGÉOMÉTRIQUE ---
// N population totale, K succès dans la population, n tirages sans remise
export function hypergeoPMF(
    N: number,
    K: number,
    n: number,
    k: number
): number {
    // Bornes
    if (![N, K, n, k].every(Number.isFinite))
        throw new Error("paramètres invalides");
    if (
        !Number.isInteger(N) ||
        !Number.isInteger(K) ||
        !Number.isInteger(n) ||
        !Number.isInteger(k)
    )
        return 0;
    if (N <= 0 || K < 0 || K > N || n < 0 || n > N) return 0;
    if (k < 0 || k > n || k > K || n - k > N - K) return 0;

    const logNum = logChoose(K, k) + logChoose(N - K, n - k);
    const logDen = logChoose(N, n);
    const logVal = logNum - logDen;
    return clamp01(Math.exp(logVal));
}

export function hypergeoCDF(
    N: number,
    K: number,
    n: number,
    k: number
): number {
    // k_min et k_max valides
    const kMin = Math.max(0, n - (N - K));
    const kMax = Math.min(n, K);
    if (k < kMin) return 0;
    if (k >= kMax) return 1;

    let sum = 0;
    for (let i = kMin; i <= k; i++) sum += hypergeoPMF(N, K, n, i);
    return clamp01(sum);
}
