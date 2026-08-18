"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitContactForm } from "@/lib/actions";
import { initialContactState, type ContactState } from "@/lib/contact";
import { buttonClass, Arrow } from "./ui/button";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";

function SubmitButton({ label, pending }: { label: string; pending: string }) {
  const { pending: isPending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`${buttonClass("primary")} w-full sm:w-auto`}
    >
      {isPending ? pending : label}
      <Arrow />
    </button>
  );
}

const fieldClass =
  "mt-2 w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-[0.95rem] text-ink-900 transition-colors placeholder:text-ink-800/40 hover:border-ink-900/30 focus:border-accent-500";

export function ContactForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const form = dict.contact.form;
  const [state, formAction] = useActionState<ContactState, FormData>(
    submitContactForm,
    initialContactState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const ids = useId();

  const fieldId = (name: string) => `${ids}-${name}`;
  const errorId = (name: string) => `${ids}-${name}-error`;

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      statusRef.current?.focus();
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-accent-500/40 bg-accent-100/40 p-8"
      >
        <h2 className="font-display text-2xl text-ink-900">{form.title}</h2>
        <p className="mt-4 leading-relaxed text-ink-800/85">{form.success}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="rounded-2xl border border-ink-900/10 bg-white p-7 sm:p-9"
    >
      <h2 className="font-display text-2xl text-ink-900">{form.title}</h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-800/75">
        {form.description}
      </p>

      <input type="hidden" name="locale" value={locale} />
      {/* Bot tuzağı — ekran okuyucular ve kullanıcılar için gizli */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={fieldId("website")}>Website</label>
        <input
          id={fieldId("website")}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={fieldId("name")}
            className="text-sm font-medium text-ink-900"
          >
            {form.name}
          </label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={state.fieldErrors?.name ? true : undefined}
            aria-describedby={
              state.fieldErrors?.name ? errorId("name") : undefined
            }
            className={fieldClass}
          />
          {state.fieldErrors?.name ? (
            <p id={errorId("name")} className="mt-2 text-sm text-red-700">
              {state.fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={fieldId("company")}
            className="text-sm font-medium text-ink-900"
          >
            {form.company}
          </label>
          <input
            id={fieldId("company")}
            name="company"
            type="text"
            autoComplete="organization"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor={fieldId("email")}
            className="text-sm font-medium text-ink-900"
          >
            {form.email}
          </label>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={state.fieldErrors?.email ? true : undefined}
            aria-describedby={
              state.fieldErrors?.email ? errorId("email") : undefined
            }
            className={fieldClass}
          />
          {state.fieldErrors?.email ? (
            <p id={errorId("email")} className="mt-2 text-sm text-red-700">
              {state.fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={fieldId("phone")}
            className="text-sm font-medium text-ink-900"
          >
            {form.phone}{" "}
            <span className="font-normal text-ink-800/50">
              ({form.phoneOptional})
            </span>
          </label>
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            className={fieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={fieldId("topic")}
            className="text-sm font-medium text-ink-900"
          >
            {form.topic}
          </label>
          <select
            id={fieldId("topic")}
            name="topic"
            defaultValue=""
            className={fieldClass}
          >
            <option value="" disabled>
              {form.topicPlaceholder}
            </option>
            {form.topicOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={fieldId("message")}
            className="text-sm font-medium text-ink-900"
          >
            {form.message}
          </label>
          <textarea
            id={fieldId("message")}
            name="message"
            rows={5}
            required
            aria-invalid={state.fieldErrors?.message ? true : undefined}
            aria-describedby={
              state.fieldErrors?.message ? errorId("message") : undefined
            }
            className={`${fieldClass} resize-y`}
          />
          {state.fieldErrors?.message ? (
            <p id={errorId("message")} className="mt-2 text-sm text-red-700">
              {state.fieldErrors.message}
            </p>
          ) : null}
        </div>
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="mt-6 text-sm text-red-700">
          {state.message}
        </p>
      ) : null}

      <p className="mt-7 text-xs leading-relaxed text-ink-800/60">
        {form.consent}
      </p>

      <div className="mt-6">
        <SubmitButton label={form.submit} pending={form.submitting} />
      </div>
    </form>
  );
}
