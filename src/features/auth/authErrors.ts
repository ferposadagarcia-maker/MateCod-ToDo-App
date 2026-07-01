const errorMessages: Record<string, string> = {
    "auth/invalid-credential": "Email o contraseña incorrectos.",
    "auth/email-already-in-use": "Ese email ya está registrado.",
    "auth/invalid-email": "El email no es válido.",
    "auth/weak-password": "La contraseña es muy débil (mínimo 6 caracteres).",
    "auth/too-many-requests": "Demasiados intentos. Probá más tarde.",
};

export function getAuthErrorMessage(error: unknown): string {
    const e = error as { code: string };
    return errorMessages[e.code] || "Error de autenticación. Intentá nuevamente.";
}