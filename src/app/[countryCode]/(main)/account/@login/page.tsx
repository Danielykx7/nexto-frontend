import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Přihlášení",
  description: "Přihlašte se do svého účtu.",
}

export default function Login() {
  return <LoginTemplate />
}
