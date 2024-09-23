import { Link } from "react-router-dom";

export function Nav() {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link className="list" to="/">
            Home
          </Link>
        </li>
        <li>
          <a className="list" href="/about">
            About
          </a>
        </li>
        <li>
          <a className="list" href="/contact">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}
