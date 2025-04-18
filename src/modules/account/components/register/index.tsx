"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        Staňte se členem obchodu Nexto
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        Vytvořte si svůj profil Nexto a získejte přístup k vylepšenému
        nákupnímu zážitku.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Jméno"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Příjmení"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="E-mail"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Telefon"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Heslo"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          Vytvořením účtu souhlasíte s{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            Zásadami ochrany osobních údajů
          </LocalizedClientLink>{" "}
          a{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            Podmínkami použití
          </LocalizedClientLink>{" "}
          obchodu Medusa.
        </span>
        <SubmitButton className="w-full mt-6" data-testid="register-button">
          Připojit se
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Už jste členem?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Přihlaste se
        </button>
        .
      </span>
    </div>
  )
}

export default Register
