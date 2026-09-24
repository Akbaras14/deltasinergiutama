"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Mail, Lock, Leaf, Users } from "lucide-react";
import { demoLogin, getDemoUsers } from "@/lib/demo";
import { setSession, redirectPathForRole } from "@/lib/session";

/** Login page with role-based redirection (demo/simulation). */
export function LoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const demoUsers = getDemoUsers();

  function validate(): boolean {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) {
      next.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Format email tidak valid.";
    }
    if (!password) {
      next.password = "Password wajib diisi.";
    } else if (password.length < 6) {
      next.password = "Password minimal 6 karakter.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function fillCredentials(userEmail: string, userPassword: string) {
    setEmail(userEmail);
    setPassword(userPassword);
    setErrors({});
    setError("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) {
      const firstKey = Object.keys(errors)[0];
      if (firstKey) document.getElementById(`login-${firstKey}`)?.focus();
      return;
    }
    if (pending) return;
    setPending(true);
    setError("");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = demoLogin(email, password);
    if (!user) {
      setError("Email atau password salah. Gunakan akun demo di bawah.");
      setPending(false);
      return;
    }

    // Store session and redirect based on role
    setSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const target = redirectPathForRole(user.role);
    router.push(target);
  }

  const roleLabels: Record<string, string> = {
    ADMIN: "Admin",
    PETUGAS: "Petugas",
    PELANGGAN: "Pelanggan",
  };

  const roleColors: Record<string, string> = {
    ADMIN: "shop-demo-admin",
    PETUGAS: "shop-demo-petugas",
    PELANGGAN: "shop-demo-pelanggan",
  };

  return (
    <section className="shop-login">
      <div className="shop-login-card">
        <div className="shop-login-header">
          <div className="shop-login-icon">
            <Leaf size={24} />
          </div>
          <h1>Masuk ke akun Anda</h1>
          <p>
            Selamat datang kembali di CV. Delta Sinergi Utama. Silakan masuk
            untuk melanjutkan.
          </p>
        </div>
        <form
          className="shop-login-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <label className="shop-field" htmlFor="login-email">
            Email <span aria-hidden="true">*</span>
            <div className="shop-login-input-wrapper">
              <Mail size={16} className="shop-login-input-icon" />
              <input
                id="login-email"
                type="email"
                value={email}
                placeholder="nama@email.com"
                autoComplete="email"
                disabled={pending}
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "error-email" : undefined}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <small className="shop-error" id="error-email">
                {errors.email}
              </small>
            )}
          </label>
          <label className="shop-field" htmlFor="login-password">
            Password <span aria-hidden="true">*</span>
            <div className="shop-login-input-wrapper">
              <Lock size={16} className="shop-login-input-icon" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Masukkan password"
                autoComplete="current-password"
                disabled={pending}
                required
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "error-password" : undefined
                }
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="shop-login-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <small className="shop-error" id="error-password">
                {errors.password}
              </small>
            )}
          </label>
          <div className="shop-login-options">
            <label className="shop-login-remember">
              <input type="checkbox" />
              <span>Ingat saya</span>
            </label>
            <Link href="#" className="shop-login-forgot">
              Lupa password?
            </Link>
          </div>
          {error && (
            <p className="shop-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="shop-button" disabled={pending}>
            {pending ? "Memproses…" : "Masuk"}
            <LogIn size={16} />
          </button>
        </form>

        {/* Demo credentials panel */}
        <div className="shop-demo-credentials">
          <div className="shop-demo-credentials-header">
            <Users size={16} />
            <span>Akun Demo</span>
          </div>
          <div className="shop-demo-credentials-list">
            {demoUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                className={`shop-demo-credential-item ${roleColors[u.role] ?? ""}`}
                onClick={() => fillCredentials(u.email, u.password)}
              >
                <span className="shop-demo-credential-role">
                  {roleLabels[u.role] ?? u.role}
                </span>
                <span className="shop-demo-credential-email">{u.email}</span>
                <span className="shop-demo-credential-password">
                  {u.password}
                </span>
              </button>
            ))}
          </div>
          <p className="shop-demo-credentials-note">
            Klik salah satu untuk mengisi otomatis
          </p>
        </div>

        <div className="shop-login-footer">
          <p>
            Belum punya akun?{" "}
            <Link href="#" className="shop-login-register-link">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
