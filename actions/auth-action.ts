import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export async function signOut() {
  Cookies.remove("user_profile");

  redirect("/login");
}
