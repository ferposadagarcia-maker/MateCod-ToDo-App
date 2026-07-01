import { useState, type ChangeEvent, type FormEvent } from "react";


type LoginFormState = {
    email: string;
    password: string;
};
type FieldErrors = Partial<Record<keyof LoginFormState, string>>;


const initialState: LoginFormState = { email: "", password: "" };




export function LoginForm() {
    const [form, setForm] = useState<LoginFormState>(initialState);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitSuccess(false);
        const nextErrors = validate(form);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        setIsSubmitting(true);
        try {
            await mockLogin(form);
            setSubmitSuccess(true);
            setForm(initialState);
        }


        catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Error inesperado.");
        }


        finally {
            setIsSubmitting(false);
        }
    };


    function validate(form: LoginFormState): FieldErrors {
        const errs: FieldErrors = {};
        if (!form.email.includes("@") || !form.email.includes(".")) {
            errs.email = "Ingresá un email válido.";
        }
        if (!form.password || form.password.length < 6) {
            errs.password = "La contraseña debe tener al menos 6 caracteres.";
        }
        return errs;
    }


    async function mockLogin(data: LoginFormState) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (data.email === "fail@example.com") {
            throw new Error("Credenciales inválidas.");
        }
        return { ok: true };
    }


    return (


        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                required
            />
            {errors.email && <p id="email-error">{errors.email}</p>}
            <label htmlFor="password">Contraseña</label>
            <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                required
            />
            {errors.password && <p id="password-error">{errors.password}</p>}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>


            {submitError && (
                <p role="alert" aria-live="assertive">{submitError}</p>
            )}
            {submitSuccess && (
                <p role="status" aria-live="polite">¡Login exitoso!</p>
            )}


        </form>
    );


}