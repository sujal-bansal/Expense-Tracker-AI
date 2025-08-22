import { checkUser } from "@/lib/checkUser";

function Navbar() {
  const user = checkUser();
  return <div>Navbar</div>;
}

export default Navbar;
